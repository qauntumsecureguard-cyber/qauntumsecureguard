"use client"

import { useState } from "react"
import { ArrowDown, ArrowLeft, ChevronDown, Database } from "lucide-react"
import Link from "next/link"
import SwapSelectorModal from "../modals/swap-selector-modal"
import { User } from "@/lib/auth"
import CryptoImage from "../crypto-image"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { createNotification } from "@/actions/notification.action"
import { NotificationCategory } from "@/constants"

const fromAndTodefault = {
  symbol: "",
  name: "",
  balance: 0,
  icon_image: "",
  network_image: null,
  network: null,
  on: false,
  price: 0,
}

function SwapClient({ coinData, user }: { coinData: CryptoData[], user: User }) {
  const router = useRouter();

  const [cryptoData, setCryptoData] = useState<{ from: FromAndTo, to: FromAndTo }>({
    from: fromAndTodefault,
    to: fromAndTodefault
  })
  const [showCryptoSelector, setShowCryptoSelector] = useState(false)
  const [currentSelector, setCurrentSelector] = useState<"from" | "to">("from")
  const [showResultModal, setShowResultModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resultType, setResultType] = useState<"success" | "error">("success")
  const [errorMessage, setErrorMessage] = useState("")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")

  const coinMap = new Map<string, CryptoData>();

  coinData.forEach(coin => {
    const key = `${coin.symbol}:${coin.network ?? "native"}`;
    coinMap.set(key, coin);
  });

  const selectCrypto = (asset: { symbol: string; network: string | null }) => {
    const key = `${asset.symbol}:${asset.network ?? "native"}`;
    const coin = coinMap.get(key);

    if (!coin) {
      toast.error("Please select a valid coin.");
      return;
    }

    const balance = Number(coin.balance) || 0;
    const price = Number(coin.price) || 0;

    setCryptoData((prev) => ({
      ...prev,
      [currentSelector]: {
        symbol: coin.symbol,
        name: coin.name,
        balance,
        icon_image: coin.icon_image,
        network_image: coin.network_image,
        network: coin.network,
        price
      },
    }));

    setShowCryptoSelector(false);
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value
    setFromAmount(amount)

    if (cryptoData.from.price && cryptoData.to.price) {
      const usdValue = Number(amount) * cryptoData.from.price || 0
      const calculated = usdValue / cryptoData.to.price
      setToAmount(calculated.toFixed(4))
    }
  }

  const setAmount = (percentage: number) => {
    if (!cryptoData.from.name) return
    const amount = (cryptoData.from.balance * percentage) / 100
    setFromAmount(amount.toString())

    if (cryptoData.from.price && cryptoData.to.price) {
      const usdValue = amount * cryptoData.from.price
      const calculated = usdValue / cryptoData.to.price
      setToAmount(calculated.toFixed(4))
    }
  }

  const toUserCoinKey = (
    symbol: string,
    network: string | null
  ): keyof UserCoin => {
    if (!network) {
      return symbol as keyof UserCoin
    }

    return `${symbol}_${network}` as keyof UserCoin
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cryptoData.from.name || !cryptoData.to.name) {
      setErrorMessage("Please select currencies")
      setResultType("error")
      setShowResultModal(true)
      return
    }

    const amount = Number.parseFloat(fromAmount)
    if (!amount || amount <= 0) {
      setErrorMessage("Please enter a valid amount")
      setResultType("error")
      setShowResultModal(true)
      return
    }

    if (amount > cryptoData.from.balance) {
      setErrorMessage("Insufficient balance")
      setResultType("error")
      setShowResultModal(true)
      return
    }

    const fromKey = toUserCoinKey(
      cryptoData.from.symbol,
      cryptoData.from.network
    )

    const toKey = toUserCoinKey(
      cryptoData.to.symbol,
      cryptoData.to.network
    )

    const currentCoins = JSON.parse(user.coins) as UserCoin

    setIsLoading(true)

    const receivedAmount = Number.parseFloat(toAmount)

    const fromCoin = currentCoins[fromKey] || { balance: 0 };
    const toCoin = currentCoins[toKey] || { balance: 0 };

    const updatedCoins: UserCoin = {
      ...currentCoins,
      [fromKey]: {
        ...fromCoin,
        balance: fromCoin.balance - amount
      },
      [toKey]: {
        ...toCoin,
        balance: toCoin.balance + receivedAmount
      },
    }

    authClient.updateUser(
      {
        coins: JSON.stringify(updatedCoins),
      },
      {
        onError(context) {
          toast.error(context.error.message || "Swap failed")
          setIsLoading(false)
          setResultType("error")
          setShowResultModal(true)
        },
        onSuccess: async () => {
          try {
            const description = `Swapped ${fromAmount} ${cryptoData.from.symbol} to ${toAmount} ${cryptoData.to.symbol}`;
            await createNotification({
              userId: user.id,
              type: NotificationCategory.SWAP,
              from: cryptoData.from.symbol,
              to: cryptoData.to.symbol,
              fromAmount: Number(fromAmount),
              toAmount: Number(toAmount),
            })
          } finally {
            setIsLoading(false)
            setResultType("success")
            setShowResultModal(true)
          }
        },
      }
    )
  }

  const handleSwapDirection = () => {
    setCryptoData({
      ...cryptoData,
      from: cryptoData.to,
      to: cryptoData.from,
    })
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  }

  const getDisplayName = (symbol: string, network: string | null) => {
    const key = `${symbol}:${network ?? "native"}`;
    return coinMap.get(key)?.name ?? symbol;
  };

  const fromUsdValue = Number.parseFloat(fromAmount) * cryptoData.from.price || 0
  const rate = Number.parseFloat(fromAmount) > 0 ? Number.parseFloat(toAmount) / Number.parseFloat(fromAmount) : 0

  return (
    <section className="p-2 px-1 md:px-4 pb-24 md:pb-4 text-[15px]">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold text-center flex-1">Swap</h1>
        <div className="w-6"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mx-auto">
        {/* From Section */}
        <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 dark:text-gray-300">From</span>
            {cryptoData.from.name && (
              <div className="text-sm text-gray-400">Available: {cryptoData.from.balance.toFixed(2)}</div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => {
                setCurrentSelector("from")
                setShowCryptoSelector(true)
              }}
              disabled={isLoading}
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gray-700 dark:bg-gray-600 text-white font-bold">
                {cryptoData.from.name
                  ? (
                    <CryptoImage
                      src={cryptoData.from.icon_image}
                      alt={cryptoData.from.name}
                      networkSrc={cryptoData.from.network_image}
                      network={cryptoData.from.network}
                    />
                  ) : (
                    <div className="relative mr-1">
                      <Database size={15} className="text-white" />
                      <Database size={15} className="absolute bottom-1 -right-1 text-white" />
                    </div>
                  )}
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">
                  {cryptoData.from.name
                    ? getDisplayName(cryptoData.from.name, cryptoData.from.network)
                    : "Select"
                  }
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-300" />
              </div>
            </button>

            <input
              type="number"
              disabled={isLoading}
              value={fromAmount}
              onChange={handleFromAmountChange}
              placeholder="0.00"
              min="0"
              step="any"
              className="bg-transparent text-right text-sm w-max focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1 md:gap-2">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setAmount(pct)}
                  disabled={isLoading}
                  className="px-3 py-1 rounded-md bg-gray-800 dark:bg-gray-700 text-white text-xs md:text-[13px] hover:opacity-80 transition-opacity"
                >
                  {pct}%
                </button>
              ))}
            </div>
            <span className="text-gray-400 dark:text-gray-300">≈ ${fromUsdValue.toFixed(2)}</span>
          </div>
        </div>

        {/* Swap Direction */}
        <div className="flex justify-center z-10">
          <button
            type="button"
            onClick={handleSwapDirection}
            className="w-10 h-10 rounded-full bg-gray-700 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
          >
            <ArrowDown color="#928879" />
          </button>
        </div>

        {/* To Section */}
        <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 dark:text-gray-300">To</span>
            {cryptoData.to.name && (
              <div className="text-sm text-gray-400">
                Available: {cryptoData.to.balance.toFixed(2)}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setCurrentSelector("to")
                setShowCryptoSelector(true)
              }}
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gray-700 dark:bg-gray-600 text-white font-bold">
                {cryptoData.to.name
                  ? (
                    <CryptoImage
                      src={cryptoData.to.icon_image}
                      alt={cryptoData.to.name}
                      networkSrc={cryptoData.to.network_image}
                      network={cryptoData.to.network}
                    />
                  ) : (
                    <div className="relative mr-1">
                      <Database size={15} className="text-white" />
                      <Database size={15} className="absolute bottom-1 -right-1 text-white" />
                    </div>
                  )}
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">
                  {cryptoData.to.name ? getDisplayName(cryptoData.to.name, cryptoData.to.network) : "Select"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-300" />
              </div>
            </button>

            <input
              type="number"
              value={toAmount}
              readOnly
              disabled={isLoading}
              placeholder="0.00"
              className="bg-transparent text-right text-sm w-max focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex justify-between">
            {rate > 0 && (
              <span className="text-sm text-gray-400">
                1 {getDisplayName(cryptoData.from.name, cryptoData.to.network)} = {rate.toFixed(4)} {getDisplayName(cryptoData.to.name, cryptoData.to.network)}
              </span>
            )}
            <span className="text-gray-400 dark:text-gray-300">≈ ${fromUsdValue.toFixed(2)}</span>
          </div>
        </div>

        {/* Swap Button */}
        <button
          type="submit"
          disabled={!cryptoData.from.name || !cryptoData.to.name || isLoading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500 disabled:opacity-50 text-black font-semibold py-4 rounded-lg transition-colors disabled:cursor-not-allowed mt-8"
        >
          {isLoading
            ? "Swapping..."
            : cryptoData.from.name && cryptoData.to.name ? "Swap" : "Select currencies"
          }
        </button>
      </form>

      {/* Crypto Selector Modal */}
      <SwapSelectorModal
        isOpen={showCryptoSelector}
        onClose={() => setShowCryptoSelector(false)}
        user={user}
        selectCrypto={selectCrypto}
        from={cryptoData.from}
        to={cryptoData.to}
        currentSelector={currentSelector}
      />

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="text-center">
              {resultType === "success" ? (
                <>
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Swap Successful!</h3>
                  <p className="text-gray-400 dark:text-gray-300 mb-6">
                    Your transaction has been completed successfully.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Swap Failed</h3>
                  <p className="text-gray-400 dark:text-gray-300 mb-6">{errorMessage}</p>
                </>
              )}

              {resultType === "success" && (
                <div className="space-y-4 mb-6 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 dark:text-gray-300">From</span>
                    <span>
                      {fromAmount} {getDisplayName(cryptoData.from.name, cryptoData.from.network)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 dark:text-gray-300">To</span>
                    <span>
                      {toAmount} {getDisplayName(cryptoData.to.name, cryptoData.to.network)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 dark:text-gray-300">Rate</span>
                    <span>{rate.toFixed(8)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setShowResultModal(false)
                  if (resultType === "success") {
                    setFromAmount("")
                    setToAmount("")
                    router.push("/dashboard")
                  }
                }}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default SwapClient