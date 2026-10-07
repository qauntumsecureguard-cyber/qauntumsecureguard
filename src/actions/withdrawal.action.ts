"use server";

import connectToDb from "@/config/connectToDb";
import { NotificationCategory } from "@/constants";
import { getAssetsData } from "@/lib/assets";
import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/mail";
import { getWithdrawalStatusUpdateTemplate } from "@/lib/email-templates/withdrawal-status-update";
import CardModel from "@/models/card.model";
import NotificationModel from "@/models/notification.model";
import WithdrawalModel from "@/models/withdrawal.model";
import crypto from "crypto";
import mongoose from "mongoose";
import { headers } from "next/headers";
import { createNotification } from "./notification.action";

// Helper to generate a realistic crypto transaction hash
function generateTransactionHash(): string {
  const bytes = crypto.randomBytes(32);
  return `0x${bytes.toString("hex")}`;
}

export async function checkUserWithdrawalEligibility() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { canWithdraw: false, error: "Not authenticated" };
    }

    await connectToDb();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const approvedCard = await CardModel.findOne({
      userId,
      status: "approved",
    }).lean();

    if (!approvedCard) {
      return {
        canWithdraw: false,
        error: "You must activate your Qauntum Secure Guard card before withdrawing funds.",
      };
    }

    return {
      canWithdraw: true,
      cardType: (approvedCard as any).cardType,
      cardNumber: (approvedCard as any).cardNumber,
    };
  } catch (err: any) {
    console.error("checkUserWithdrawalEligibility error:", err);
    return { canWithdraw: false, error: "Failed to verify withdrawal eligibility" };
  }
}

export async function createWithdrawalRequest(input: {
  coin: string;
  network: string;
  amount: number;
  recipientAddress: string;
}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { error: "Please sign in to proceed with withdrawal." };
    }

    const coin = input.coin.trim().toUpperCase();
    const network = input.network.trim().toUpperCase();
    const amount = Number(input.amount);
    const recipientAddress = input.recipientAddress.trim();

    if (!recipientAddress || recipientAddress.length < 15) {
      return { error: "Please provide a valid recipient wallet address." };
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return { error: "Please enter a valid withdrawal amount." };
    }

    await connectToDb();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    // 1. Mandatory Check: Must have an APPROVED / ACTIVATED Card
    const approvedCard = await CardModel.findOne({
      userId,
      status: "approved",
    }).lean();

    if (!approvedCard) {
      // Create notification to alert user they tried to withdraw without activated card
      try {
        await createNotification({
          userId: session.user.id,
          title: "Withdrawal Restricted",
          description: "Card activation is required before withdrawal can be processed.",
          type: NotificationCategory.WITHDRAW,
          from: coin,
          fromAmount: amount,
        });
      } catch (notifErr) {
        console.error("Failed to create restricted notification:", notifErr);
      }

      return {
        error: "You must activate your Qauntum Secure Guard card before requesting a withdrawal.",
        cardRequired: true,
      };
    }

    // 2. Calculate USD Value & Fee
    const { coinData } = await getAssetsData();
    const asset = coinData.find(
      (item) =>
        item.symbol.toUpperCase() === coin &&
        (network === "NATIVE" ? !item.network : item.network?.toUpperCase() === network)
    );
    const price = asset?.price || 0;
    const usdValue = amount * price;
    const fee = 0.0;

    // 3. Generate unique Transaction Hash
    let txHash = generateTransactionHash();
    // Ensure uniqueness
    let exists = await WithdrawalModel.findOne({ txHash }).lean();
    while (exists) {
      txHash = generateTransactionHash();
      exists = await WithdrawalModel.findOne({ txHash }).lean();
    }

    // 4. Create Withdrawal record
    const withdrawal = await WithdrawalModel.create({
      userId,
      coin,
      network,
      amount,
      recipientAddress,
      txHash,
      usdValue,
      fee,
      status: "pending",
    });

    // 5. In-app Notification with Tx Hash
    try {
      await createNotification({
        userId: session.user.id,
        title: "Withdrawal Request Submitted",
        description: `Withdrawal of ${amount} ${coin} initiated. Tx Hash: ${txHash}. Forward this hash to 24/7 Support to finalize your transfer.`,
        type: NotificationCategory.WITHDRAW,
        from: coin,
        fromAmount: amount,
      });
    } catch (notifErr) {
      console.error("Failed to create withdrawal notification:", notifErr);
    }

    // 6. Alert Admin via Email if configured
    if (process.env.EMAIL_USER) {
      try {
        await sendEmail({
          to: process.env.EMAIL_USER,
          subject: `⚡ New Withdrawal Request (${amount} ${coin}) - Tx: ${txHash.slice(0, 10)}...`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
              <h2 style="color: #0284c7; margin-bottom: 8px;">New Withdrawal Request Generated</h2>
              <p>A client has requested a withdrawal with an activated card:</p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 4px 0;"><strong>User:</strong> ${session.user.name} (${session.user.email})</p>
                <p style="margin: 4px 0;"><strong>Asset:</strong> ${coin} (${network})</p>
                <p style="margin: 4px 0;"><strong>Amount:</strong> ${amount} ${coin} (~$${usdValue.toFixed(2)} USD)</p>
                <p style="margin: 4px 0;"><strong>Recipient:</strong> <code style="background: #eee; padding: 2px 6px; border-radius: 4px;">${recipientAddress}</code></p>
                <p style="margin: 8px 0 4px;"><strong>Transaction Hash:</strong></p>
                <p style="background: #1e293b; color: #38bdf8; padding: 10px; border-radius: 6px; font-family: monospace; word-break: break-all; margin: 0;">${txHash}</p>
              </div>
              <p style="color: #64748b; font-size: 13px;">The user has been instructed to forward this Transaction Hash to Support for verification.</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send admin withdrawal alert email:", emailErr);
      }
    }

    return {
      success: true,
      txHash,
      withdrawalId: withdrawal._id.toString(),
      amount,
      coin,
      network,
      recipientAddress,
      usdValue,
    };
  } catch (err: any) {
    console.error("createWithdrawalRequest error:", err);
    return {
      error: err instanceof Error ? err.message : "Failed to initiate withdrawal",
    };
  }
}

