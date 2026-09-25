"use server";

import connectToDb from "@/config/connectToDb";
import { NotificationCategory } from "@/constants";
import { getAssetsData } from "@/lib/assets";
import { auth } from "@/lib/auth";
import { getCoinKey } from "@/lib/utils";
import { sendEmail } from "@/lib/mail";
import { getDepositApprovedTemplate } from "@/lib/email-templates/deposit-approved";
import { getDepositRejectedTemplate } from "@/lib/email-templates/deposit-rejected";
import DepositModel from "@/models/deposit.model";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { headers } from "next/headers";
import { createNotification } from "./notification.action";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const activeStatuses = ["draft", "pending"];

export async function getUserDepositRequest() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  await connectToDb();
  const request = await DepositModel.findOne({
    userId: new mongoose.Types.ObjectId(session.user.id),
    status: { $in: activeStatuses },
  }).sort({ updatedAt: -1 }).lean();

  if (!request) return null;
  return {
    id: (request._id as mongoose.Types.ObjectId).toString(),
    coin: request.coin,
    network: request.network,
    amount: request.amount,
    usdValue: request.usdValue,
    proofUrl: request.proofUrl,
    status: request.status as "draft" | "pending",
    updatedAt: new Date(request.updatedAt).toISOString(),
  };
}

export async function saveDepositDraft(input: {
  coin: string;
  network: string;
  amount: number;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Please sign in to create a deposit." };

  const coin = input.coin.trim().toUpperCase();
  const network = input.network.trim().toUpperCase();
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Enter a valid deposit amount." };
  }

  const { coinData } = await getAssetsData();
  const asset = coinData.find(
    (item) => item.symbol.toUpperCase() === coin &&
      (network === "NATIVE" ? !item.network : item.network?.toUpperCase() === network)
  );
  if (!asset || asset.price <= 0) {
    return { error: "This coin or network is not currently available for deposits." };
  }

  const usdValue = amount * asset.price;
  if (usdValue < 1000) {
    return { error: "The minimum deposit is $1,000 USD." };
  }

  await connectToDb();
  const userId = new mongoose.Types.ObjectId(session.user.id);
  const existing = await DepositModel.findOne({ userId, status: { $in: activeStatuses } })
    .sort({ updatedAt: -1 });

  if (existing?.status === "pending") {
    return { error: "Your deposit proof is already submitted and is awaiting admin approval." };
  }

  const request = existing
    ? await DepositModel.findByIdAndUpdate(existing._id, {
        coin,
        network,
        amount,
        usdValue,
      }, { new: true })
    : await DepositModel.create({
        userId,
        coin,
        network,
        amount,
        usdValue,
        status: "draft",
      });

  if (!request) return { error: "Could not save your deposit request." };
  return {
    success: true,
    request: {
      id: request._id.toString(),
      coin: request.coin,
      network: request.network,
      amount: request.amount,
      usdValue: request.usdValue,
      proofUrl: request.proofUrl,
      status: request.status as "draft",
      updatedAt: request.updatedAt.toISOString(),
    },
  };
}

export async function submitDepositProof(depositId: string, file: File) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Please sign in to submit proof." };
  if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return { error: "Upload a JPG, PNG, or WebP image." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { error: "The proof image must be 8 MB or smaller." };
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return { error: "Proof uploads are not configured. Please contact support." };
  }

  await connectToDb();
  const userId = new mongoose.Types.ObjectId(session.user.id);
  const request = await DepositModel.findOne({ _id: depositId, userId, status: "draft" });
  if (!request) return { error: "This deposit request is no longer available." };

  const buffer = Buffer.from(await file.arrayBuffer());
  const proofUrl = await new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "qfs-trading/deposit-proofs", resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(new Error("Proof upload failed."));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  }).catch((error: unknown) => {
    console.error("Deposit proof upload failed:", error);
    return null;
  });

  if (!proofUrl) return { error: "Proof upload failed. Please try again." };

  const updated = await DepositModel.findOneAndUpdate(
    { _id: request._id, userId, status: "draft" },
    { proofUrl, status: "pending" },
    { new: true }
  );
  if (!updated) return { error: "This deposit request has already been submitted." };

  try {
    await createNotification({
      userId: session.user.id,
      type: NotificationCategory.DEPOSIT,
      title: "Deposit Proof Submitted",
      description: `Your ${updated.amount} ${updated.coin} deposit is awaiting admin approval.`,
      to: updated.coin,
      toAmount: updated.amount,
    });
  } catch (error) {
    console.error("Could not create deposit notification:", error);
  }

  return { success: true };
}

