"use server";

import connectToDb from "@/config/connectToDb";
import { auth } from "@/lib/auth";
import DepositModel from "@/models/deposit.model";
import NotificationModel from "@/models/notification.model";
import WithdrawalModel from "@/models/withdrawal.model";
import mongoose from "mongoose";
import { headers } from "next/headers";

export interface UserTransactionRow {
  id: string;
  coin: string;
  toCoin?: string;
  network: string;
  type: "deposit" | "withdrawal" | "swap";
  amount: number;
  receivedAmount?: number;
  status: string;
  txHash?: string;
  recipientAddress?: string;
  createdAt: string;
}

export async function getUserTransactionsBoard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { transactions: [], error: "Not authenticated" };

  await connectToDb();
  const userId = new mongoose.Types.ObjectId(session.user.id);
  const [deposits, withdrawals, swaps] = await Promise.all([
    DepositModel.find({ userId }).sort({ createdAt: -1 }).lean(),
    WithdrawalModel.find({ userId }).sort({ createdAt: -1 }).lean(),
    NotificationModel.find({ userId, type: "swap" }).sort({ createdAt: -1 }).lean(),
  ]);

  const depositRows: UserTransactionRow[] = deposits.map((deposit) => ({
    id: (deposit._id as mongoose.Types.ObjectId).toString(),
    coin: deposit.coin,
    network: deposit.network,
    type: "deposit",
    amount: deposit.amount,
    status: deposit.status,
    createdAt: new Date(deposit.createdAt).toISOString(),
  }));

  // Dedicated Withdrawal records with txHash & real status ("pending", "approved", "completed", "rejected")
  const withdrawalRows: UserTransactionRow[] = withdrawals.map((w) => ({
    id: (w._id as mongoose.Types.ObjectId).toString(),
    coin: w.coin,
    network: w.network,
    type: "withdrawal",
    amount: w.amount,
    status: w.status,
    txHash: w.txHash,
    recipientAddress: w.recipientAddress,
    createdAt: new Date(w.createdAt).toISOString(),
  }));

  const swapRows: UserTransactionRow[] = swaps.map((swap) => ({
    id: (swap._id as mongoose.Types.ObjectId).toString(),
    coin: swap.from || "Unknown",
    toCoin: swap.to || "Unknown",
    network: "",
    type: "swap",
    amount: Number(swap.fromAmount) || 0,
    receivedAmount: Number(swap.toAmount) || 0,
    status: "completed",
    createdAt: new Date(swap.createdAt).toISOString(),
  }));

  const transactions = [...depositRows, ...withdrawalRows, ...swapRows]
    .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt));

  return { transactions, error: null };
}