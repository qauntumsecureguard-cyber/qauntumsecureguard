import { getAssetsData } from "@/lib/assets";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CryptoListClient from "@/components/clients/crypto-list-client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function Deposit() {
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
            Deposit
          </h1>
          <div className="w-6"></div>
        </div>
      </div>

      <CryptoListClient
        coinData={processedCoinData}
        page="deposit"
      />
    </section>
  )
}

export default Deposit