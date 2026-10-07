"use client";

import type React from "react";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  CreditCard,
  ExternalLink,
  Headphones,
  Loader2,
  Lock,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { createWithdrawalRequest } from "@/actions/withdrawal.action";
import { User } from "@/lib/auth";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface TransactionPreview {
  recipient: string;
  amount: number;
  fee: number;
  total: number;
  usdValue: number;
}

interface WithdrawClientProps {
  coin: string;
  network: string;
  coinData: CryptoData[];
  user: User;
  hasApprovedCard?: boolean;
}

interface WithdrawalSuccessData {
  txHash: string;
  amount: number;
  coin: string;
  network: string;
  recipientAddress: string;
  usdValue: number;
}

function WithdrawClient({
  coin,
  network,
  coinData,
  user,
  hasApprovedCard = false,
}: WithdrawClientProps) {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [addressError, setAddressError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [loading, setLoading] = useState(false);

  // Modals state
  const [showCardRequiredModal, setShowCardRequiredModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<WithdrawalSuccessData | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const coinMap = new Map<string, CryptoData>();

  coinData.forEach((item) => {
    const key = `${item.symbol}:${item.network ?? "native"}`;
    coinMap.set(key, item);
  });

  const maxAmount =
    coinMap.get(`${coin.toLocaleUpperCase()}:${network === "solana" ? "SOLANA" : network}`)
      ?.balance || 0;
  const fee = 0.0;
  const price = coinMap.get(`${coin}:${network}`)?.price || 0;
  const currency = coin.toUpperCase();

  const calculatePreview = (): TransactionPreview => {
    const numAmount = Number.parseFloat(amount) || 0;
    const total = numAmount + fee;
    const usdValue = total * price;

    const recipient = recipientAddress || "Not entered";

    return {
      recipient,
      amount: numAmount,
      fee,
      total,
      usdValue,
    };
  };

  const preview = calculatePreview();

  const isFormValid =
    amount &&
    Number.parseFloat(amount) > 0 &&
    Number.parseFloat(amount) + fee <= maxAmount &&
    !amountError &&
    recipientAddress.trim() &&
    !addressError;

  const handleAddressChange = (value: string) => {
    setRecipientAddress(value);
    setAddressError("");

    if (value.trim() && value.length < 15) {
      setAddressError("Address is too short");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleAddressChange(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const handlePercentage = (percentage: number) => {
    const newAmount = (maxAmount * percentage) / 100;
    setAmount(newAmount.toString());
    setAmountError("");
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setAmountError("");

    const numValue = Number.parseFloat(value);
    if (numValue + fee > maxAmount) {
      setAmountError("Insufficient balance");
    }
  };

  const handleCopyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(true);
      toast.success("Transaction hash copied to clipboard!");
      setTimeout(() => setCopiedHash(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleContactSupport = () => {
    if (typeof window !== "undefined" && (window as any).smartsupp) {
      (window as any).smartsupp("chat:open");
    } else {
      window.location.href = "mailto:qauntumsecureguard@gmail.com?subject=Withdrawal%20Verification%20Hash%20" + (successData?.txHash || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    // Check if user has an activated/approved card
    if (!hasApprovedCard) {
      setShowCardRequiredModal(true);
      return;
    }

    setLoading(true);
    try {
      const res = await createWithdrawalRequest({
        coin,
        network,
        amount: Number.parseFloat(amount),
        recipientAddress,
      });

      if (res.error) {
        if (res.cardRequired) {
          setShowCardRequiredModal(true);
        } else {
          toast.error(res.error);
        }
        return;
      }

      if (res.success && res.txHash) {
        setSuccessData({
          txHash: res.txHash,
          amount: res.amount,
          coin: res.coin,
          network: res.network,
          recipientAddress: res.recipientAddress,
          usdValue: res.usdValue,
        });
        setShowSuccessModal(true);
        // Clear form
        setAmount("");
        setRecipientAddress("");
      }
    } catch (error) {
      console.error("Send error:", error);
      toast.error("Failed to process withdrawal request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300">
      <div className="w-full max-w-2xl mx-auto py-4 px-4 sm:px-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/withdraw"
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold text-center flex-1">
            Withdraw {currency} {network !== "native" && `(${network.toUpperCase()})`}
          </h1>
          <div className="w-9"></div>
        </div>

        {/* Card Activation Status Banner */}
        {!hasApprovedCard ? (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <h4 className="font-semibold text-amber-600 dark:text-amber-400">
                Card Activation Required
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                You must have an activated Qauntum Secure Guard card to withdraw digital assets.
              </p>
              <Link
                href="/card"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline mt-2"
              >
                Activate Card Now <CreditCard className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Card Verified & Active • Direct Withdrawal Enabled</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Sending Method */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 p-3.5 rounded-xl text-center shadow-xs">
            <p className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Sending via - </span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                Withdraw {coin.toUpperCase()} {network !== "native" ? `(${network.toUpperCase()})` : ""}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient Address */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                Recipient {currency} Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder={`Enter ${currency} address`}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl py-3 px-4 pr-16 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 font-mono text-sm shadow-xs"
                />
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 px-2 py-1 rounded bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
                >
                  Paste
                </button>
              </div>
              {addressError && <p className="text-red-500 text-xs mt-1">{addressError}</p>}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  step="0.00000001"
                  min="0"
                  placeholder="0.0000"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl py-3 px-4 pr-24 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 font-mono text-sm shadow-xs"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {currency}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePercentage(100)}
                    className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 px-2 py-1 rounded bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>
              {amountError && <p className="text-red-500 text-xs mt-1">{amountError}</p>}
            </div>

            {/* Percentage Buttons */}
            <div className="grid grid-cols-4 gap-3">
              {[25, 50, 75, 100].map((percentage) => (
                <button
                  key={percentage}
                  type="button"
                  onClick={() => handlePercentage(percentage)}
                  className="py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold transition-colors shadow-xs"
                >
                  {percentage}%
                </button>
              ))}
            </div>

            {/* Balance Info */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
              <span>≈ ${preview.usdValue.toFixed(2)} USD</span>
              <span className="font-mono">
                Available: {maxAmount.toFixed(8)} {currency}
              </span>
            </div>

            {/* Preview Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 p-5 rounded-2xl space-y-3.5 shadow-xs">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <span>Transaction Preview</span>
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Recipient:</span>
                  <span className="font-mono text-xs truncate max-w-[240px]">
                    {preview.recipient}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Amount:</span>
                  <span className="font-medium font-mono text-xs">
                    {preview.amount.toFixed(8)} {currency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Transfer Fee:</span>
                  <span className="font-medium font-mono text-xs text-emerald-500">
                    {preview.fee.toFixed(8)} {currency} (Free)
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3 font-semibold">
                  <span className="text-sm">Total Dispatch:</span>
                  <span className="text-sm font-mono text-yellow-600 dark:text-yellow-400">
                    {preview.total.toFixed(8)} {currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-black font-bold py-3.5 px-4 rounded-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Transaction Hash...</span>
                </>
              ) : (
                <span>Initiate Withdrawal</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 1. CARD ACTIVATION REQUIRED MODAL */}
      {showCardRequiredModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Card Activation Required
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                  To ensure account security and authorize asset dispatch, you must activate your{" "}
                  <strong>Qauntum Secure Guard Debit Card</strong> before withdrawing funds.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Card Status:</span>
                <span className="text-amber-500 font-semibold">Not Activated</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Supported Tiers:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Silver & Gold Cards</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Processing:</span>
                <span className="font-semibold text-emerald-500">Instant Verification upon issuance</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <Link href="/card" className="w-full block">
                <Button className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Activate Card Now
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setShowCardRequiredModal(false)}
                className="w-full py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUCCESS / TRANSACTION HASH GENERATED MODAL */}
      {showSuccessModal && successData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 w-full max-w-lg p-6 sm:p-7 rounded-2xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex flex-col items-center text-center space-y-2.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Withdrawal Request Generated
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your transaction hash has been registered on the blockchain queue.
              </p>
            </div>

            {/* Instruction Notice */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                <Headphones className="w-4 h-4" />
                <span>Next Step: Forward Hash to Support</span>
              </div>
              <p>
                To complete security clearance and release your{" "}
                <strong>
                  {successData.amount} {successData.coin}
                </strong>
                , please copy the <strong>Transaction Hash</strong> below and send it to our 24/7 Support.
              </p>
            </div>

            {/* Transaction Hash Copy Box */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                Generated Transaction Hash
              </label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-900 border border-gray-700 text-amber-400 font-mono text-xs break-all select-all">
                <span className="flex-1">{successData.txHash}</span>
                <button
                  type="button"
                  onClick={() => handleCopyHash(successData.txHash)}
                  className="shrink-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 cursor-pointer"
                  title="Copy Transaction Hash"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-[11px] text-emerald-400 font-sans font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-[11px] font-sans font-bold">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Transaction Details Table */}
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Asset & Network:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {successData.coin} ({successData.network})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-semibold text-gray-900 dark:text-white font-mono">
                  {successData.amount} {successData.coin} (~${successData.usdValue.toFixed(2)})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Recipient Address:</span>
                <span className="font-mono text-xs truncate max-w-[200px] text-gray-700 dark:text-gray-300">
                  {successData.recipientAddress}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-gray-200 dark:border-white/10">
                <span className="text-gray-500">Status:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30 uppercase">
                  Pending Support Confirmation
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <Button
                onClick={handleContactSupport}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
              >
                <Headphones className="w-4 h-4" />
                Contact 24/7 Support with Hash
              </Button>

              <div className="flex gap-2">
                <Link href="/transactions" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full py-2.5 text-xs font-semibold rounded-xl"
                  >
                    View in Transactions
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => setShowSuccessModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default WithdrawClient;