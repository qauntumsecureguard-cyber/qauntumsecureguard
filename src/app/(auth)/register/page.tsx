"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, Plus, ShieldCheck, User, UserPlus } from "lucide-react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!formData.password) {
      setError("Password is required")
      return false
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return toast.error(error)
    }

    setIsLoading(true)
    authClient.signUp.email({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      walletStatus: "not-connected",
      kyc: {
        status: "none",
        image: "",
        type: ""
      },
      callbackURL: "/dashboard"
    }, {
      onError(context) {
        setIsLoading(false)
        toast.error(context.error.message || "An error occured. Please try again.")
      },
      async onSuccess() {
        setIsLoading(false)
        toast.success("Account created successfully.")
        router.push("/login")
      }
    })
  }

  return (
    <>
      {/* Header with icon */}
      <div className="text-center mb-8 animate-slideDown">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <UserPlus className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
        <p className="text-gray-600 dark:text-gray-400">Join us today</p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Field */}
        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "100ms" }}>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              required
              onChange={handleChange}
              placeholder="John Doe"
              autoFocus
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600 focus:border-transparent dark:text-gray-200 text-sm transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-yellow-500 dark:group-hover:border-yellow-600"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "200ms" }}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              required
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600 focus:border-transparent dark:text-gray-200 text-sm transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-yellow-500 dark:group-hover:border-yellow-600"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "300ms" }}>
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
              name="password"
              value={formData.password}
              required
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600 focus:border-transparent dark:text-gray-200 text-sm transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-yellow-500 dark:group-hover:border-yellow-600"
            />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "400ms" }}>
          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ShieldCheck className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              required
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600 focus:border-transparent dark:text-gray-200 text-sm transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-yellow-500 dark:group-hover:border-yellow-600"
            />
          </div>
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 mt-6 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-offset-gray-800 animate-slideUp group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ animationDelay: "550ms" }}
        >
          <span className="flex items-center justify-center">
            <Plus className="h-5 w-5 mr-2 transform transition-transform duration-300 group-hover:translate-x-1" />
            {isLoading ? "Creating Account..." : "Create Account"}
          </span>
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-8 text-center animate-slideUp" style={{ animationDelay: "650ms" }}>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <Link
            href="/login"
            className="ml-1 font-medium text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  )
}

export default Register