"use client";

import { submitCardApplication } from "@/actions/card.action";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, CheckCircle2, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { toast } from "sonner";
import { PhoneInput } from "@/components/ui/phone-input";

function ApplyPageContent() {
  const searchParams = useSearchParams();
  const cardType = (searchParams.get("card-type") || "silver").toLowerCase();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState("");

  const user = authClient.useSession().data?.user;
  const isGold = cardType === "gold";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const dateOfBirth = formData.get("dob") as string;

    const dobDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (isNaN(age) || age < 18) {
      toast.error("You must be at least 18 years old to apply for a card.");
      setIsSubmitting(false);
      return;
    }

    formData.append("cardType", cardType);

    try {
      const res = await submitCardApplication(formData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Card application submitted successfully!");
        if (isGold) {
          authClient.updateUser({ goldCardSubmitted: true });
        } else {
          authClient.updateUser({ silverCardSubmitted: true });
        }
        setSubmitted(true);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAlreadySubmitted =
    submitted ||
    (cardType === "gold" && user?.goldCardSubmitted) ||
    (cardType === "silver" && user?.silverCardSubmitted);

  if (isAlreadySubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300 pb-24 md:pb-8">
        <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
          <Link
            href="/card"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-center flex-1 capitalize">
            {cardType} Card Application
          </h1>
          <div className="w-10" />
        </div>

        <div className="max-w-md mx-auto mt-8 px-4 text-center">
          <Card className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Application Submitted!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Thank you for applying for the <strong>Qauntum Secure Guard {cardType.toUpperCase()} Card</strong>.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/40 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              Our administration is reviewing your account balance and credentials. Once approved, your 16-digit virtual card number and details will become active in your Card Hub.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link
                href="/card"
                className="flex-1 py-2.5 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-xs font-bold rounded-xl transition-colors text-center"
              >
                Go to Card Hub
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm text-center"
              >
                Dashboard
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300 pb-24 md:pb-8">
      <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
        <Link
          href="/card"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-center flex-1 capitalize">
          Apply for {cardType} Card
        </h1>
        <div className="w-10" />
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-4 space-y-6">
        {/* Tier Summary Pill */}
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            isGold
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
              : "bg-slate-500/10 border-slate-500/30 text-slate-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 shrink-0" />
            <div>
              <div className="text-xs uppercase font-bold tracking-wider">
                Selected Tier: {cardType} Card
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {isGold ? "Min Balance: $50,000 • 10% Every 10 Days" : "Min Balance: $30,000 • 5% Every 10 Days"}
              </div>
            </div>
          </div>
          <Link
            href="/card"
            className="text-xs font-semibold underline hover:opacity-80 transition-opacity"
          >
            Change
          </Link>
        </div>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 sm:p-7 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Full Legal Name
              </label>
              <input
                required
                name="fullName"
                type="text"
                placeholder="e.g. Johnathan Doe"
                className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Date of Birth (Must be $\ge$ 18)
                </label>
                <input
                  required
                  name="dob"
                  type="date"
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <PhoneInput
                  required
                  name="phone"
                  value={phone}
                  onChange={setPhone}
                  placeholder="234 567 8900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                required
                name="email"
                type="email"
                defaultValue={user?.email || ""}
                placeholder="name@example.com"
                className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Country
                </label>
                <input
                  required
                  name="country"
                  type="text"
                  placeholder="United States"
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  State / Province
                </label>
                <input
                  required
                  name="state"
                  type="text"
                  placeholder="California"
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Residential Street Address
              </label>
              <textarea
                required
                name="address"
                placeholder="123 Financial District Way, Suite 400"
                className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300" htmlFor="ssn">
                SSN / Tax Identification Number
              </label>
              <input
                id="ssn"
                required
                name="ssn"
                type="text"
                autoComplete="off"
                placeholder="XXX-XX-XXXX"
                className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {isGold && (
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Gold Card VIP Perks Included:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-gray-600 dark:text-gray-300">
                  <li>Free MedBed Insurance coverage</li>
                  <li>Zero transaction and payment fees</li>
                  <li>10% yields calculated on account balance</li>
                </ul>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isGold
                  ? "bg-amber-500 hover:bg-amber-600 text-black hover:shadow-amber-500/20"
                  : "bg-slate-700 hover:bg-slate-800 text-white hover:shadow-slate-500/20"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <span>Submit {cardType.toUpperCase()} Card Application</span>
              )}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 text-center text-sm text-gray-500">Loading card application...</div>}>
      <ApplyPageContent />
    </Suspense>
  );
}
