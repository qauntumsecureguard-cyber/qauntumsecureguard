"use client"

import React, { useState } from "react"
import { Shield, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { User } from "@/lib/auth"
import Link from "next/link"
import { uploadKyc } from "@/actions/kyc.action"

function KycClient({ user }: { user: User }) {
  const [kycStatus, setKYCStatus] = useState<KYCStatus>(user.kyc.status || "none")
  const [currentStep, setCurrentStep] = useState<Step>("submit")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"success" | "error">("success")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [kycFile, setKycFile] = useState<File | null>(null)
  const [kycType, setKycType] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setKycFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (kycType && kycFile) {
      setIsSubmitting(true)
      try {
        await uploadKyc(kycType, kycFile)
        setIsSubmitting(false)
        setShowModal(true)
        setModalType("success")
        setKYCStatus("pending")
        setCurrentStep("approval")
      } catch (error) {
        setModalType("error")
        setErrorMessage("Failed to upload documents")
        setShowModal(true)
        return
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setModalType("error")
      setErrorMessage("Please select a document type and upload a file")
      setShowModal(true)
    }
  }

  const steps: { label: string; key: Step }[] = [
    { label: "Register", key: "register" },
    { label: "Email Verified", key: "email" },
    { label: "Submit Docs", key: "submit" },
    { label: "Approval", key: "approval" },
  ]

  const getStepStatus = (stepKey: Step) => {
    const stepIndex = steps.findIndex((s) => s.key === stepKey)
    const currentIndex = steps.findIndex((s) => s.key === currentStep)
    return stepIndex < currentIndex ? "completed" : stepIndex === currentIndex ? "active" : "pending"
  }

  const getStatusBanner = () => {
    switch (kycStatus) {
      case "pending":
        return (
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6 mb-8">
            <div className="flex flex-col items-center gap-4">
              <Clock className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">Pending Verification</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Your documents are being reviewed.</p>
              </div>

              <div>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6 text-center">
                  Thank you for completing your KYC verification. Our team will review your documents within 24-48 hours.
                </p>
              </div>

              <div className="mt-6 w-full">
                <Link href="/dashboard">
                  <button className="p-3 rounded-md w-full bg-cyan-600 border-0 text-white hover:bg-cyan-700">
                    Back to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )
      case "approved":
        return (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Verification Approved</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your identity has been verified.</p>
              </div>
            </div>
          </div>
        )
      case "rejected":
        return (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Verification Rejected</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Please upload the correct documents.</p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (kycStatus !== "none" && kycStatus !== "rejected") {
    return (
      <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-24 md:pb-8">
          {getStatusBanner()}

          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div
                className="rounded-lg p-8 max-w-md w-full bg-white border border-gray-200 dark:bg-slate-900 dark:border-slate-700"
              >
                {modalType === "success" ? (
                  <>
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="w-16 h-16 text-emerald-500" />
                    </div>
                    <h2
                      className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white"
                    >
                      Submitted Successfully
                    </h2>
                    <p
                      className="text-center mb-6 text-gray-600 dark:text-gray-400"
                    >
                      Your documents have been submitted for review. We'll verify your information within 24-48 hours.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center mb-4">
                      <AlertCircle className="w-16 h-16 text-red-500" />
                    </div>
                    <h2
                      className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white"
                    >
                      Error
                    </h2>
                    <p
                      className="text-center mb-6 text-gray-600 dark:text-gray-400"
                    >
                      {errorMessage}
                    </p>
                  </>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 rounded-lg font-semibold transition-all bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">KYC Verification</h1>
            <p className="text-gray-500 dark:text-gray-400">Verify your identity to unlock all features</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 w-fit">
            🎁 +5.00 USDT Bonus on Approval
          </div>
        </div>

        {/* Card Container */}
        <div
          className="rounded-2xl p-8 mb-8 bg-white border border-gray-200 dark:bg-slate-900 dark:border-slate-700"
        >
          {/* Progress Steps */}
          <div className="flex justify-between mb-8 gap-2">
            {steps.map((step, idx) => {
              const status = getStepStatus(step.key)
              const isCompleted = status === "completed"
              const isActive = status === "active"

              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${(isCompleted || isActive)
                        ? "bg-blue-500 text-white dark:bg-blue-600"
                        : "bg-gray-200 text-gray-500 dark:bg-slate-700 dark:text-gray-400"
                        }`}
                    >
                      {isCompleted ? "✓" : idx + 1}
                    </div>
                    <span
                      className={`text-xs text-center font-medium ${isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                        }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mt-5 mx-1 rounded ${status === "completed"
                        ? "bg-blue-500 dark:bg-blue-600"
                        : "bg-gray-300 dark:bg-slate-700"
                        }`}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {getStatusBanner()}
            {/* Document Type Dropdown */}
            <div>
              <label
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Document Type
              </label>
              <select
                value={kycType}
                onChange={(e) => setKycType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border transition-colors bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-gray-500"
              >
                <option value="">---------</option>
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="national_id">National ID Card</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Upload Document Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e,)}
                className="block w-full text-sm text-gray-900 file:bg-gray-100 file:border-gray-300 file:text-gray-900 file:border file:rounded-lg file:px-4 file:py-2 file:cursor-pointer hover:file:opacity-75 dark:text-white dark:file:bg-slate-800 dark:file:border-slate-600 dark:file:text-white"
              />
              <p
                className="text-xs mt-2 text-gray-600 dark:text-gray-400"
              >
                Clear photo of your ID, Passport, or Driver's License
              </p>
            </div>

            {/* Info Banner */}
            <div
              className="flex items-start gap-3 p-4 rounded-lg bg-blue-100 border border-blue-300 dark:bg-blue-500/20 dark:border-blue-500/50"
            >
              <Shield className="w-5 h-5 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
              <p
                className="text-sm text-blue-800 dark:text-blue-200"
              >
                Your data is encrypted and used only for verification purposes.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg font-semibold transition-all bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {isSubmitting ? "Submitting..." : "Submit for Verification"}
            </button>
          </form>
        </div>
      </div>

      {/* Modal - Success/Error */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            className="rounded-lg p-8 max-w-md w-full bg-white border border-gray-200 dark:bg-slate-900 dark:border-slate-700"
          >
            {modalType === "success" ? (
              <>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-emerald-500" />
                </div>
                <h2
                  className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white"
                >
                  Submitted Successfully
                </h2>
                <p
                  className="text-center mb-6 text-gray-600 dark:text-gray-400"
                >
                  Your documents have been submitted for review. We'll verify your information within 24-48 hours.
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <AlertCircle className="w-16 h-16 text-red-500" />
                </div>
                <h2
                  className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white"
                >
                  Error
                </h2>
                <p
                  className="text-center mb-6 text-gray-600 dark:text-gray-400"
                >
                  {errorMessage}
                </p>
              </>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 rounded-lg font-semibold transition-all bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default KycClient;