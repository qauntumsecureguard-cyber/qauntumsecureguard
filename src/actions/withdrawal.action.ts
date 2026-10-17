"use server";

import connectToDb from "@/config/connectToDb";
import { NotificationCategory } from "@/constants";
import { getAssetsData } from "@/lib/assets";
import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/mail";
import { getWithdrawalStatusUpdateTemplate } from "@/lib/email-templates/withdrawal-status-update";
import { getCoinKey } from "@/lib/utils";
import CardModel from "@/models/card.model";
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

async function adjustUserCoinBalance(
  userId: string,
  coin: string,
  network: string,
  amountDelta: number
): Promise<{ balance: number } | { error: string }> {
  const db = await connectToDb();
  const users = db.collection("user");
  const coinKey = getCoinKey({
    symbol: coin,
    network: network === "NATIVE" ? null : network,
  });
  const userIdFilter = mongoose.Types.ObjectId.isValid(userId)
    ? {
        $or: [
          { _id: new mongoose.Types.ObjectId(userId) },
          { _id: userId },
          { id: userId },
        ],
      }
    : { $or: [{ _id: userId }, { id: userId }] };
  const requestHeaders = await headers();

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const session = await auth.api.getSession({ headers: requestHeaders });
    const user =
      session?.user.id === userId
        ? session.user
        : await auth.api.getUser({
            query: { id: userId },
            headers: requestHeaders,
          });
    if (!user) return { error: "User account not found." };

    let coins: Record<string, { balance?: number; network?: string }>;
    try {
      coins = JSON.parse(user.coins || "{}") as Record<
        string,
        { balance?: number; network?: string }
      >;
    } catch {
      return { error: "Could not read the saved account balance." };
    }

    const currentCoin = coins[coinKey] || { balance: 0 };
    const currentBalance = Number(currentCoin.balance) || 0;
    const updatedBalance = currentBalance + amountDelta;
    if (!Number.isFinite(updatedBalance) || updatedBalance < 0) {
      return { error: "Insufficient balance for this withdrawal." };
    }

    coins[coinKey] = {
      ...currentCoin,
      balance: updatedBalance,
      ...(network !== "NATIVE" ? { network } : {}),
    };

    const result = await users.updateOne(
      {
        $and: [
          userIdFilter,
          user.coins === undefined
            ? { coins: { $exists: false } }
            : { coins: user.coins },
        ],
      },
      { $set: { coins: JSON.stringify(coins) } }
    );
    if (result.modifiedCount === 1) return { balance: updatedBalance };
  }

  return { error: "Balance changed while processing. Please try again." };
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

    // Reserve the funds immediately so pending requests cannot be spent twice.
    const debit = await adjustUserCoinBalance(session.user.id, coin, network, -amount);
    if ("error" in debit) return { error: debit.error };

    let withdrawal;
    try {
      withdrawal = await WithdrawalModel.create({
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
    } catch (error) {
      try {
        const refund = await adjustUserCoinBalance(session.user.id, coin, network, amount);
        if ("error" in refund) {
          console.error("Failed to restore balance after withdrawal creation failed:", refund.error);
        }
      } catch (refundError) {
        console.error("Failed to restore balance after withdrawal creation failed:", refundError);
      }
      throw error;
    }

    // 5. In-app Notification with Tx Hash
    try {
      await createNotification({
        userId: session.user.id,
        title: "Withdrawal Pending",
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

    const updateData: {
      status: "pending" | "approved" | "completed" | "rejected";
      adminNotes?: string;
    } = { status };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    const previousStatus = existing.status;
    const updated = await WithdrawalModel.findOneAndUpdate(
      { _id: withdrawalId, status: previousStatus },
      updateData,
      { new: true }
    );

    if (!updated) {
      return { error: "Withdrawal status changed. Refresh and try again." };
    }

    const balanceDelta =
      status === "rejected" && previousStatus !== "rejected"
        ? updated.amount
        : previousStatus === "rejected" && status !== "rejected"
        ? -updated.amount
        : 0;

    if (balanceDelta !== 0) {
      let balanceError: string | null = null;
      try {
        const balanceUpdate = await adjustUserCoinBalance(
          updated.userId.toString(),
          updated.coin,
          updated.network,
          balanceDelta
        );
        if ("error" in balanceUpdate) balanceError = balanceUpdate.error;
      } catch (error) {
        console.error("Failed to adjust balance for withdrawal status change:", error);
        balanceError = "Could not update the user's balance. Please retry.";
      }

      if (balanceError) {
        const rollback = await WithdrawalModel.updateOne(
          { _id: updated._id, status },
          { $set: { status: previousStatus, adminNotes: existing.adminNotes } }
        );
        if (rollback.modifiedCount !== 1) {
          console.error(
            `Could not restore withdrawal ${updated._id.toString()} status after balance update failed:`,
            balanceError
          );
        }
        return { error: balanceError };
      }
    }

    const isSuccess = status === "approved" || status === "completed";
    const statusTitle = isSuccess
      ? "Withdrawal Approved"
      : status === "rejected"
      ? "Withdrawal Request Rejected"
      : "Withdrawal Pending";

    // In-app notification to user
    try {
      await createNotification({
        userId: updated.userId.toString(),
        type: NotificationCategory.WITHDRAW,
        title: statusTitle,
        description: isSuccess
          ? `Your withdrawal of ${updated.amount} ${updated.coin} (Tx: ${updated.txHash.slice(0, 10)}...) has been approved and released.`
          : status === "rejected"
          ? `Your withdrawal of ${updated.amount} ${updated.coin} was rejected. Contact support for details.`
          : `Your withdrawal of ${updated.amount} ${updated.coin} is currently pending.`,
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
