export const dynamic = "force-dynamic";

import { getAllWithdrawalsAdmin } from "@/actions/withdrawal.action";
import AdminWithdrawalsTable from "@/components/admin/AdminWithdrawalsTable";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowUpRight, CheckCircle2, Clock, XCircle } from "lucide-react";

async function AdminWithdrawalsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/login");

  const { withdrawals, error } = await getAllWithdrawalsAdmin();

  const pendingCount = withdrawals.filter((w) => w.status === "pending").length;
  const completedCount = withdrawals.filter(
    (w) => w.status === "approved" || w.status === "completed"
  ).length;
  const rejectedCount = withdrawals.filter((w) => w.status === "rejected").length;

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-600">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Withdrawal Requests & Hashes</h1>
            <p className="text-sm text-gray-500">
              {withdrawals.length} total request{withdrawals.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Counters */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingCount} Pending</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{completedCount} Completed</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 font-medium">
            <XCircle className="w-3.5 h-3.5" />
            <span>{rejectedCount} Rejected</span>
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500"
        >
          {error}
        </div>
      )}

      {/* Withdrawals Table with live search & hash copying */}
      <AdminWithdrawalsTable withdrawals={withdrawals} />
    </div>
  );
}

export default AdminWithdrawalsPage;
