"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, RotateCw, ArrowRight, X, AlertCircle, CheckCircle2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

interface EmailOtpModalProps {
  isOpen: boolean
  email: string
  onClose?: () => void
  onSuccess?: () => void
  redirectUrl?: string
}

export function EmailOtpModal({
  isOpen,
  email,
  onClose,
  onSuccess,
  redirectUrl = "/login"
}: EmailOtpModalProps) {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(60)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!isOpen) {
      setOtp(["", "", "", "", "", ""])
      setError("")
      setIsVerified(false)
      return
    }

    setResendCooldown(60)
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    // Focus first input
    const timeout = setTimeout(() => {
      inputRefs.current[0]?.focus()
    }, 100)

    return () => {
      clearInterval(timer)
      clearTimeout(timeout)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    const cleanValue = value.replace(/\D/g, "")

    if (!cleanValue) {
      const newOtp = [...otp]
      newOtp[index] = ""
      setOtp(newOtp)
      setError("")
      return
    }

    // Handle paste of multiple digits into one box
    if (cleanValue.length > 1) {
      const digits = cleanValue.slice(0, 6).split("")
      const newOtp = [...otp]
      digits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit
      })
      setOtp(newOtp)
      setError("")
      const nextIndex = Math.min(digits.length, 5)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    const newOtp = [...otp]
    newOtp[index] = cleanValue
    setOtp(newOtp)
    setError("")

    // Move to next input
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!pastedData) return

    const newOtp = [...otp]
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char
    })
    setOtp(newOtp)
    setError("")
    const focusIndex = Math.min(pastedData.length, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const fullOtp = otp.join("")

    if (fullOtp.length < 6) {
      setError("Please enter the complete 6-digit code.")
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      const res = await authClient.emailOtp.verifyEmail({
        email,
        otp: fullOtp
      })

      if (res.error) {
        setIsVerifying(false)
        setError(res.error.message || "Invalid or expired verification code. Please try again.")
        toast.error(res.error.message || "Invalid verification code.")
        return
      }

      setIsVerifying(false)
      setIsVerified(true)
      toast.success("Email verified successfully!")

      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push(redirectUrl ? `${redirectUrl}?email=${encodeURIComponent(email)}` : "/login")
        }
      }, 1500)
    } catch (err: any) {
      console.error("OTP verification error:", err)
      setIsVerifying(false)
      setError(err?.message || "Verification failed. Please try again.")
      toast.error("Failed to verify code. Please try again.")
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return
    setIsResending(true)
    setError("")

    try {
      const res = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification"
      })

      if (res.error) {
        toast.error(res.error.message || "Failed to resend code.")
        setIsResending(false)
        return
      }

      toast.success("Verification code sent! Please check your inbox.")
      setResendCooldown(60)
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } catch {
      toast.error("Unable to resend verification code right now.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 text-center space-y-6 animate-in zoom-in-95 duration-300">
        {onClose && !isVerified && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {isVerified ? (
          <div className="space-y-4 py-4 animate-in fade-in zoom-in duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 mx-auto ring-8 ring-green-50 dark:ring-green-900/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Email Verified!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your account is now verified. Redirecting you to sign in...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 mx-auto ring-8 ring-yellow-50 dark:ring-yellow-900/20">
              <ShieldCheck className="w-8 h-8" />
            </div>

            {/* Header Text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Enter Verification Code
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We've sent a 6-digit verification code to:
              </p>
              <div className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 max-w-full truncate">
                {email}
              </div>
            </div>

            {/* OTP Input Form */}
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all duration-200"
                  />
                ))}
              </div>

              {error && (
                <div className="flex items-center justify-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 p-2.5 rounded-xl animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isVerifying || otp.join("").length < 6}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Resend Section */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                disabled={isResending || resendCooldown > 0}
                onClick={handleResend}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                <span>
                  {isResending
                    ? "Sending code..."
                    : resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Didn't receive the code? Resend"}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