export async function getAllDepositsAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return { deposits: [], error: "Unauthorized" };
  }

  await connectToDb();
  const rows = await DepositModel.find().sort({ createdAt: -1 }).lean();
  const userEmails = new Map<string, string>();
  try {
    const users = await auth.api.listUsers({ query: {}, headers: await headers() });
    for (const user of users?.users ?? []) userEmails.set(user.id, user.email);
  } catch (error) {
    console.error("Could not load deposit account emails:", error);
  }

  return {
    deposits: rows.map((row) => ({
      id: (row._id as mongoose.Types.ObjectId).toString(),
      userId: row.userId.toString(),
      email: userEmails.get(row.userId.toString()) || "",
      coin: row.coin,
      network: row.network,
      amount: row.amount,
      usdValue: row.usdValue,
      proofUrl: row.proofUrl,
      status: row.status as "draft" | "pending" | "approved" | "rejected",
      submittedOn: new Date(row.updatedAt).toLocaleDateString("en-GB"),
    })),
    error: null,
  };
}

export async function updateDepositStatusAdmin(
  depositId: string,
  status: "approved" | "rejected"
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") return { error: "Unauthorized" };

  await connectToDb();
  const deposit = await DepositModel.findOneAndUpdate(
    { _id: depositId, status: "pending" },
    { status },
    { new: true }
  );
  if (!deposit) return { error: "Pending deposit request not found." };

  let depositOwner: { name?: string; email?: string } | null = null;
  if (status === "approved") {
    try {
      const user = await auth.api.getUser({
        query: { id: deposit.userId.toString() },
        headers: await headers(),
      }) as { coins?: string; name?: string; email?: string } | null;
      if (!user) throw new Error("Deposit owner not found.");
      depositOwner = user;

      const coins = JSON.parse(user.coins || "{}") as Record<string, { balance?: number; network?: string }>;
      const asset = { symbol: deposit.coin, network: deposit.network === "NATIVE" ? null : deposit.network };
      const coinKey = getCoinKey(asset);
      const currentCoin = coins[coinKey] || { balance: 0 };
      coins[coinKey] = {
        ...currentCoin,
        balance: (Number(currentCoin.balance) || 0) + deposit.amount,
        ...(asset.network ? { network: asset.network } : {}),
      };

      await auth.api.adminUpdateUser({
        body: { userId: deposit.userId.toString(), data: { coins: JSON.stringify(coins) } },
        headers: await headers(),
      });
    } catch (error) {
      await DepositModel.updateOne({ _id: deposit._id, status: "approved" }, { status: "pending" });
      console.error("Could not credit approved deposit:", error);
      return { error: "Deposit was not credited. Please retry the approval." };
    }
  }

  try {
    await createNotification({
      userId: deposit.userId.toString(),
      type: NotificationCategory.DEPOSIT,
      title: `Deposit ${status === "approved" ? "Approved" : "Rejected"}`,
      description: `Your ${deposit.amount} ${deposit.coin} deposit has been ${status}.`,
      to: deposit.coin,
      toAmount: status === "approved" ? deposit.amount : undefined,
    });
  } catch (error) {
    console.error("Could not create deposit status notification:", error);
  }

  if (status === "approved" && depositOwner?.email) {
    try {
      await sendEmail({
        to: depositOwner.email,
        subject: "Your Deposit Has Been Approved - Qauntum Secure Guard",
        html: getDepositApprovedTemplate({
          name: depositOwner.name || "Valued Client",
          amount: deposit.amount,
          coin: deposit.coin,
          network: deposit.network,
          usdValue: deposit.usdValue,
          depositId: deposit._id.toString(),
        }),
      });
    } catch (error) {
      console.error("Could not send deposit approval email:", error);
    }
  }

  if (status === "rejected") {
    try {
      const user = await auth.api.getUser({
        query: { id: deposit.userId.toString() },
        headers: await headers(),
      }) as { name?: string; email?: string } | null;

      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: "Your Deposit Request Needs Attention - Qauntum Secure Guard",
          html: getDepositRejectedTemplate({
            name: user.name || "Valued Client",
            amount: deposit.amount,
            coin: deposit.coin,
            network: deposit.network,
            usdValue: deposit.usdValue,
            depositId: deposit._id.toString(),
          }),
        });
      }
    } catch (error) {
      console.error("Could not send deposit rejection email:", error);
    }
  }

  return { success: true };
}