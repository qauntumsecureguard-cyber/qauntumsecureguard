"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, MailCheck, Plus, RotateCw, ShieldCheck, User, UserPlus, BadgeCheck } from "lucide-react"
import Link from "next/link"
import { isUserIdAvailable } from "@/actions/auth.action"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { PhoneInput } from "@/components/ui/phone-input"

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userId: "",
    email: "",
    mobileNumber: "",
    password: "",
    password_confirmation: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("First name is required")
      return false
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required")
      return false
    }
    if (!formData.userId.trim()) {
      setError("User ID is required")
      return false
    }
    if (!/^[A-Za-z0-9]+$/.test(formData.userId.trim())) {
      setError("User ID must be alphanumeric")
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
    if (!formData.mobileNumber.trim()) {
      setError("Mobile number is required")
      return false
    }
    if (!/^[0-9+\-\s()]+$/.test(formData.mobileNumber.trim())) {
      setError("Please enter a valid mobile number")
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
    const emailToRegister = formData.email

    try {
      const userIdCheck = await isUserIdAvailable(formData.userId)

      if (!userIdCheck.available) {
        setIsLoading(false)
        setError(userIdCheck.error || "This User ID is already taken.")
        toast.error(userIdCheck.error || "This User ID is already taken.")
        return
      }

      authClient.signUp.email({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        userId: formData.userId,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        password: formData.password,
        walletStatus: "not-connected",
        kyc: {
          status: "none",
          image: "",
          type: ""
        },
        callbackURL: `/email-verified?email=${encodeURIComponent(emailToRegister)}`
      }, {
      onError(context) {
        setIsLoading(false)
        toast.error(context.error.message || "An error occurred. Please try again.")
      },
        async onSuccess() {
          setIsLoading(false)
          setRegisteredEmail(emailToRegister)
          setShowSuccessModal(true)
        }
      })
    } catch (error) {
      console.error("Registration failed:", error)
      setIsLoading(false)
      toast.error("Unable to create your account right now. Please try again.")
    }
  }

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || isResending) return
    setIsResending(true)
    try {
      await authClient.sendVerificationEmail({
        email: registeredEmail,
        callbackURL: `/email-verified?email=${encodeURIComponent(registeredEmail)}`
      })
      toast.success("Verification email resent! Please check your inbox and spam folder.")
      setResendCooldown(60)
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch {
      toast.error("Failed to resend verification email. Please try again later.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <>
      {/* Header with icon */}
      <div className="text-center mb-8 animate-slideDown">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100">
          <UserPlus className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-black mb-2">Create Account</h1>
        <p className="text-gray-600">Join us today</p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 animate-slideUp" style={{ animationDelay: "100ms" }}>
            <label htmlFor="firstName" className="block text-sm font-medium text-black">
              First Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                required
                onChange={handleChange}
                placeholder="John"
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm transition-all duration-300 placeholder-gray-400 group-hover:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2 animate-slideUp" style={{ animationDelay: "120ms" }}>
            <label htmlFor="lastName" className="block text-sm font-medium text-black">
              Last Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                required
                onChange={handleChange}
                placeholder="Doe"
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm transition-all duration-300 placeholder-gray-400 group-hover:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "160ms" }}>
          <label htmlFor="userId" className="block text-sm font-medium text-black">
            User ID (Alpha Numeric)
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BadgeCheck className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="userId"
              type="text"
              name="userId"
              value={formData.userId}
              required
              onChange={handleChange}
              placeholder="JDN12345"
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm transition-all duration-300 placeholder-gray-400 group-hover:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "200ms" }}>
          <label htmlFor="email" className="block text-sm font-medium text-black">
            Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              required
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm transition-all duration-300 placeholder-gray-400 group-hover:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "240ms" }}>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-black">
            Mobile Number
          </label>
          <PhoneInput
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            required
            onChange={(value) => setFormData((prev) => ({ ...prev, mobileNumber: value }))}
            placeholder="234 567 8900"
          />
        </div>

        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "300ms" }}>
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
              name="password"
              value={formData.password}
              required
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm transition-all duration-300 placeholder-gray-400 group-hover:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2 animate-slideUp" style={{ animationDelay: "400ms" }}>
          <label htmlFor="password_confirmation" className="block text-sm font-medium text-black">
            Confirm Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ShieldCheck className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password_confirmation"
              type={showConfirmPassword ? "text" : "password"}
              name="password_confirmation"
              value={formData.password_confirmation}
              required
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm transition-all duration-300 placeholder-gray-400 group-hover:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
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

      {/* Account Created & Email Verification Modal / Disclaimer */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 text-center space-y-5 animate-in zoom-in-95 duration-300">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 mx-auto ring-8 ring-yellow-50 dark:ring-yellow-900/20">
              <MailCheck className="w-8 h-8" />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Account Created!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                A verification link has been sent to:
              </p>
              <div className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 max-w-full truncate">
                {registeredEmail}
              </div>
            </div>

            {/* Important Disclaimer Card */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 text-left space-y-2.5">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                    Email Verification Required
                  </p>
                  <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                    You <strong>cannot sign in</strong> until your email address has been verified.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-amber-200/60 dark:border-amber-800/40">
                <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                  Please check your <strong>Inbox</strong> and <strong>Spam / Junk folder</strong> for the verification email.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={isResending || resendCooldown > 0}
                onClick={handleResendEmail}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                <span>
                  {isResending
                    ? "Sending..."
                    : resendCooldown > 0
                    ? `Resend available in ${resendCooldown}s`
                    : "Didn't receive email? Resend"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Register