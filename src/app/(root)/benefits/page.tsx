"use client"

import { ArrowLeft, DollarSign, Heart, RefreshCw, Award } from "lucide-react"
import Link from "next/link"

function Benefits() {
  const openChat = () => {
    if (typeof window !== "undefined" && (window as any).smartsupp) {
      (window as any).smartsupp('chat:open')
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-all duration-300 pb-24 md:pb-4 overflow-x-hidden">
      {/* Header with Back Button */}
      <div className="mb-8 space-y-6 p-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-semibold text-center flex-1">Benefits</h1>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/tax-refund"
            className="relative flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors rounded-xl cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mr-4">
              <DollarSign className="text-cyan-500 w-5 h-5" />
            </div>
            <div>
              <div className="font-bold">Tax Refund</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Assistance and guidance for recovering eligible tax refunds related to your holdings.</div>
            </div>
          </Link>

          <div
            onClick={openChat}
            className="relative flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors rounded-xl cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center mr-4">
              <Heart className="text-rose-500 w-5 h-5" />
            </div>
            <div>
              <div className="font-bold">Medbed</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Support and information on specialized medical assistance and benefits.</div>
            </div>
          </div>

          <div
            onClick={openChat}
            className="relative flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors rounded-xl cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mr-4">
              <RefreshCw className="text-amber-500 w-5 h-5" />
            </div>
            <div>
              <div className="font-bold">Assets Recovery</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Professional services to help recover lost or inaccessible assets securely.</div>
            </div>
          </div>

          <Link
            href="/grants/apply"
            className="relative flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors rounded-xl cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-4">
              <Award className="text-blue-500 w-5 h-5" />
            </div>
            <div>
              <div className="font-bold">Grants</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Apply for individual or company grants. Track your application status and receive updates.</div>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Contact Our Customer Service For More Information And Proper Guidance.</p>
          <button onClick={openChat} className="inline-block px-6 py-3 bg-linear-to-r from-cyan-500 to-cyan-600 text-slate-950 font-black rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all">
            Contact Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Benefits
