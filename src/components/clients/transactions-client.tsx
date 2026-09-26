"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, ArrowLeft, ArrowLeftRight } from "lucide-react";
import type { UserTransactionRow } from "@/actions/transactions.action";

type TransactionFilter = "all" | "deposit" | "withdrawal" | "swap";

const statusStyle: Record<string, string> = {
  draft: "border-gray-400/30 bg-gray-400/10 text-gray-600 dark:text-gray-300",
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  approved: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300",
  rejected: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
  failed: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
  submitted: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  completed: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300",
};

export default function TransactionsClient({
  transactions,
}: {
  transactions: UserTransactionRow[];
}) {
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const filteredTransactions = transactions.filter((transaction) =>
    filter === "all" || transaction.type === filter
  );

  return (
    <main className="min-h-screen bg-gray-100 p-4 pb-24 text-gray-900 dark:bg-gray-900 dark:text-white md:p-6 md:pb-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center gap-3">
          <Link href="/dashboard" aria-label="Back to dashboard" className="rounded-md p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-700 dark:text-blue-300">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Transaction board</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Deposits, withdrawals, and swaps</p>
          </div>
        </header>

        <div className="flex gap-1 border-b border-gray-200 dark:border-white/10" role="tablist" aria-label="Filter transactions">
          {([
            ["all", "All"],
            ["deposit", "Deposits"],
            ["withdrawal", "Withdrawals"],
            ["swap", "Swaps"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
              className={`min-h-11 border-b-2 px-4 text-sm font-medium transition-colors ${filter === value ? "border-blue-600 text-blue-700 dark:text-blue-300" : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {filteredTransactions.length === 0 ? (
          <section className="py-16 text-center">
            <p className="font-medium">No {filter === "all" ? "transactions" : `${filter} transactions`} yet</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your activity will appear here.</p>
          </section>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-800">
            <table className="w-full min-w-160 text-sm">
              <thead className="bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Coin</th>
                  <th className="px-4 py-3 text-left font-medium">Transaction type</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {filteredTransactions.map((transaction) => (
                  <tr key={`${transaction.type}-${transaction.id}`}>
                    <td className="px-4 py-4 font-semibold">
                        {transaction.coin}{transaction.toCoin ? ` → ${transaction.toCoin}` : ""}
                      {transaction.network && transaction.network !== "NATIVE" && <span className="ml-1 text-xs font-normal text-gray-500">{transaction.network}</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2">
                        {transaction.type === "deposit" ? <ArrowDownLeft className="h-4 w-4 text-green-600" /> : transaction.type === "withdrawal" ? <ArrowUpRight className="h-4 w-4 text-orange-600" /> : <ArrowLeftRight className="h-4 w-4 text-blue-600" />}
                        <span className="capitalize">{transaction.type}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-mono">
                      {transaction.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })} {transaction.coin}
                      {transaction.toCoin && <span className="block text-xs text-gray-500">Received {transaction.receivedAmount?.toLocaleString(undefined, { maximumFractionDigits: 8 })} {transaction.toCoin}</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle[transaction.status] || statusStyle.submitted}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{new Date(transaction.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}