export async function getUserWithdrawals() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { withdrawals: [], error: "Not authenticated" };

    await connectToDb();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const withdrawals = await WithdrawalModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = withdrawals.map((w) => ({
      id: (w._id as mongoose.Types.ObjectId).toString(),
      coin: w.coin,
      network: w.network,
      amount: w.amount,
      recipientAddress: w.recipientAddress,
      txHash: w.txHash,
      usdValue: w.usdValue,
      fee: w.fee,
      status: w.status,
      createdAt: new Date(w.createdAt).toISOString(),
    }));

    return { withdrawals: formatted, error: null };
  } catch (err: any) {
    console.error("getUserWithdrawals error:", err);
    return { withdrawals: [], error: "Failed to fetch withdrawals" };
  }
}

export async function getAllWithdrawalsAdmin() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { withdrawals: [], error: "Unauthorized access" };
    }

    await connectToDb();

    const withdrawals = await WithdrawalModel.find({})
      .sort({ createdAt: -1 })
      .lean();

    const userMap = new Map<string, { email: string; name: string }>();
    try {
      const listOfUsers = await auth.api.listUsers({
        query: { limit: 250 },
        headers: await headers(),
      });
      if (listOfUsers?.users) {
        for (const u of listOfUsers.users) {
          userMap.set(u.id, { email: u.email, name: u.name });
        }
      }
    } catch {
      // ignore
    }

    const formatted = withdrawals.map((w) => {
      const userIdStr = w.userId ? w.userId.toString() : "";
      const userInfo = userMap.get(userIdStr);

      return {
        id: (w._id as mongoose.Types.ObjectId).toString(),
        userId: userIdStr,
        userName: userInfo?.name || "Client",
        userEmail: userInfo?.email || "",
        coin: w.coin,
        network: w.network,
        amount: w.amount,
        recipientAddress: w.recipientAddress,
        txHash: w.txHash,
        usdValue: w.usdValue,
        fee: w.fee,
        status: w.status as "pending" | "approved" | "completed" | "rejected",
        adminNotes: w.adminNotes || "",
        createdAt: new Date(w.createdAt).toISOString(),
        submittedOn: new Date(w.createdAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    return { withdrawals: formatted, error: null };
  } catch (err: any) {
    console.error("getAllWithdrawalsAdmin error:", err);
    return { withdrawals: [], error: "Failed to load withdrawal requests" };
  }
}

export async function updateWithdrawalStatusAdmin(
  withdrawalId: string,
  status: "pending" | "approved" | "completed" | "rejected",
  adminNotes?: string
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { error: "Unauthorized access" };
    }

    await connectToDb();

    const existing = await WithdrawalModel.findById(withdrawalId);
    if (!existing) {
      return { error: "Withdrawal record not found" };
    }

    const updateData: any = { status };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    const updated = await WithdrawalModel.findByIdAndUpdate(
      withdrawalId,
      updateData,
      { new: true }
    );

    if (!updated) {
      return { error: "Failed to update withdrawal record" };
    }

    const isSuccess = status === "approved" || status === "completed";
    const statusTitle = isSuccess
      ? "Withdrawal Approved & Processed 🎉"
      : status === "rejected"
      ? "Withdrawal Request Rejected"
      : "Withdrawal Status Update";

    // In-app notification to user
    try {
      await createNotification({
        userId: updated.userId.toString(),
        type: isSuccess ? NotificationCategory.RECEIVE : NotificationCategory.WITHDRAW,
        title: statusTitle,
        description: isSuccess
          ? `Your withdrawal of ${updated.amount} ${updated.coin} (Tx: ${updated.txHash.slice(0, 10)}...) has been approved and released.`
          : status === "rejected"
          ? `Your withdrawal of ${updated.amount} ${updated.coin} was rejected. Contact support for details.`
          : `Your withdrawal status has been updated to ${status}.`,
        from: updated.coin,
        fromAmount: updated.amount,
      });
    } catch (notifErr) {
      console.error("Notification update failed:", notifErr);
    }

    // Email to user
    try {
      const user = (await auth.api.getUser({
        query: { id: updated.userId.toString() },
        headers: await headers(),
      })) as any;

      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: `${statusTitle} - Qauntum Secure Guard`,
          html: getWithdrawalStatusUpdateTemplate({
            name: user.name || "Valued Customer",
            amount: updated.amount,
            coin: updated.coin,
            network: updated.network,
            usdValue: updated.usdValue,
            txHash: updated.txHash,
            recipientAddress: updated.recipientAddress,
            status,
          }),
        });
      }
    } catch (emailErr) {
      console.error("Failed to send withdrawal update email:", emailErr);
    }

    return { success: true };
  } catch (err: any) {
    console.error("updateWithdrawalStatusAdmin error:", err);
    return {
      error: err instanceof Error ? err.message : "Failed to update withdrawal status",
    };
  }
}
