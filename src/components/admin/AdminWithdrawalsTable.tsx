"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Search, ExternalLink, ArrowUpRight } from "lucide-react";
import WithdrawalStatusButton from "./WithdrawalStatusButton";
import { toast } from "sonner";

interface AdminWithdrawalItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  coin: string;
  network: string;
  amount: number;
  recipientAddress: string;
  txHash: string;
  usdValue: number;
  fee: number;
  status: "pending" | "approved" | "completed" | "rejected";
  adminNotes?: string;
  createdAt: string;
  submittedOn: string;
}

export default function AdminWithdrawalsTable({
  withdrawals,
}: {
  withdrawals: AdminWithdrawalItem[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filtered = withdrawals.filter((w) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      w.txHash.toLowerCase().includes(q) ||
      w.userName.toLowerCase().includes(q) ||
      w.userEmail.toLowerCase().includes(q) ||
      w.recipientAddress.toLowerCase().includes(q) ||
      w.coin.toLowerCase().includes(q) ||
      w.network.toLowerCase().includes(q)
    );
  });

  const handleCopy = async (key: string, text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const badgeClass: Record<string, string> = {
    pending: "border-amber-500/30 bg-amber-500/10 text-amber-500",
    approved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
    completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
    rejected: "border-red-500/30 bg-red-500/10 text-red-500",
  };

  return (
    <div className="space-y-4">
      {/* Search and filter bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Transaction Hash, Email, or User..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-14 text-sm text-gray-400 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
          {searchQuery ? "No withdrawal requests match your search criteria." : "No withdrawal requests recorded yet."}
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 shadow-xs">
          <table className="min-w-[980px] w-full text-sm">
            <thead className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="px-4 py-3 text-left">Transaction Hash</th>
                <th className="px-4 py-3 text-left">User & Email</th>
                <th className="px-4 py-3 text-left">Asset</th>
                <th className="px-4 py-3 text-left">Amount & USD</th>
                <th className="px-4 py-3 text-left">Recipient Address</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  {/* Transaction Hash */}
                  <td className="px-4 py-4 align-top">
                    <div className="p-2 rounded-lg bg-gray-900 border border-gray-700/60 max-w-[220px]">
                      <div className="flex items-center justify-between gap-1 text-[11px] font-mono text-amber-400">
                        <span className="truncate" title={item.txHash}>
                          {item.txHash}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(`hash-${item.id}`, item.txHash, "Transaction Hash")}
                          className="p-1 text-gray-400 hover:text-white rounded transition-colors shrink-0 cursor-pointer"
                          title="Copy Full Transaction Hash"
                        >
                          {copiedKey === `hash-${item.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* User info */}
                  <td className="px-4 py-4 align-top">
                    <Link
                      href={`/admin/users/${item.userId}`}
                      className="font-medium text-gray-900 dark:text-white hover:text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <span>{item.userName}</span>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </Link>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.userEmail}</div>
                  </td>

                  {/* Asset */}
                  <td className="px-4 py-4 align-top">
                    <div className="font-bold text-gray-900 dark:text-white">{item.coin}</div>
                    <div className="text-xs text-gray-500">{item.network !== "NATIVE" ? item.network : "Native Chain"}</div>
                  </td>

                  {/* Amount & Value */}
                  <td className="px-4 py-4 align-top">
                    <div className="font-mono font-semibold text-gray-900 dark:text-white">
                      {item.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })} {item.coin}
                    </div>
                    <div className="text-xs text-gray-500">
                      ≈ ${item.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </div>
                  </td>

                  {/* Recipient Address */}
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center gap-1.5 max-w-[200px]">
                      <span className="font-mono text-xs text-gray-700 dark:text-gray-300 truncate" title={item.recipientAddress}>
                        {item.recipientAddress}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(`addr-${item.id}`, item.recipientAddress, "Address")}
                        className="p-1 text-gray-400 hover:text-white rounded shrink-0 cursor-pointer"
                        title="Copy Recipient Address"
                      >
                        {copiedKey === `addr-${item.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Submitted Date */}
                  <td className="px-4 py-4 align-top text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {item.submittedOn}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 align-top">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${badgeClass[item.status] || badgeClass.pending}`}>
                      {item.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4 align-top">
                    <WithdrawalStatusButton withdrawalId={item.id} currentStatus={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
