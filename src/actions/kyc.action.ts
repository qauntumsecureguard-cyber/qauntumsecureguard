"use server";

import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/mail";
import { v2 as cloudinary } from "cloudinary";
import { headers } from "next/headers";

import { createNotification } from "./notification.action";
import { NotificationCategory } from "@/constants";
import { getKycSubmissionAdminTemplate } from "@/lib/email-templates/kyc-submission-admin";
import {
  getKycApprovedTemplate,
  getKycRejectedTemplate,
} from "@/lib/email-templates/kyc-status-update";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export async function uploadImage(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "qfs-trading",
      },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          return reject(new Error("Upload failed"));
        }

        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

export const uploadKyc = async (type: string, file: File) => {
  const url = await uploadImage(file);
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) return;

  await auth.api.updateUser({
    body: {
      kyc: {
        status: "pending",
        image: url,
        type
      }
    },
    headers: await headers()
  })

  await createNotification({
    userId: session.user.id,
    type: NotificationCategory.KYC_UPDATE,
    title: "KYC Submitted",
    description: `Your ${type} has been submitted for verification.`,
  });

  await sendEmail({
    to: process.env.EMAIL_USER!,
    subject: "New KYC Submission",
    html: getKycSubmissionAdminTemplate(
      type,
      url,
      session.user.name,
      session.user.email
    ),
  });
}

export const updateKycStatus = async ({
  userId,
  status,
  currentKyc
}: {
  userId: string;
  status: "approved" | "pending" | "rejected";
  currentKyc: { status: string; image: string; type: string };
}) => {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  const userToUpdate = await auth.api.getUser({
    query: { id: userId },
    headers: reqHeaders
  }) as any;

  if (!userToUpdate) return { error: "User not found" };

  const isNewApproval = status === "approved" && currentKyc.status !== "approved";

  let updatedCoins = userToUpdate.coins;
  if (isNewApproval) {
    let coinsObj: Record<string, any> = {};
    try {
      coinsObj = typeof userToUpdate.coins === "string" ? JSON.parse(userToUpdate.coins) : (userToUpdate.coins || {});
    } catch {
      coinsObj = {};
    }

    if (!coinsObj["USDT_TRC20"]) {
      coinsObj["USDT_TRC20"] = { balance: 0, network: "TRC20" };
    }
    const currentBalance = Number(coinsObj["USDT_TRC20"].balance) || 0;
    coinsObj["USDT_TRC20"].balance = currentBalance + 5;
    updatedCoins = JSON.stringify(coinsObj);
  }

  await auth.api.adminUpdateUser({
    body: {
      userId: userId,
      data: {
        kyc: {
          ...currentKyc,
          status
        },
        ...(isNewApproval ? { coins: updatedCoins } : {})
      }
    },
    headers: reqHeaders
  });

  const notifTitle = `KYC ${status.charAt(0).toUpperCase() + status.slice(1)}`;
  const notifDesc = isNewApproval
    ? "Your KYC verification has been approved! You have been credited with a $5 USDT bonus."
    : `Your KYC verification status has been updated to ${status}.`;

  await createNotification({
    userId,
    type: NotificationCategory.KYC_UPDATE,
    title: notifTitle,
    description: notifDesc,
    ...(isNewApproval ? { to: "USDT", toAmount: 5 } : {})
  });

  if (userToUpdate.email && (status === "approved" || status === "rejected")) {
    try {
      const emailHtml =
        status === "approved"
          ? getKycApprovedTemplate(userToUpdate.name || "Valued Member")
          : getKycRejectedTemplate(userToUpdate.name || "Valued Member");

      const emailSubject =
        status === "approved"
          ? "KYC Verification Approved - $5 USDT Credited! 🎉"
          : "KYC Verification Requires Attention - Qauntum Secure Guard";

      await sendEmail({
        to: userToUpdate.email,
        subject: emailSubject,
        html: emailHtml,
      });
    } catch (err) {
      console.error("Failed to send KYC status notification email:", err);
    }
  }

  return { success: true };
};