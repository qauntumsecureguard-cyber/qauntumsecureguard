export const dynamic = "force-dynamic";

import { getAllCardsAdmin } from "@/actions/card.action";
import CardStatusButton from "@/components/admin/CardStatusButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreditCard, CheckCircle2, Clock, XCircle, ShieldCheck } from "lucide-react";

async function AdminCardsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  const { cards, error } = await getAllCardsAdmin();

  const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    }
  };

  const pendingCount = cards.filter((c) => c.status === "pending").length;
  const approvedCount = cards.filter((c) => c.status === "approved").length;
  const rejectedCount = cards.filter((c) => c.status === "rejected").length;

  return (
    <div className="w-full min-w-0 max-w-6xl mx-auto space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Card Requests</h1>
            <p className="text-sm text-gray-500">
              {cards.length} total application{cards.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Quick summary counters */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingCount} Pending</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{approvedCount} Approved</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
            <XCircle className="w-3.5 h-3.5" />
            <span>{rejectedCount} Rejected</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      {cards.length === 0 && !error ? (
        <div className="text-center py-16 text-gray-400 text-sm rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
          No card applications have been submitted yet.
        </div>
      ) : (
        <div className="w-full min-w-0 overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs">
          <table className="min-w-[850px] w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Card Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Applicant & Info</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">User Balance</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Generated Card</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Submitted</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {cards.map((card) => {
                const isGold = card.cardType === "gold";
                const requiredMin = isGold ? 50000 : 30000;
                const meetsRequirement = card.userEstimatedBalance >= requiredMin;

                return (
                  <tr key={card.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    {/* Card Type */}
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                            isGold
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : "bg-slate-400/20 text-slate-300 border border-slate-400/40"
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          {card.cardType}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        Req: ${requiredMin.toLocaleString()}
                      </div>
                    </td>

                    {/* Applicant details */}
                    <td className="px-4 py-4 align-top">
                      <div className="text-gray-900 dark:text-white font-medium">
                        {card.fullName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {card.email}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2">
                        <span>📞 {card.phone}</span>
                        <span>📍 {card.state}, {card.country}</span>
                      </div>
                      <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                        SSN: {card.ssn} | DOB: {card.dob}
                      </div>
                    </td>

                    {/* User Balance Check */}
                    <td className="px-4 py-4 align-top">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">
                        ${card.userEstimatedBalance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div className="mt-1">
                        {meetsRequirement ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-green-400 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" /> Meets Min (${(requiredMin / 1000)}k)
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-400 font-medium">
                            ⚠️ Below ${(requiredMin / 1000)}k min
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Generated Virtual Card Details */}
                    <td className="px-4 py-4 align-top">
                      {card.cardNumber ? (
                        <div className="p-2.5 rounded-lg bg-gray-900/60 border border-gray-700/50 font-mono text-xs text-gray-200 space-y-1">
                          <div className="text-amber-400 font-bold tracking-wider">
                            {card.cardNumber}
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-400">
                            <span>EXP: {card.expiryDate || "—"}</span>
                            <span>CVV: {card.cvv || "—"}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 italic">
                          Generated on approval
                        </span>
                      )}
                    </td>

                    {/* Submitted Date */}
                    <td className="px-4 py-4 align-top text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {card.submittedOn}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 align-top">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(
                          card.status as "pending" | "approved" | "rejected"
                        )}`}
                      >
                        {card.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-4 align-top">
                      <CardStatusButton
                        cardId={card.id}
                        currentStatus={card.status as "pending" | "approved" | "rejected"}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminCardsPage;
