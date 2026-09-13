"use client";

import { useState } from "react"
import { ArrowLeft, BookOpen, Copy, Share2 } from "lucide-react"
import Link from "next/link"
import CryptoImage from "../crypto-image";
import { User } from "@/lib/auth";
import { CRYPTO_ASSETS } from "@/constants";
import Image from "next/image";

interface DepositClientProps {
  coin: string
  network: string
  user: User
}

const coinAddresses = {
  BTC: "bc1q95h4ve6437mcusf700vk2w6tf9tv9ajzswtusa",
  USDT: "TUYrWVABNcTik9NHwFeKKqB9hFr5JAf3ai",
  XRP: "rBoAWvbTiPejkgPyKMKXjyUJvnFHpD9GsX",
  SOL: "AvVng3RjJ6WUNWgDxSoMVMpMwQCSBJpzmYcPB1TzMGty",
  DOGE: "DMFeF26WKB7RXFeqkv7BCvKmMgxSiWzuPt",
  XLM: "GBYO2N5YRXTY5J5XPPCVDXXDF6HD4NFMMVIS2HUPDJWT54TQ5GMWK47X",
  ADA: "addr1q838j5jw3fjky8c3sdadvuehp528cwvd66drjwfnjqwrxgrmgh34p7ydys5fe3pe8xg95dmpf0fj8mks4kr5npzeu6dsrh6fey"
}

export const TRUST_WALLET_ASSET_MAP: Record<string, string> = {
  BTC: "c0",                 // Bitcoin
  USDT: "c195_tether", // Tether on Tron (TRC20)
  ADA: "c1815",              // Cardano
  XLM: "c148",               // Stellar
  XRP: "c144",               // Ripple
  DOGE: "c3",                // Dogecoin
  SOL: "c501"                // Solana
};


function DepositClient({ coin, network, user }: DepositClientProps) {
  const [copied, setCopied] = useState(false)

  const coinDetails = CRYPTO_ASSETS.find(asset => {
    return asset.network === network || asset.symbol === coin.toLocaleUpperCase()
  })

  const coinSrc = `/images/qrcodes/${coin.toLowerCase()}.png`
  const coinAddress = coinAddresses[coin.toUpperCase() as keyof typeof coinAddresses]
  const currency = coin.toUpperCase();
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
        {/* Warning Banner */}
        <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="text-yellow-500 text-xl shrink-0">⚠</div>
            <p className="text-yellow-500 text-sm">
              Only send {currency} assets to this address.
            </p>
          </div>
        </div>

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
              className="w-[256px] h-[256px]"
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