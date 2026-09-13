"use server";

import connectToDb from "@/config/connectToDb";
import { auth } from "@/lib/auth";
import GrantModel from "@/models/grant.model";
import mongoose from "mongoose";
import { headers } from "next/headers";
import { createNotification } from "./notification.action";
import { NotificationCategory } from "@/constants";
import { sendEmail } from "@/lib/mail";
import {
  getGrantSubmissionAdminTemplate,
  getGrantSubmissionUserTemplate,
  getGrantStatusUpdateTemplate,
} from "@/lib/email-templates/grant-emails";

export interface SubmitGrantInput {
  applicationType: "individual" | "company";
  companyName?: string;
  ein?: string;
  fullName?: string;
  ssn?: string;
  projectDescription: string;
}

export async function submitGrantApplication(data: SubmitGrantInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: "User not authenticated" };
    }

    await connectToDb();

    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    const grant = await GrantModel.create({
      userId: userObjectId,
      applicationType: data.applicationType,
      companyName: data.companyName,
      ein: data.ein,
      fullName: data.fullName,
      ssn: data.ssn,
      projectDescription: data.projectDescription,
      status: "pending",
    });

    // Notify admin
    if (process.env.EMAIL_USER) {
      try {
        await sendEmail({
          to: process.env.EMAIL_USER,
          subject: `New Grant Application: ${data.applicationType.toUpperCase()} - ${session.user.name || session.user.email}`,
          html: getGrantSubmissionAdminTemplate({
            applicantName: session.user.name || "User",
            userEmail: session.user.email,
            applicationType: data.applicationType,
            companyName: data.companyName,
            ein: data.ein,
            fullName: data.fullName,
            ssn: data.ssn,
            projectDescription: data.projectDescription,
            grantId: grant._id.toString(),
          }),
        });
      } catch (err) {
        console.error("Failed to send admin grant notification email:", err);
      }
    }

    // Confirmation to applicant
    if (session.user.email) {
      try {
        await sendEmail({
          to: session.user.email,
          subject: `Grant Application Received - Qauntum Secure Guard (ID: ${grant._id.toString().slice(-6).toUpperCase()})`,
          html: getGrantSubmissionUserTemplate({
            name: session.user.name || "Valued Applicant",
            grantId: grant._id.toString(),
            applicationType: data.applicationType,
          }),
        });
      } catch (err) {
        console.error("Failed to send applicant grant confirmation email:", err);
      }
    }

    return {
      success: true,
      grantId: grant._id.toString(),
    };
  } catch (error) {
    console.error("Error submitting grant application:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to submit grant application",
    };
  }
}

export async function getUserGrants() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { grants: [], error: "User not authenticated" };
    }

    await connectToDb();

    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    const grants = await GrantModel.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .lean();

    const formattedGrants = grants.map((g) => ({
      id: (g._id as mongoose.Types.ObjectId).toString(),
      applicationType: g.applicationType,
      companyName: g.companyName || "",
      ein: g.ein || "",
      fullName: g.fullName || "",
      ssn: g.ssn || "",
      projectDescription: g.projectDescription,
      status: g.status,
      submittedOn: new Date(g.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));

    return { grants: formattedGrants, error: null };
  } catch (error) {
    console.error("Error fetching user grants:", error);
    return { grants: [], error: "Failed to fetch grant applications" };
  }
}

export async function getAllGrantsAdmin() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return { grants: [], error: "Unauthorized access" };
    }

    await connectToDb();

    const grants = await GrantModel.find({})
      .sort({ createdAt: -1 })
      .lean();

    let userMap = new Map<string, { email: string; name: string }>();
    try {
      const listOfUsers = await auth.api.listUsers({
        query: {},
        headers: await headers(),
      });
      if (listOfUsers?.users) {
        for (const u of listOfUsers.users) {
          userMap.set(u.id, { email: u.email, name: u.name });
        }
      }
    } catch {
      // ignore user list error if any
    }

    const formattedGrants = grants.map((g) => {
      const userIdStr = g.userId ? g.userId.toString() : "";
      const userInfo = userMap.get(userIdStr);
      const applicantName =
        g.applicationType === "company"
          ? (g.companyName || g.fullName || userInfo?.name || "—")
          : (g.fullName || userInfo?.name || "—");

      return {
        id: (g._id as mongoose.Types.ObjectId).toString(),
        userId: userIdStr,
        applicationType: g.applicationType,
        applicantName,
        companyName: g.companyName || "",
        ein: g.ein || "",
        fullName: g.fullName || "",
        ssn: g.ssn || "",
        projectDescription: g.projectDescription,
        status: g.status,
        userAccountEmail: userInfo?.email || "",
        userAccountName: userInfo?.name || "",
        submittedOn: new Date(g.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      };
    });

    return { grants: formattedGrants, error: null };
  } catch (error) {
    console.error("Error fetching all grants for admin:", error);
    return { grants: [], error: "Failed to fetch grant applications" };
  }
}

export async function updateGrantStatusAdmin(grantId: string, status: "approved" | "pending" | "rejected") {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return { error: "Unauthorized access" };
    }

    await connectToDb();

    const grant = await GrantModel.findByIdAndUpdate(
      grantId,
      { status },
      { new: true }
    );

    if (!grant) {
      return { error: "Grant application not found" };
    }

    // Send notification to user
    try {
      await createNotification({
        userId: grant.userId.toString(),
        type: NotificationCategory.KYC_UPDATE,
        title: `Grant Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: `Your grant application (Request ID: ${grant._id.toString()}) status has been updated to ${status}.`,
      });
    } catch (notifErr) {
      console.error("Notification creation failed:", notifErr);
    }

    // Send email to user upon approval or rejection
    if (status === "approved" || status === "rejected") {
      try {
        const applicantUser = (await auth.api.getUser({
          query: { id: grant.userId.toString() },
          headers: await headers(),
        })) as any;

        if (applicantUser?.email) {
          const subject =
            status === "approved"
              ? "🎉 Your Grant Application Has Been Approved! - Qauntum Secure Guard"
              : "Grant Application Status Update - Qauntum Secure Guard";

          await sendEmail({
            to: applicantUser.email,
            subject,
            html: getGrantStatusUpdateTemplate({
              name: applicantUser.name || "Valued Applicant",
              grantId: grant._id.toString(),
              status,
            }),
          });
        }
      } catch (emailErr) {
        console.error("Failed to send grant status update email:", emailErr);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating grant status:", error);
    return { error: error instanceof Error ? error.message : "Failed to update grant status" };
  }
}
