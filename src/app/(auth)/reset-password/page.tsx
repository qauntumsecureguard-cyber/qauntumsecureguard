"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Lock, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error("Invalid or missing reset token")
      return
    }

    if (!password) {
      toast.error("Please enter a new password")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)
    await authClient.resetPassword({
      newPassword: password,
      token: token,
    }, {
      onError(context) {
        setIsLoading(false)
        console.error("Reset password error:", context.error)
        toast.error(context.error.message || "An error occurred. Please try again.")
      },
      onSuccess() {
        setIsLoading(false)
        setIsSuccess(true)
        toast.success("Password reset successfully.")
      }
    })
  }

  if (!token) {
    return (
      <div className="text-center space-y-6 animate-fadeIn">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invalid Link</h1>
        <p className="text-gray-600 dark:text-gray-400">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <div className="pt-4">
          <Link
            href="/forgot-password"
            className="inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 hover:underline"
          >
            Request new link
          </Link>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-6 animate-fadeIn">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="w-8 h-8 text-green-500 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Success!</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your password has been successfully reset. You can now log in with your new password.
        </p>
        <div className="pt-4">
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
          >
            Go to Login
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="text-center mb-8 animate-slideDown space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <Lock className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter your new password below to complete the reset process.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password Field */}
        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "100ms" }}>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            New Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600 focus:border-transparent dark:text-gray-200 text-sm transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-yellow-500 dark:group-hover:border-yellow-600"
            />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "200ms" }}>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ShieldCheck className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600 focus:border-transparent dark:text-gray-200 text-sm transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-yellow-500 dark:group-hover:border-yellow-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 mt-4 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-offset-gray-800 animate-slideUp group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ animationDelay: "300ms" }}
        >
          <span className="flex items-center justify-center">
            {isLoading ? "Updating Password..." : "Reset Password"}
            <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </button>
      </form>
    </>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
