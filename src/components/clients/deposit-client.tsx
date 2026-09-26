"use client";

import { useState } from "react"
import { AlertCircle, ArrowLeft, BookOpen, CheckCircle2, Copy, Loader2, Share2, Upload } from "lucide-react"
import Link from "next/link"
import CryptoImage from "../crypto-image";
import { CRYPTO_ASSETS } from "@/constants";
import Image from "next/image";
import { toast } from "sonner";
import { saveDepositDraft, submitDepositProof } from "@/actions/deposit.action";

interface DepositClientProps {
  coin: string
  network: string
  price: number
  existingRequest: DepositRequest | null
}

export interface DepositRequest {
  id: string;
  coin: string;
  network: string;
  amount: number;
  usdValue: number;
  proofUrl: string;
  status: "draft" | "pending";
  updatedAt: string;
}

const coinAddresses = {
  BTC: "bc1q95h4ve6437mcusf700vk2w6tf9tv9ajzswtusa",
  ETH: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  USDT: "AvVng3RjJ6WUNWgDxSoMVMpMwQCSBJpzmYcPB1TzMGty",
  XRP: "rBoAWvbTiPejkgPyKMKXjyUJvnFHpD9GsX",
  SOL: "AvVng3RjJ6WUNWgDxSoMVMpMwQCSBJpzmYcPB1TzMGty",
  DOGE: "DMFeF26WKB7RXFeqkv7BCvKmMgxSiWzuPt",
  XLM: "GBYO2N5YRXTY5J5XPPCVDXXDF6HD4NFMMVIS2HUPDJWT54TQ5GMWK47X",
  ADA: "addr1q838j5jw3fjky8c3sdadvuehp528cwvd66drjwfnjqwrxgrmgh34p7ydys5fe3pe8xg95dmpf0fj8mks4kr5npzeu6dsrh6fey"
}

export const TRUST_WALLET_ASSET_MAP: Record<string, string> = {
  BTC: "c0",                 // Bitcoin
  ETH: "c60",                // Ethereum
  USDT: "c501_usdt", // Tether on Solana
  ADA: "c1815",              // Cardano
  XLM: "c148",               // Stellar
  XRP: "c144",               // Ripple
  DOGE: "c3",                // Dogecoin
  SOL: "c501"                // Solana
};


