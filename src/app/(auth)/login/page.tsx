"use client"

import type React from "react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Shield, ArrowRight, User, Lock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { resolveLoginEmail } from "@/actions/auth.action"
import { authClient } from "@/lib/auth-client"

function Login() {
  const searchParams = useSearchParams()
  const [identifier, setIdentifier] = useState(searchParams.get("email") ?? "")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identifier || !password) {
      toast.error("Please enter both your User ID/Email and password")
      return
    }

    setIsLoading(true)

    try {
      const resolvedUser = await resolveLoginEmail(identifier)

      if (!resolvedUser.success || !resolvedUser.email) {
        setIsLoading(false)
        toast.error(resolvedUser.error || "Unable to find your account.")
        return
      }

      authClient.signIn.email({
        email: resolvedUser.email,
        password,
        rememberMe,
        callbackURL: "/dashboard"
      }, {
        onError(context) {
          setIsLoading(false)
          toast.error(context.error.message || "An error occured. Please try again.")
        },
        onSuccess() {
          setIsLoading(false)
          toast.success("Logged in successfully.")
        }
      })
    } catch (error) {
      console.error("Login failed:", error)
      setIsLoading(false)
      toast.error("Unable to sign in right now. Please try again.")
    }
  }

  return (
    <>
      {/* Header with icon */}
      <div className="text-center mb-8 animate-slideDown space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-black">Welcome back</h1>
        <p className="text-gray-600">Please enter your details</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "100ms" }}>
          <label htmlFor="login" className="block text-sm font-medium text-black">
            User ID / Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your user ID or email"
              autoComplete="on"
              autoFocus
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm transition-all duration-300 placeholder-gray-400 group-hover:border-blue-500"
            />
            {identifier && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center transition-opacity duration-300">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "200ms" }}>
          <label htmlFor="password" className="block text-sm font-medium text-black">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm transition-all duration-300 placeholder-gray-400 group-hover:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                  <path d="M3 3l18 18" strokeLinecap="round" />
                  <path d="M10.58 10.58A2 2 0 0013.42 13.42" strokeLinecap="round" />
                  <path d="M9.88 5.08A10.94 10.94 0 0112 5c5.2 0 9.5 4.1 11 7-1.2 2.1-3.15 3.95-5.45 5.06M6.61 6.61A15.18 15.18 0 001 12c1.2 2.1 3.15 3.95 5.45 5.06" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                  <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>


        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between animate-slideUp" style={{ animationDelay: "300ms" }}>
          <label className="flex items-center group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded text-yellow-500 focus:ring-yellow-500 dark:focus:ring-yellow-600 transition-all duration-300 group-hover:border-yellow-500"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors duration-300">
              Remember me
            </span>
          </label>

          <Link
            href="/forgot-password"
            className="text-sm text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 mt-6 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-offset-gray-800 animate-slideUp group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ animationDelay: "400ms" }}
        >
          <span className="flex items-center justify-center">
            <ArrowRight className="h-5 w-5 mr-2 transform transition-transform duration-300 group-hover:translate-x-1" />
            {isLoading ? "Signing in..." : "Sign in"}
          </span>
        </button>
      </form>

      {/* Register Link */}
      <div className="mt-8 text-center animate-slideUp" style={{ animationDelay: "500ms" }}>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <Link
            href="/register"
            className="ml-1 font-medium text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </>
  )
}

export default Login