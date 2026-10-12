"use client";

import { ChevronLeft, TrendingUp, CreditCard, ArrowUp, ArrowDown, RefreshCw, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { formatDate } from '@/lib/utils';
import CryptoImage from '../crypto-image';
import Link from "next/link";
import { cn, formatUsdUnitPrice } from '@/lib/utils';
import { PRECIOUS_METALS } from '@/constants';

interface CryptoDetailsNetworkClientProps {
  coin: string
  transactions: string
  coinDetails: {
    coinBalance: number
    coinPrice: number
    coinName: string
    src: string;
    alt: string;
    networkSrc: string | null;
    network: string | null;
  }
}

function CryptoDetailsNetworkClient({ coin, transactions, coinDetails }: CryptoDetailsNetworkClientProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'transactions' | 'coinmarketcap'>('transactions')

  const coinName = coinDetails.coinName
  const coinSymbol = coin.toUpperCase()
  const balance = coinDetails.coinBalance || 0;
  const usdValue = balance * coinDetails.coinPrice;

  const getHref = (rootPath: string) => {
    const instanceOfPreciousMetals = PRECIOUS_METALS.find((coin) => coin.name.toLowerCase() === coinName.toLowerCase())
    return instanceOfPreciousMetals ? "/swap" : `${rootPath}/${coin.toLowerCase() === "usdt" ? `${coin.toLowerCase()}/solana` : `${coin.toLowerCase()}/native`}`
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pb-24 md:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => router.back()}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">{coinSymbol}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {coinSymbol} | {coinName}
          </p>
        </div>
        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <TrendingUp size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4">
        {/* Coin Icon */}
        <div className="flex justify-center my-8">
          <CryptoImage
            src={coinDetails.src}
            alt={coinDetails.alt}
            networkSrc={coinDetails.networkSrc}
            network={coinDetails.network}
          />
        </div>

        {/* Balance */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">{balance} {coinSymbol}</h2>
          <p className="text-gray-500 dark:text-gray-400">
            ${usdValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="my-8 grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={getHref("/withdraw")}
              className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-[#2e3847] flex items-center justify-center"
            >
              <ArrowUp className="text-xl w-5 h-5" />
            </Link>
            <span className="mt-2 text-sm">Withdraw</span>
          </div>
          <div className="flex flex-col items-center">
            <Link
              href={getHref("/deposit")}
              className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-[#2e3847] flex items-center justify-center"
            >
              <ArrowDown className="text-xl w-5 h-5" />
            </Link>
            <span className="mt-2 text-sm">Deposit</span>
          </div>
          <div className="flex flex-col items-center">
            <Link
              href={getHref("/buy/details")}
              className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-[#2e3847] flex items-center justify-center"
            >
              <CreditCard className="text-xl w-5 h-5" />
            </Link>
            <span className="mt-2 text-sm">Buy</span>
          </div>
          <div className="flex flex-col items-center">
            <Link
              href="/swap"
              className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-[#2e3847] flex items-center justify-center"
            >
              <RefreshCw className="text-xl w-5 h-5" />
            </Link>
            <span className="mt-2 text-sm">Swap</span>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('transactions')}
              className={cn(
                "text-sm font-bold py-2 px-4 rounded-md transition-colors flex-1",
                activeTab === 'transactions'
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
              )}
            >
              Transactions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('coinmarketcap')}
              className={cn(
                "text-sm font-bold py-2 px-4 rounded-md transition-colors flex-1 flex items-center justify-center gap-2",
                activeTab === 'coinmarketcap'
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
              )}
            >
              <span>CoinMarketCap</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'transactions' ? (
          <div className="space-y-4">
            {(() => {
              const allTxs = (JSON.parse(transactions) as NotificationType[]);

              if (allTxs.length === 0) {
                return (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No transactions found
                  </div>
                );
              }

              return allTxs.map((tx) => {
                const currentCoinUpper = coin.toUpperCase();
                const fromUpper = (tx.from || "").toUpperCase();
                const toUpper = (tx.to || "").toUpperCase();

                const formatCoinName = (symbol?: string) => {
                  if (!symbol || symbol === "undefined" || symbol === "null") return "Crypto";
                  return symbol.split("_")[0].toUpperCase();
                };

                const lowerTitle = (tx.title || "").toLowerCase();
                const lowerDesc = (tx.description || "").toLowerCase();
                const isWithdrawal =
                  tx.type === "withdraw" ||
                  lowerTitle.includes("withdraw") ||
                  lowerDesc.includes("withdraw");

                let isPositive = false;
                let title = tx.title || "";
                let withdrawalStatus: "approved" | "pending" | "rejected" = "pending";

                if (isWithdrawal) {
                  isPositive = false;
                  const isApproved =
                    lowerTitle.includes("approv") ||
                    lowerTitle.includes("complet") ||
                    lowerTitle.includes("success") ||
                    lowerDesc.includes("approv");
                  const isRejected =
                    lowerTitle.includes("reject") ||
                    lowerTitle.includes("fail") ||
                    lowerDesc.includes("reject");

                  if (isApproved) {
                    withdrawalStatus = "approved";
                    title = "Withdrawal Approved";
                  } else if (isRejected) {
                    withdrawalStatus = "rejected";
                    title = "Withdrawal Rejected";
                  } else {
                    withdrawalStatus = "pending";
                    title = "Withdrawal Pending";
                  }
                } else if (tx.type === "deposit") {
                  const normalizedTitle = title.toLowerCase();
                  title = normalizedTitle.includes("approv") || normalizedTitle.includes("success")
                    ? "Deposit Successful"
                    : normalizedTitle.includes("reject") || normalizedTitle.includes("fail")
                      ? "Deposit Failed"
                      : "Deposit Pending";
                  isPositive = true;
                } else if (
                  tx.type === "recieve" ||
                  tx.type === "buy" ||
                  tx.type === "metal_buy"
                ) {
                  isPositive = true;
                  if (!title) {
                    title = tx.type === "buy" ? "Crypto Purchased" :
                      tx.type === "metal_buy" ? "Precious Metal Purchased" : "Balance Received";
                  }
                } else if (tx.type === "swap") {
                  const isIncoming = toUpper === currentCoinUpper || (toUpper.includes(currentCoinUpper) && !fromUpper.includes(currentCoinUpper));
                  isPositive = isIncoming;
                  if (!title) {
                    const otherSymbol = isIncoming ? formatCoinName(tx.from) : formatCoinName(tx.to);
                    title = isIncoming ? `Swapped from ${otherSymbol}` : `Swapped to ${otherSymbol}`;
                  }
                } else {
                  isPositive = toUpper === currentCoinUpper;
                  if (!title) title = "Transaction";
                }

                // Determine amount
                let amount = 0;
                if (tx.type === "swap") {
                  amount = isPositive ? (tx.toAmount ?? tx.fromAmount ?? 0) : (tx.fromAmount ?? tx.toAmount ?? 0);
                } else {
                  amount = tx.fromAmount ?? tx.toAmount ?? 0;
                }

                const amountText = `${isPositive ? "+" : "-"}${amount} ${currentCoinUpper}`;

                let amountColorClass = "text-red-500";
                if (isWithdrawal) {
                  if (withdrawalStatus === "approved") {
                    amountColorClass = "text-red-500";
                  } else if (withdrawalStatus === "pending") {
                    amountColorClass = "text-amber-500 dark:text-amber-400";
                  } else {
                    amountColorClass = "text-gray-400 dark:text-gray-500 line-through";
                  }
                } else if (tx.type === "deposit") {
                  amountColorClass = title === "Deposit Successful"
                    ? "text-green-500"
                    : title === "Deposit Failed"
                      ? "text-red-500"
                      : "text-gray-300/70";
                } else {
                  amountColorClass = isPositive ? "text-green-500" : "text-red-500";
                }

                return (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          isWithdrawal
                            ? withdrawalStatus === "approved"
                              ? "bg-red-500"
                              : withdrawalStatus === "pending"
                                ? "bg-amber-500"
                                : "bg-gray-500"
                            : isPositive
                              ? "bg-green-500"
                              : "bg-red-500"
                        )}
                      >
                        {isPositive ? (
                          <TrendingUp className="text-white" size={20} />
                        ) : (
                          <TrendingUp className="text-white rotate-180" size={20} />
                        )}
                      </div>

                      {/* Details */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{title}</h4>
                          {isWithdrawal && (
                            <span
                              className={cn(
                                "text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize",
                                withdrawalStatus === "approved"
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : withdrawalStatus === "pending"
                                    ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                              )}
                            >
                              {withdrawalStatus}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(tx.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p className={`font-semibold ${amountColorClass}`}>
                        {amountText}
                      </p>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        ) : (
          <div className="space-y-4">
            {/* CoinMarketCap Info Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-2xl font-bold">{coinSymbol}</h4>
                  <p className="text-blue-100">{coinDetails.coinName}</p>
                </div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <CryptoImage
                    src={coinDetails.src}
                    alt={coinDetails.alt}
                    networkSrc={null}
                    network={null}
                  />
                </div>
              </div>
              <p className="text-sm text-blue-100 mb-4">
                Get real-time price data, market cap, trading volume, and more on CoinMarketCap
              </p>
              <a
                href={`https://coinmarketcap.com/currencies/${coinDetails.coinName.toLowerCase().replace(/\s+/g, '-')}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors w-full justify-center"
              >
                <span>View on CoinMarketCap</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
                <p className="text-xl font-bold">
                  ${formatUsdUnitPrice(coinDetails.coinPrice)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Balance</p>
                <p className="text-xl font-bold">{balance} {coinSymbol}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h5 className="font-semibold mb-3">What you can find on CoinMarketCap:</h5>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Real-time price charts and historical data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Market capitalization and trading volume</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Price predictions and market analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Latest news and community updates</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default CryptoDetailsNetworkClient
