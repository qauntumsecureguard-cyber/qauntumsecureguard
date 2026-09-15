import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

type EmailVerifiedProps = {
  searchParams: Promise<{ email?: string }>
}

async function EmailVerified({ searchParams }: EmailVerifiedProps) {
  const { email } = await searchParams

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 text-center space-y-5 animate-in zoom-in-95 duration-300">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto ring-8 ring-green-50">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Email Verified Successfully</h1>
          <p className="text-sm text-gray-600">
            Your email address has been verified. Please sign in to access your account.
          </p>
          {email && (
            <p className="text-sm font-medium text-gray-900 break-all">{email}</p>
          )}
        </div>

        <Link
          href={email ? `/login?email=${encodeURIComponent(email)}` : "/login"}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          <span>Continue to Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

export default EmailVerified
