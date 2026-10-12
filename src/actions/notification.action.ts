"use server";

import { Types } from "mongoose";
import connectToDb from "@/config/connectToDb";
import NotificationModel from "@/models/notification.model";
import WithdrawalModel from "@/models/withdrawal.model";
import { NotificationCategory } from "@/constants";

/* CREATE */
export const createNotification = async ({
  userId,
  type,
  title,
  description,
  from,
  to,
  fromAmount,
  toAmount
}: {
  userId: string;
  type: NotificationCategory;
  title?: string;
  description?: string;
  from?: string;
  to?: string;
  fromAmount?: number;
  toAmount?: number;
}) => {
  await NotificationModel.create({
    userId: new Types.ObjectId(userId),
    type,
    title,
    description,
    from,
    to,
    fromAmount,
    toAmount,
    read: false
  });
};

/* GET USER NOTIFICATIONS */
export const getUserNotifications = async (userId: string) => {
  const userObjId = new Types.ObjectId(userId);

  let notifications = await NotificationModel
    .find({ userId: userObjId })
    .sort({ createdAt: -1 })
    .lean();

  const hasWelcomeBonus = notifications.some(
    (n) => n.title === "Welcome Bonus Received"
  );

  if (!hasWelcomeBonus) {
    try {
      await createNotification({
        userId,
        type: NotificationCategory.RECEIVE,
        title: "Welcome Bonus Received",
        description: "You have received a $2 USDT welcome bonus for signing up!",
        to: "USDT",
        toAmount: 2
      });

      notifications = await NotificationModel
        .find({ userId: userObjId })
        .sort({ createdAt: -1 })
        .lean();
    } catch (error) {
      console.error("Failed lazy-creation of welcome bonus notification:", error);
    }
  }

  return notifications;
};

/* MARK ONE AS READ */
export const markNotificationAsRead = async (notificationId: string) => {
  await NotificationModel.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true }
  );
};

/* MARK ALL AS READ */
export const markAllNotificationsAsRead = async (userId: string) => {
  await NotificationModel.updateMany(
    { userId: new Types.ObjectId(userId), read: false },
    { read: true }
  );
};

/* DELETE ONE */
export const deleteNotification = async (notificationId: string) => {
  await NotificationModel.findByIdAndDelete(notificationId);
};

export const getCoinRelatedTransactions = async (
  userId: string,
  coin: string
) => {
  await connectToDb();
  const coinRegex = new RegExp(`^${coin}(_.*)?$`, "i");

  const [rawNotifs, rawWithdrawals] = await Promise.all([
    NotificationModel.find({
      userId: new Types.ObjectId(userId),
      $or: [
        { from: coinRegex },
        { to: coinRegex }
      ]
    })
      .sort({ createdAt: -1 })
      .lean(),
    WithdrawalModel.find({
      userId: new Types.ObjectId(userId),
      coin: { $regex: new RegExp(`^${coin}$`, "i") },
      status: { $in: ["pending", "approved", "completed", "rejected"] },
    })
      .sort({ createdAt: -1 })
      .lean()
  ]);

  // Convert withdrawals into transaction rows with exact status
  const withdrawalTransactions = rawWithdrawals.map((w: any) => {
    let cleanStatus = "pending";
    let cleanTitle = "Withdrawal Pending";
    if (w.status === "approved" || w.status === "completed") {
      cleanStatus = "approved";
      cleanTitle = "Withdrawal Approved";
    } else if (w.status === "rejected") {
      cleanStatus = "rejected";
      cleanTitle = "Withdrawal Rejected";
    }

    return {
      _id: w._id.toString(),
      userId: w.userId.toString(),
      type: "withdraw",
      title: cleanTitle,
      description: `Withdrawal of ${w.amount} ${w.coin} (${cleanStatus})`,
      from: w.coin,
      fromAmount: w.amount,
      createdAt: w.createdAt,
      read: true,
      status: cleanStatus,
    };
  });

  // Filter raw notifications:
  // Remove duplicate withdrawal notifications if we have real WithdrawalModel records
  const nonWithdrawalNotifs = rawNotifs.filter((n: any) => {
    const lowerTitle = (n.title || "").toLowerCase();
    const lowerDesc = (n.description || "").toLowerCase();
    const isWithdraw = n.type === "withdraw" || lowerTitle.includes("withdraw") || lowerDesc.includes("withdraw");

    if (isWithdraw && withdrawalTransactions.length > 0) {
      return false;
    }
    return true;
  });

  const allTransactions = [...withdrawalTransactions, ...nonWithdrawalNotifs].sort(
    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return allTransactions;
};