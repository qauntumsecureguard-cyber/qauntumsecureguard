export const dynamic = "force-dynamic";

import { getAllDepositsAdmin } from "@/actions/deposit.action";
import DepositStatusButton from "@/components/admin/DepositStatusButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowDownToLine } from "lucide-react";

async function AdminDepositsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/login");

  const { deposits, error } = await getAllDepositsAdmin();
  const badgeClass: Record<string, string> = {
    draft: "border-gray-400/30 bg-gray-400/10 text-gray-500",
    pending: "border-amber-500/30 bg-amber-500/10 text-amber-600",
    approved: "border-green-500/30 bg-green-500/10 text-green-600",
    rejected: "border-red-500/30 bg-red-500/10 text-red-600",
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 pb-24 md:pb-8">
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600"><ArrowDownToLine className="h-5 w-5" /></div>
        <div>
          <h1 className="text-xl font-bold">Deposits</h1>
          <p className="text-sm text-gray-500">{deposits.length} requests</p>
        </div>
      </header>

      {error && <div role="alert" className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">{error}</div>}
      {deposits.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-500">No deposit requests have been created.</p>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
          <table className="min-w-225 w-full text-sm">
            <thead className="bg-gray-100 dark:bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left">Request</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Asset</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Value</th>
                <th className="px-4 py-3 text-left">Updated</th>
                <th className="px-4 py-3 text-left">Proof</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {deposits.map((deposit) => (
                <tr key={deposit.id}>
                  <td className="px-4 py-4 font-mono text-xs" title={deposit.id}>{deposit.id.slice(-8)}</td>
                  <td className="px-4 py-4">{deposit.email || deposit.userId.slice(-8)}</td>
                  <td className="px-4 py-4 font-medium">{deposit.coin}{deposit.network !== "NATIVE" ? ` · ${deposit.network}` : ""}</td>
                  <td className="px-4 py-4">{deposit.amount.toLocaleString()} {deposit.coin}</td>
                  <td className="px-4 py-4">${deposit.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{deposit.submittedOn}</td>
                  <td className="px-4 py-4">
                    {deposit.proofUrl ? <a href={deposit.proofUrl} target="_blank" rel="noreferrer" className="font-medium text-blue-600 underline">View proof</a> : <span className="text-gray-400">Not provided</span>}
                  </td>
                  <td className="px-4 py-4"><span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${badgeClass[deposit.status]}`}>{deposit.status}</span></td>
                  <td className="px-4 py-4"><DepositStatusButton depositId={deposit.id} currentStatus={deposit.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDepositsPage;