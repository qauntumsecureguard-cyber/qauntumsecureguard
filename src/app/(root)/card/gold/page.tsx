export const dynamic = "force-dynamic";

import { getUserCards } from "@/actions/card.action";
import { Card } from "@/components/ui/card";
import VirtualCard from "@/components/cards/VirtualCard";
import { ArrowLeft, CheckCircle2, Clock, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function Gold() {
  const { cards } = await getUserCards();
  const goldCard = cards.find((c) => c.cardType === "gold" && c.status === "approved");
  const pendingGold = cards.find((c) => c.cardType === "gold" && c.status === "pending");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between p-4 max-w-3xl mx-auto">
        <Link
          href="/card"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-center flex-1">Gold Card</h1>
        <div className="w-10" />
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {/* Card Display: If Approved, show the interactive Virtual Card */}
        {goldCard ? (
          <div className="space-y-4">
            <div className="text-center">
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> YOUR ACTIVE CARD
              </span>
            </div>
            <VirtualCard
              cardType="gold"
              cardNumber={goldCard.cardNumber}
              cardHolder={goldCard.cardHolder || goldCard.fullName}
              expiryDate={goldCard.expiryDate}
              cvv={goldCard.cvv}
              status="approved"
            />
          </div>
        ) : pendingGold ? (
          <div className="space-y-4">
            <div className="flex justify-center py-4">
              <Image
                src="/images/card-gold.png"
                alt="QFS Gold Card"
                width={260}
                height={170}
                className="w-64 h-auto rounded-xl shadow-2xl"
              />
            </div>
            <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-700/60 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400 font-bold text-sm">
                <Clock className="w-4 h-4 animate-spin" /> Application Under Review
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Your Gold Card application is currently being verified by our compliance team. Once approved, your 16-digit card number and details will be active here.
              </p>
            </Card>
          </div>
        ) : (
          <div className="flex justify-center py-6">
            <Image
              src="/images/card-gold.png"
              alt="QFS NESARA Gold Card"
              width={280}
              height={180}
              className="w-72 h-auto rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Card Details & Perks */}
        <Card className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Qauntum Secure Guard GOLD CARD
            </h2>
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
              VIP Tier
            </span>
          </div>

          {/* Note Section */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-amber-800 dark:text-amber-400 text-xs uppercase tracking-wider">
              Terms & Qualification
            </h3>
            <div className="space-y-2 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex gap-2">
                <span className="font-bold">•</span>
                <span>$50,000 Minimum Required on QFS account balance.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Fast & regular withdrawal process is guaranteed.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">•</span>
                <span>The GOLD CARD earns you 10% of your QFS Total Balance every 10 days.</span>
              </div>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-800/30 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-amber-800 dark:text-amber-400 text-xs uppercase tracking-wider">
              VIP Privileges
            </h3>
            <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Free MedBed Insurance Coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Zero Transaction & Payment Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>24/7 Priority VIP Concierge & Customer Support</span>
              </div>
            </div>
          </div>

          {/* Features Checklist */}
          <div className="space-y-2.5 pt-2 text-sm">
            <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
              <span>Instant virtual card generation upon admin approval</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
              <span>Worldwide merchant acceptance & online purchases</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
              <span>Encrypted virtual number, CVV, and 4-year validity</span>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        {!goldCard && !pendingGold && (
          <Link
            href="/card/apply?card-type=gold"
            className="block w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold text-center transition-all shadow-md hover:shadow-amber-500/20 cursor-pointer"
          >
            Apply for Gold Card
          </Link>
        )}
      </div>
    </div>
  );
}

export default Gold;