"use client"

import type React from "react"
import { useState } from "react"
import { Key, ArrowLeft, Mail, Send, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    setIsLoading(true)
    await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    }, {
      onError(context) {
        setIsLoading(false)
        toast.error(context.error.message || "An error occurred. Please try again.")
      },
      onSuccess() {
        setIsLoading(false)
        setIsSubmitted(true)
        toast.success("Reset link sent successfully.")
      }
    })
  }

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6 animate-fadeIn">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="w-8 h-8 text-green-500 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h1>
        <p className="text-gray-600 dark:text-gray-400">
          We've sent a password reset link to <span className="font-medium text-gray-900 dark:text-white">{email}</span>.
        </p>
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header with icon */}
      <div className="text-center mb-8 animate-slideDown space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <Key className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
          Forgot your password? No problem. Just let us know your email and we will send you a password reset link.
        </p>
      </div>

      {/* Forgot Password Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "100ms" }}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              autoFocus
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600 focus:border-transparent dark:text-gray-200 text-sm transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-yellow-500 dark:group-hover:border-yellow-600"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-offset-gray-800 animate-slideUp group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ animationDelay: "200ms" }}
        >
          <span className="flex items-center justify-center">
            {isLoading ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-5 w-5 mr-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                Send Reset Link
              </>
            )}
          </span>
        </button>

        {/* Back to Login Link */}
        <div className="text-center animate-slideUp" style={{ animationDelay: "300ms" }}>
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>
      </form>
    </>
  )
}

export default ForgotPassword
