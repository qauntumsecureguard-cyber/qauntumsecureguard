"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import connectToDb from "@/config/connectToDb";
import Wallet from "@/models/wallet.model";
import Card from "@/models/card.model";
import Deposit from "@/models/deposit.model";
import Grant from "@/models/grant.model";
import TaxRefund from "@/models/tax-refund.model";
import Notification from "@/models/notification.model";
import Withdrawal from "@/models/withdrawal.model";

/**
 * Delete a single user and all their associated data.
 * Only admins can call this action.
 */
export async function deleteUser(userId: string) {
  try {
    await connectToDb();

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    // 1. Delete all associated data from our own collections
    await Promise.allSettled([
      Wallet.deleteMany({ userId }),
      Card.deleteMany({ userId }),
      Deposit.deleteMany({ userId }),
      Grant.deleteMany({ userId }),
      TaxRefund.deleteMany({ userId }),
      Notification.deleteMany({ userId }),
      Withdrawal.deleteMany({ userId }),
    ]);

    // 2. Delete the user from better-auth (also removes sessions/accounts)
    await auth.api.removeUser({
      body: { userId },
      headers: await headers(),
    });

    return { success: true };
  } catch (err: any) {
    console.error("[deleteUser]", err);
    return { success: false, error: err?.message || "Failed to delete user" };
  }
}

/**
 * Delete multiple users and all their associated data.
 * Only admins can call this action.
 */
export async function deleteUsers(userIds: string[]) {
  if (!userIds.length) return { success: true, deleted: 0, errors: [] };

  const results = await Promise.allSettled(userIds.map((id) => deleteUser(id)));

  const errors: string[] = [];
  let deleted = 0;

  results.forEach((r, i) => {
    if (r.status === "fulfilled" && r.value.success) {
      deleted++;
    } else {
      const msg =
        r.status === "rejected"
          ? r.reason?.message
          : (r.value as any).error;
      errors.push(`User ${userIds[i]}: ${msg}`);
    }
  });

  return { success: errors.length === 0, deleted, errors };
}
