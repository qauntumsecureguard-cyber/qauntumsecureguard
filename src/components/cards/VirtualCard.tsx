"use client";

import { useState } from "react";
import { Copy, Check, Eye, EyeOff, ShieldCheck, Wifi, Sparkles } from "lucide-react";
import { toast } from "sonner";

export interface VirtualCardProps {
  cardType: "gold" | "silver";
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  status?: "approved" | "pending" | "rejected";
}

export default function VirtualCard({
  cardType,
  cardNumber,
  cardHolder,
  expiryDate,
  cvv,
  status = "approved",
}: VirtualCardProps) {
  const [showFullNumber, setShowFullNumber] = useState(true);
  const [showCvv, setShowCvv] = useState(false);
  const [copied, setCopied] = useState(false);

  const isGold = cardType.toLowerCase() === "gold";

  const handleCopy = () => {
    const rawNumber = cardNumber.replace(/\s+/g, "");
    navigator.clipboard.writeText(rawNumber);
    setCopied(true);
    toast.success("Card number copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Mask middle digits if user chooses to hide
  const formattedDisplayNumber = () => {
    if (!cardNumber) return "•••• •••• •••• ••••";
    if (showFullNumber) return cardNumber;
    const parts = cardNumber.split(" ");
    if (parts.length === 4) {
      return `${parts[0]} •••• •••• ${parts[3]}`;
    }
    return cardNumber;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 3D-styled Card Container */}
      <div
        className={`relative w-full aspect-[1.586/1] rounded-2xl p-5 sm:p-6 text-white shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20 border select-none ${
          isGold
            ? "bg-gradient-to-tr from-[#78350f] via-[#b45309] to-[#fbbf24] border-amber-300/40 shadow-amber-900/40"
            : "bg-gradient-to-tr from-[#1e293b] via-[#475569] to-[#94a3b8] border-slate-300/40 shadow-slate-900/40"
        }`}
      >
        {/* Subtle decorative background textures and glow */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.8),transparent_50%)]" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        {/* Top bar: Bank Name & Contactless Icon */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-sm sm:text-base drop-shadow-md">
              Qauntum Secure Guard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 rotate-90 text-white/90" />
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${
                isGold ? "bg-amber-950/60 text-amber-200 border border-amber-300/30" : "bg-slate-950/60 text-slate-200 border border-slate-300/30"
              }`}
            >
              {cardType}
            </span>
          </div>
        </div>

        {/* Chip & Status */}
        <div className="relative z-10 flex items-center justify-between mt-4 sm:mt-5">
          {/* Realistic EMV Chip */}
          <div className="w-11 h-8 sm:w-12 sm:h-9 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/60 shadow-inner flex flex-col justify-around p-1">
            <div className="w-full h-[1px] bg-amber-800/40" />
            <div className="w-full h-[1px] bg-amber-800/40" />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ACTIVE</span>
          </div>
        </div>

        {/* Card Number */}
        <div className="relative z-10 mt-5 sm:mt-6">
          <div className="font-mono text-base sm:text-xl font-bold tracking-[0.18em] sm:tracking-[0.22em] drop-shadow-md text-white">
            {formattedDisplayNumber()}
          </div>
        </div>

        {/* Bottom Details: Cardholder & Expiry & CVV */}
        <div className="relative z-10 mt-4 sm:mt-5 flex items-end justify-between text-xs">
          <div>
            <div className="text-[9px] uppercase tracking-wider text-white/70 font-semibold">
              Card Holder
            </div>
            <div className="font-bold tracking-wider text-white text-xs sm:text-sm uppercase drop-shadow-xs truncate max-w-[170px] sm:max-w-[210px]">
              {cardHolder || "CARDHOLDER"}
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-right">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-white/70 font-semibold">
                Expires
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm tracking-widest text-white">
                {expiryDate || "12/28"}
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase tracking-wider text-white/70 font-semibold">
                CVV
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm tracking-widest text-white">
                {showCvv ? cvv || "882" : "•••"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Quick Action Bar */}
      <div className="mt-4 flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-xs">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gray-100 dark:bg-gray-700/60 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy Card Number"}</span>
        </button>

        <button
          onClick={() => setShowFullNumber(!showFullNumber)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/60 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
          title={showFullNumber ? "Mask card number" : "Show full number"}
        >
          {showFullNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setShowCvv(!showCvv)}
          className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-gray-100 dark:bg-gray-700/60 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition-colors cursor-pointer"
        >
          {showCvv ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showCvv ? "Hide CVV" : "Show CVV"}</span>
        </button>
      </div>
    </div>
  );
}
