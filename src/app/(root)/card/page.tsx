export const dynamic = "force-dynamic";

import { getUserCards } from "@/actions/card.action";
import { Card } from "@/components/ui/card";
import VirtualCard from "@/components/cards/VirtualCard";
import { ArrowLeft, Clock, ShieldCheck, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function CardPage() {
  const { cards } = await getUserCards();

  const approvedCards = cards.filter((c) => c.status === "approved");
  const pendingCards = cards.filter((c) => c.status === "pending");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-center flex-1">Cards Hub</h1>
        <div className="w-10" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section 1: Active Approved Virtual Cards */}
        {approvedCards.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold">Your Active Cards</h2>
              </div>
              <span className="text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {approvedCards.length} Active Card{approvedCards.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvedCards.map((card) => (
                <div key={card.id} className="space-y-3">
                  <VirtualCard
                    cardType={card.cardType as "gold" | "silver"}
                    cardNumber={card.cardNumber}
                    cardHolder={card.cardHolder || card.fullName}
                    expiryDate={card.expiryDate}
                    cvv={card.cvv}
                    status="approved"
                  />

                  {/* Card quick stats & benefits */}
                  <Card className="p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span>Status</span>
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Issued
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Card Tier</span>
                      <span className="font-bold text-gray-900 dark:text-white uppercase">
                        {card.cardType} Card
                      </span>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Pending Applications */}
        {pendingCards.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-yellow-500">
              <Clock className="w-5 h-5" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pending Card Application</h2>
            </div>

            {pendingCards.map((pCard) => (
              <Card
                key={pCard.id}
                className="p-5 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-yellow-800 dark:text-yellow-400 uppercase tracking-wide">
                        {pCard.cardType} Card Application
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                        Under Review
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Applicant: <strong>{pCard.fullName}</strong> • Submitted on {pCard.submittedOn}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Our compliance team is verifying your balance and details. Once approved, your 16-digit card number and virtual details will be generated here automatically.
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-yellow-600 dark:text-yellow-400 font-medium bg-yellow-100 dark:bg-yellow-900/40 px-3 py-1.5 rounded-lg border border-yellow-300 dark:border-yellow-700">
                      <Clock className="w-3.5 h-3.5 animate-spin" /> Processing
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </section>
        )}

        {/* Section 3: Available Card Tiers (Choose Card / Apply) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">
              {approvedCards.length > 0 ? "Apply for Another Card" : "Choose Your Card"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Silver Card Box */}
            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 flex flex-col justify-between hover:shadow-lg transition-all">
              <div className="space-y-4">
                <div className="relative flex justify-center py-4">
                  <Image
                    src="/images/card-silver.png"
                    alt="QFS Silver Card"
                    width={220}
                    height={140}
                    className="rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Qauntum Secure Guard Silver Card</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    $30,000 Minimum Required Balance • 5% Return every 10 days
                  </p>
                </div>
                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Instant virtual card generation on approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Fast withdrawal processing guaranteed</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href="/card/silver"
                  className="flex-1 text-center py-2.5 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl text-xs font-semibold transition-colors"
                >
                  View Details
                </Link>
                <Link
                  href="/card/apply?card-type=silver"
                  className="flex-1 text-center py-2.5 px-4 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Apply Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>

            {/* Gold Card Box */}
            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 flex flex-col justify-between hover:shadow-lg transition-all border-amber-500/20">
              <div className="space-y-4">
                <div className="relative flex justify-center py-4">
                  <Image
                    src="/images/card-gold.png"
                    alt="QFS Gold Card"
                    width={220}
                    height={140}
                    className="rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">Qauntum Secure Guard Gold Card</h3>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                      VIP
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    $50,000 Minimum Required Balance • 10% Return every 10 days
                  </p>
                </div>
                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Free MedBed Insurance & Zero Payment Fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Priority withdrawal & 24/7 dedicated support</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href="/card/gold"
                  className="flex-1 text-center py-2.5 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl text-xs font-semibold transition-colors"
                >
                  View Details
                </Link>
                <Link
                  href="/card/apply?card-type=gold"
                  className="flex-1 text-center py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-md"
                >
                  <span>Apply Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CardPage;