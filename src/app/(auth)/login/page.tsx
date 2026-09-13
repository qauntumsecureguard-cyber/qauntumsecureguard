"use client"

import type React from "react"
import { useState } from "react"
import { Shield, ArrowRight, User, Lock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please enter both username and password")
      return
    }

    setIsLoading(true)
    authClient.signIn.email({
      email,
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
  }

  return (
    <>
      {/* Header with icon */}
      <div className="text-center mb-8 animate-slideDown space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <Shield className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
        <p className="text-gray-600 dark:text-gray-400">Please enter your details</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email */}
        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "100ms" }}>
          <label htmlFor="login" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="on"
              autoFocus
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600 focus:border-transparent dark:text-gray-200 text-sm transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-yellow-500 dark:group-hover:border-yellow-600"
            />
            {email && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center transition-opacity duration-300">
                <CheckCircle2 className="h-5 w-5 text-yellow-500" />
              </div>
            )}
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "200ms" }}>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
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
              autoComplete="current-password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600 focus:border-transparent dark:text-gray-200 text-sm transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-yellow-500 dark:group-hover:border-yellow-600"
            />
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