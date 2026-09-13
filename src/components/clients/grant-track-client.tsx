"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, NotepadText, Landmark, Plus } from "lucide-react";
import Link from "next/link";

export interface GrantItem {
  id: string;
  applicationType: "individual" | "company";
  companyName?: string;
  ein?: string;
  fullName?: string;
  ssn?: string;
  projectDescription: string;
  status: "pending" | "approved" | "rejected";
  submittedOn: string;
}

export default function GrantTrackClient({
  initialGrants = [],
}: {
  initialGrants?: GrantItem[];
}) {
  const router = useRouter();

  const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30";
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 pb-24 md:pb-10 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white space-y-6 transition-colors w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-3xl mx-auto w-full min-w-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="p-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white border border-gray-200 dark:border-white/10 transition-colors shadow-xs shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-900 dark:text-white">
            Grant Requests ({initialGrants.length})
          </h1>
        </div>

        <Link
          href="/grants/apply"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-xs sm:text-sm shadow-md shadow-blue-500/20 w-full sm:w-fit"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>New Request</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto w-full min-w-0">
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 sm:p-6 md:p-8 rounded-2xl flex flex-col items-center gap-5 shadow-xs w-full min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-full text-blue-600 dark:text-blue-400 shadow-sm shrink-0">
            <NotepadText className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center">Grant Requests</p>

          {initialGrants.length === 0 ? (
            <div className="text-center py-6 sm:py-8 space-y-4 w-full">
              <p className="text-gray-500 dark:text-white/60 text-xs sm:text-sm">You haven't submitted any grant applications yet.</p>
              <Link
                href="/grants/apply"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm inline-block shadow-md shadow-blue-500/20"
              >
                Apply for a Grant
              </Link>
            </div>
          ) : (
            <div className="w-full space-y-4 min-w-0">
              {initialGrants.map((req) => (
                <div
                  key={req.id}
                  className="p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-white/5 text-gray-900 dark:text-white flex flex-col justify-between gap-4 transition-all hover:border-blue-500/40 shadow-xs w-full min-w-0"
                >
                  <div className="flex flex-col gap-1 w-full min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 flex justify-center items-center bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-300 rounded-xl shrink-0">
                          <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <p className="font-semibold text-xs sm:text-sm truncate max-w-[140px] xs:max-w-[200px] sm:max-w-md" title={req.id}>
                          Request ID: {req.id}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-bold border capitalize shrink-0 ${getStatusBadge(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3 text-xs text-gray-600 dark:text-white/70 pt-3 border-t border-gray-200 dark:border-white/10 mt-2 min-w-0">
                      <div className="min-w-0">
                        <span className="text-gray-400 dark:text-white/40 block text-[11px]">Type</span>
                        <span className="font-medium capitalize text-gray-800 dark:text-white truncate block">
                          {req.applicationType}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-gray-400 dark:text-white/40 block text-[11px]">
                          {req.applicationType === "company" ? "Company" : "Applicant"}
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white truncate block">
                          {req.applicationType === "company"
                            ? req.companyName || "N/A"
                            : req.fullName || "N/A"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-gray-400 dark:text-white/40 block text-[11px]">Date</span>
                        <span className="font-medium text-gray-800 dark:text-white truncate block">{req.submittedOn}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
