"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, NotepadText, DollarSign, Plus } from "lucide-react";
import Link from "next/link";

export interface TaxRefundItem {
  id: string;
  fullName: string;
  ssn: string;
  idMe: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  submittedOn: string;
}

export default function TaxRefundTrackClient({
  initialRefunds = [],
}: {
  initialRefunds?: TaxRefundItem[];
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
            Tax Refund Requests ({initialRefunds.length})
          </h1>
        </div>

        <Link
          href="/tax-refund"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-xs sm:text-sm shadow-md shadow-blue-500/20 w-full sm:w-fit"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>New Claim</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto w-full min-w-0">
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 sm:p-6 md:p-8 rounded-2xl flex flex-col items-center gap-5 shadow-xs w-full min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-full text-blue-600 dark:text-blue-400 shadow-sm shrink-0">
            <NotepadText className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center">
            IRS Tax Refund Claim Status
          </p>

          {initialRefunds.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-white/50 space-y-4 w-full">
              <p className="text-xs sm:text-sm">You have not submitted any IRS tax refund claims yet.</p>
              <Link
                href="/tax-refund"
                className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/20"
              >
                Submit a Tax Refund Claim
              </Link>
            </div>
          ) : (
            <div className="w-full space-y-4 min-w-0">
              {initialRefunds.map((req) => (
                <div
                  key={req.id}
                  className="p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-white/5 text-gray-900 dark:text-white flex flex-col justify-between gap-4 transition-all hover:border-blue-500/40 shadow-xs w-full min-w-0"
                >
                  <div className="flex flex-col gap-2 w-full min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 flex justify-center items-center bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-xl shrink-0">
                          <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <p className="font-semibold text-xs sm:text-sm truncate max-w-[140px] xs:max-w-[200px] sm:max-w-md" title={req.id}>
                          Claim ID: {req.id}
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

                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3 text-xs text-gray-600 dark:text-white/70 pt-2 border-t border-gray-200 dark:border-white/10 min-w-0">
                      <div className="min-w-0">
                        <span className="text-gray-400 dark:text-white/40 block text-[11px]">Applicant</span>
                        <span className="font-medium text-gray-900 dark:text-white truncate block">{req.fullName}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-gray-400 dark:text-white/40 block text-[11px]">Country</span>
                        <span className="font-medium text-gray-900 dark:text-white truncate block">{req.location}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-gray-400 dark:text-white/40 block text-[11px]">Submitted On</span>
                        <span className="font-medium text-gray-900 dark:text-white truncate block">{req.submittedOn}</span>
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
