"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle, Building, User as UserIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { User } from "@/lib/auth";
import { submitGrantApplication } from "@/actions/grant.action";

export default function GrantApplyClient({ user }: { user: User }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "company" ? "company" : "individual";

  const [applicantType, setApplicantType] = useState<"individual" | "company">(initialType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState("");

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    companyName: "",
    ein: "",
    ssn: "",
    projectDescription: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (applicantType === "company" && (!formData.companyName || !formData.ein)) {
      return toast.error("Please enter company name and EIN / Tax ID");
    }

    if (applicantType === "individual" && (!formData.fullName || !formData.ssn)) {
      return toast.error("Please enter full name and SSN / Tax ID");
    }

    if (!formData.projectDescription) {
      return toast.error("Please describe your project");
    }

    setIsSubmitting(true);

    try {
      const res = await submitGrantApplication({
        applicationType: applicantType,
        companyName: formData.companyName,
        ein: formData.ein,
        fullName: formData.fullName,
        ssn: formData.ssn,
        projectDescription: formData.projectDescription,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        if (res.grantId) setSubmittedId(res.grantId);
        setIsSuccess(true);
        toast.success("Grant application submitted successfully!");
      }
    } catch {
      toast.error("An error occurred while submitting your application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-4 sm:p-6 md:p-10 pb-24 md:pb-10 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center transition-colors w-full min-w-0">
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-2xl max-w-md w-full text-center space-y-6 shadow-sm animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto shrink-0">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Application Submitted!</h2>
            <p className="text-gray-600 dark:text-white/60 text-xs sm:text-sm">
              Your grant application has been received and is now pending review.
            </p>
          </div>
          {submittedId && (
            <div className="p-3 bg-gray-100 dark:bg-white/10 rounded-xl text-xs font-mono text-gray-700 dark:text-white/80 break-all">
              Request ID: {submittedId}
            </div>
          )}
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/grants/track"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors text-center text-sm shadow-md shadow-blue-500/20"
            >
              Track Application Status
            </Link>
            <Link
              href="/dashboard"
              className="w-full py-3 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-white font-medium rounded-xl transition-colors text-center text-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleTabChange = (type: "individual" | "company") => {
    setApplicantType(type);
    router.replace(`/grants/apply?type=${type}`, { scroll: false });
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 pb-24 md:pb-10 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white space-y-6 transition-colors w-full min-w-0">
      <div className="max-w-3xl mx-auto space-y-6 w-full min-w-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="p-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white border border-gray-200 dark:border-white/10 transition-colors shadow-xs shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-900 dark:text-white">
              Grant Application
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-white/60">
              Submit your grant details for review
            </p>
          </div>
        </div>

        {/* Type Selection Buttons */}
        <div className="flex rounded-xl bg-gray-200/80 dark:bg-white/5 p-1.5 border border-gray-300 dark:border-white/10 w-full min-w-0">
          <button
            type="button"
            onClick={() => handleTabChange("individual")}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              applicantType === "individual"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <UserIcon className="w-4 h-4 shrink-0" />
            <span><span className="hidden sm:inline">Apply as </span>Individual</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("company")}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              applicantType === "company"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Building className="w-4 h-4 shrink-0" />
            <span><span className="hidden sm:inline">Apply as </span>Company</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-white/5 p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto w-full min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            {applicantType === "company" ? "Company Grant Details" : "Individual Grant Details"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applicantType === "company" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-white/70">Company Name</label>
                    <input
                      className="bg-gray-50/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none focus:border-blue-500 text-base sm:text-sm transition-colors w-full"
                      placeholder="Enter name..."
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-white/70">EIN / Tax ID</label>
                    <input
                      className="bg-gray-50/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none focus:border-blue-500 text-base sm:text-sm transition-colors w-full"
                      placeholder="12-345678"
                      type="text"
                      name="ein"
                      value={formData.ein}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-white/70">Applicant / Authorized Representative</label>
                    <input
                      className="bg-gray-50/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none focus:border-blue-500 text-base sm:text-sm transition-colors w-full"
                      placeholder="Enter representative name..."
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-white/70">Applicant Full Name</label>
                    <input
                      className="bg-gray-50/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none focus:border-blue-500 text-base sm:text-sm transition-colors w-full"
                      placeholder="Enter full name..."
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-white/70">SSN / Tax ID</label>
                    <input
                      className="bg-gray-50/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none focus:border-blue-500 text-base sm:text-sm transition-colors w-full"
                      placeholder="XXX-XX-XXXX"
                      type="text"
                      name="ssn"
                      value={formData.ssn}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-white/70">Project Description</label>
              <textarea
                rows={4}
                className="bg-gray-50/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none focus:border-blue-500 text-base sm:text-sm transition-colors w-full resize-y"
                placeholder="Tell us about your project..."
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