function DepositClient({ coin, network, price, existingRequest }: DepositClientProps) {
  const [copied, setCopied] = useState(false)
  const currency = coin.toUpperCase();
  const matchingRequest = existingRequest?.coin === currency &&
    existingRequest.network === network.toUpperCase();
  const [amount, setAmount] = useState(matchingRequest ? String(existingRequest.amount) : "")
  const [request, setRequest] = useState(
    matchingRequest && existingRequest.status === "draft" ? existingRequest : null
  )
  const [step, setStep] = useState<"amount" | "proof">(
    matchingRequest && existingRequest.status === "draft" ? "proof" : "amount"
  )
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const coinDetails = CRYPTO_ASSETS.find(asset => {
    return asset.network === network || asset.symbol === coin.toLocaleUpperCase()
  })

  const coinSrc = `/images/qrcodes/${coin.toLowerCase()}.png`
  const coinAddress = coinAddresses[coin.toUpperCase() as keyof typeof coinAddresses]
  const numericAmount = Number.parseFloat(amount) || 0;
  const usdValue = numericAmount * price;
  const minimumCoinAmount = price > 0 ? Math.ceil((1000 / price) * 100) / 100 : 0;
  const hasMinimumError = numericAmount > 0 && usdValue < 1000;
  const link = `https://link.trustwallet.com/send?asset=${TRUST_WALLET_ASSET_MAP[currency]}&address=${coinAddress}`

  const openInTrustWallet = () => {
    window.open(link, "_blank")
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coinAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const sharePayID = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Deposit ${currency}`,
          text: coinAddress,
          url: link
        })
      } catch (err) {
        console.error("Share failed:", err)
      }
    }
  }

  const continueToProof = async () => {
    if (numericAmount <= 0 || hasMinimumError) return;
    setIsSaving(true);
    try {
      const result = await saveDepositDraft({ coin: currency, network, amount: numericAmount });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.request) {
        setRequest(result.request);
        setStep("proof");
      }
    } catch {
      toast.error("Could not save your deposit request.");
    } finally {
      setIsSaving(false);
    }
  }

  const submitProof = async () => {
    if (!request || !proofFile) return;
    setIsSaving(true);
    try {
      const result = await submitDepositProof(request.id, proofFile);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setRequest({ ...request, status: "pending" });
      toast.success("Proof submitted. Your deposit is awaiting admin approval.");
    } catch {
      toast.error("Could not submit proof. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const hasPendingReview = existingRequest?.status === "pending";

  const startAnotherDeposit = () => {
    setRequest(null);
    setAmount("");
    setProofFile(null);
    setStep("amount");
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/deposit" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold">Deposit {currency}</h1>
        <div className="w-6" />
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {hasPendingReview ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4" role="status">
            <p className="font-semibold text-amber-700 dark:text-amber-300">Deposit awaiting approval</p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              Your {existingRequest.amount} {existingRequest.coin} deposit (${existingRequest.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}) is under review. You can continue with another deposit while it is being reviewed.
            </p>
            <Link className="mt-2 inline-flex font-medium text-blue-600 dark:text-blue-400 underline" href="/transactions">
              View transaction board
            </Link>
          </div>
        ) : null}

        {existingRequest?.status === "draft" && !matchingRequest && !request ? (
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 text-sm">
            <p className="font-semibold">You already have a deposit request in progress</p>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              Continue below to change that request to {currency}, or open it to upload proof for {existingRequest.coin}.
            </p>
            <Link className="mt-2 inline-flex font-medium text-blue-600 dark:text-blue-400 underline" href={`/deposit/${existingRequest.coin.toLowerCase()}/${existingRequest.network.toLowerCase()}`}>
              Open existing request and add proof
            </Link>
          </div>
        ) : null}

        {/* Warning Banner */}
        <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="text-yellow-500 text-xl shrink-0">⚠</div>
            <p className="text-yellow-500 text-sm">
              Only send {currency} assets to this address.
            </p>
          </div>
        </div>

        {request?.status !== "pending" && step === "amount" && <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <label htmlFor="deposit-amount" className="block text-sm font-medium">
            Deposit amount ({currency})
          </label>
          <input
            id="deposit-amount"
            type="number"
            min={minimumCoinAmount || undefined}
            step="any"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder={minimumCoinAmount ? minimumCoinAmount.toFixed(2) : "0.00"}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Minimum deposit: {minimumCoinAmount.toFixed(2)} {currency} ($1,000 USD)
            {numericAmount > 0 && !hasMinimumError && ` - Current value: $${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          </p>
          {hasMinimumError && (
            <p role="alert" className="flex items-start gap-2 text-sm font-medium text-red-600 dark:text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              This deposit is below the $1,000 USD minimum. Please enter at least {minimumCoinAmount.toFixed(2)} {currency}.
            </p>
          )}
        </div>
        }

        {request?.status !== "pending" && step === "proof" && request && (
          <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h2 className="font-semibold">Amount saved. Add proof of payment</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {request.amount} {request.coin} · ${request.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
            </p>
            <label htmlFor="deposit-proof" className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-gray-400 p-5 text-center hover:border-blue-500">
              <Upload className="h-6 w-6" />
              <span className="text-sm font-medium">{proofFile?.name || "Choose a screenshot or receipt"}</span>
              <span className="text-xs text-gray-500">JPG, PNG, or WebP, up to 8 MB</span>
            </label>
            <input id="deposit-proof" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => setProofFile(event.target.files?.[0] || null)} />
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={submitProof} disabled={!proofFile || isSaving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Submit proof for review
              </button>
              <button type="button" onClick={() => setStep("amount")} disabled={isSaving} className="min-h-11 rounded-md border border-gray-300 px-4 text-sm font-medium dark:border-gray-600">
                Change amount
              </button>
            </div>
          </section>
        )}

        {request?.status !== "pending" && step === "amount" && (
          <button type="button" onClick={continueToProof} disabled={isSaving || !numericAmount || hasMinimumError} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {request?.status === "draft" ? "Update request and continue" : "Next"}
          </button>
        )}

        {request?.status === "pending" && (
          <div className="space-y-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4" role="status">
            <p className="font-semibold text-green-700 dark:text-green-300">
              Proof submitted. This deposit is awaiting admin approval.
            </p>
            <button type="button" onClick={startAnotherDeposit} className="min-h-11 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white">
              Start another deposit
            </button>
          </div>
        )}

        {/* Coin Header */}
        <div className="flex items-center justify-center space-x-2 pt-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-black">
            <CryptoImage
              src={coinDetails?.icon_image ?? ""}
              alt={coinDetails?.name ?? ""}
              networkSrc={coinDetails?.network_image ?? ""}
              network={coinDetails?.network ?? ""}
            />
          </div>
          <span className="text-lg font-medium">{currency}</span>
          {network !== "native" && (
            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
              {network}
            </span>
          )}
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center space-y-6">
          {/* QR Code */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <Image
              src={coinSrc}
              alt={currency}
              width={256}
              height={256}
              className="h-64 w-64"
            />
          </div>

          {/* Display Value */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currency} Address
            </p>
            <p className="text-sm font-mono break-all px-4 select-all max-w-xs">{coinAddress}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-8 pt-4">
          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <Copy className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">{copied ? "Copied!" : "Copy"}</span>
          </button>

          {/* Open in Trust Wallet Button */}
          <button
            onClick={openInTrustWallet}
            className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Open in Trust Wallet</span>
          </button>

          {/* Share Button */}
          <button
            onClick={sharePayID}
            className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Share</span>
          </button>
        </div>

        {/* Copy Success Message */}
        {copied && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg animate-fade-in-out">
            Address copied to clipboard
          </div>
        )}
      </div>
    </main>
  )
}

export default DepositClient;