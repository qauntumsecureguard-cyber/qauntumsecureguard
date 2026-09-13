"use client";

import { submitCardApplication } from "@/actions/card.action";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { toast } from "sonner";

function ApplyPageContent() {
  const searchParams = useSearchParams();
  const cardType = searchParams.get("card-type") || "silver";
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = authClient.useSession().data?.user

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const dateOfBirth = formData.get("dob") as string;
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    if (age < 18) {
      toast.error("You must be at least 18 years old to apply for a card.");
      setIsSubmitting(false);
      return;
    }
    formData.append("cardType", cardType);

    try {
      await submitCardApplication(formData);
      toast.success("Application submitted successfully!");
      if (cardType === "gold") {
        authClient.updateUser({ goldCardSubmitted: true });
      } else {
        authClient.updateUser({ silverCardSubmitted: true });
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if ((cardType === "gold" && user?.goldCardSubmitted) || (cardType === "silver" && user?.silverCardSubmitted)) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300 pb-24 md:pb-8">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-center flex-1 capitalize">{cardType} Card Application</h1>
          <div className="w-6"></div>
        </div>
        <div className="flex flex-col items-center justify-center mt-6 px-4 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
          <h2 className="text-xl font-semibold mt-2">Application Submitted Successfully!</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Thank you for your application. We will review it as soon as possible.</p>
          <Link
            href="/dashboard"
            className="mt-6 px-6 py-2.5 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 shadow-md">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300 pb-24 md:pb-8">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => router.back()}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-center flex-1 capitalize">{cardType} Card Application</h1>
        <div className="w-6"></div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input required name="fullName" type="text" className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input required name="dob" type="date" className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input required name="phone" type="tel" className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input required name="email" type="email" className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input required name="country" type="text" className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input required name="state" type="text" className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Home Address</label>
              <textarea required name="address" className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" rows={3}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ID Number</label>
              <input required name="idNumber" type="text" className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" />
            </div>

            {cardType === 'gold' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-bold mb-1">Gold Card Benefits:</p>
                <ul className="list-disc pl-5">
                  <li>Free MedBed Insurance</li>
                  <li>Free Payment Fees</li>
                </ul>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </Card>
      </div>
    </div >
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplyPageContent />
    </Suspense>
  )
}
