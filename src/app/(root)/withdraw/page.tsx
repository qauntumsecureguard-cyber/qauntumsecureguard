import { auth } from "@/lib/auth"
import { ArrowLeft } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import CryptoListClient from "@/components/clients/crypto-list-client"
import { getAssetsData } from "@/lib/assets";

async function Withdraw() {
  const [session, assets] = await Promise.all([
    auth.api.getSession({
      headers: await headers()
    }),
    getAssetsData()
  ])

  if (!session) {
    throw redirect("/login")
  }

  const { coinData } = assets;

  const processedCoinData = coinData.map(coin => {
    const userCoins = JSON.parse(session.user.coins) as UserCoin;
    let coinSymbol = ""
    if (coin.symbol === "USDT" && coin.network === "TRC20") {
      coinSymbol = "USDT_TRC20"
    } else {
      coinSymbol = coin.symbol
    }

    return {
      ...coin,
      balance: Number(userCoins[coinSymbol as keyof typeof userCoins]?.balance || 0)
    }
  })

  return (
    <section className="p-2 px-4 pb-24 md:pb-4 text-[15px]">
      {/* Header with Back Button */}
      <div className="mb-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1
            className="text-xl font-semibold text-center flex-1"
          >
            Withdraw
          </h1>
          <div className="w-6"></div>
        </div>
      </div>

      <CryptoListClient
        coinData={processedCoinData}
        page="withdraw"
      />
    </section>
  )
}

export default Withdraw