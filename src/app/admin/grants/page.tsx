export const dynamic = "force-dynamic";

import { getAllGrantsAdmin } from "@/actions/grant.action";
import GrantStatusButton from "@/components/admin/GrantStatusButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Award, Building, User } from "lucide-react";

async function AdminGrantsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  const { grants, error } = await getAllGrantsAdmin();

  const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved": return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "rejected": return "bg-red-500/20 text-red-400 border border-red-500/30";
      default: return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    }
  };

  return (
    <div className="w-full min-w-0 max-w-6xl mx-auto space-y-6 pb-24 md:pb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Grant Requests</h1>
          <p className="text-sm text-gray-500">
            {grants.length} total application{grants.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      {grants.length === 0 && !error ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No grant applications have been submitted yet.
        </div>
      ) : (
        <div className="w-full min-w-0 overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs">
          <table className="min-w-[700px] w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Request ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Applicant</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Tax ID / EIN</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Project Description</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Submitted</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-white/70">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {grants.map((grant) => (
                <tr key={grant.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4">
                    <span className="font-mono text-xs text-gray-500 dark:text-white/50 truncate block max-w-[120px]" title={grant.id}>
                      {grant.id}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      {grant.applicationType === "company" ? (
                        <Building className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      )}
                      <span className="capitalize text-gray-700 dark:text-white/80">{grant.applicationType}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-800 dark:text-white/90 font-medium">
                    <div>{grant.applicantName}</div>
                    {grant.userAccountEmail && (
                      <div className="text-xs text-gray-400 font-normal">{grant.userAccountEmail}</div>
                    )}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-gray-500 dark:text-white/50">
                    {grant.applicationType === "company"
                      ? (grant.ein || "—")
                      : (grant.ssn || "—")}
                  </td>
                  <td className="px-4 py-4 max-w-xs">
                    <p className="text-gray-600 dark:text-white/60 text-xs line-clamp-2">
                      {grant.projectDescription}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-gray-500 dark:text-white/50 text-xs whitespace-nowrap">
                    {grant.submittedOn}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize ${getStatusBadge(grant.status)}`}>
                      {grant.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <GrantStatusButton
                      grantId={grant.id}
                      currentStatus={grant.status}
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

export default AdminGrantsPage;
