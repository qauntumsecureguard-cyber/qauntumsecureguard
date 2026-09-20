"use client";

import Link from "next/link";
import { User as UserIcon, Building, Activity } from "lucide-react";

export default function GrantsClient() {
  return (
    <div className="p-4 sm:p-6 md:p-10 pb-24 md:pb-10 flex flex-col gap-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <h1 className="font-bold text-gray-900 dark:text-white text-xl sm:text-2xl md:text-3xl">
            Grant Applications
          </h1>
        </div>

        <Link
          href="/grants/track"
          className="flex items-center justify-center gap-2 text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2.5 bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition-all font-semibold text-xs sm:text-sm w-full sm:w-fit"
        >
          <Activity className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Track Status</span>
        </Link>
      </div>

      <div className="bg-gray-200/80 dark:bg-white/5 border border-gray-300 dark:border-white/10 p-4 sm:p-6 md:p-8 rounded-2xl flex flex-col gap-6 items-center shadow-lg animate-in fade-in duration-500 w-full min-w-0">
        <div className="text-center space-y-2 max-w-2xl mx-auto px-2">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl md:text-2xl">
            Select Application Type
          </h2>
          <p className="text-gray-600 dark:text-white/60 text-xs sm:text-sm leading-relaxed">
            Please select the type of application you would like to submit. Different documentation is required for individual and company applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl pt-2">
          {/* Individual Application Card */}
          <div className="bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 p-5 sm:p-6 md:p-8 rounded-2xl flex flex-col justify-between items-center gap-5 sm:gap-6 shadow-md hover:border-blue-500/50 transition-all w-full min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center rounded-full text-blue-500 dark:text-blue-400 shrink-0">
              <UserIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-white">
                Apply as Individual
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60 leading-relaxed">
                For individual applicants seeking funding for programs, equipment, research or community outreach.
              </p>
            </div>
            <Link
              href="/grants/apply?type=individual"
              className="py-3 rounded-xl w-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors text-center text-sm shadow-md shadow-blue-500/20"
            >
              Continue
            </Link>
          </div>

          {/* Company Application Card */}
          <div className="bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 p-5 sm:p-6 md:p-8 rounded-2xl flex flex-col justify-between items-center gap-5 sm:gap-6 shadow-md hover:border-blue-500/50 transition-all w-full min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 dark:bg-white/10 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-300 shrink-0">
              <Building className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-white">
                Apply as Company
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60 leading-relaxed md:px-2">
                For registered organizations with an EIN, established history and defined mission.
              </p>
            </div>
            <Link
              href="/grants/apply?type=company"
              className="py-3 rounded-xl w-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors text-center text-sm"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
