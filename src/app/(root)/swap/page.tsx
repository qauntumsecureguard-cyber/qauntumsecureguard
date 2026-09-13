import SwapClient from "@/components/clients/swap-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAssetsData } from "@/lib/assets";

async function Swap() {
  const [session, assets] = await Promise.all([
    auth.api.getSession({
      headers: await headers()
    }),
    getAssetsData()
  ])

  if (!session) {
    throw redirect("/login")
  }

  const { coinData, metalData } = assets;
  const allAssets = [...coinData, ...metalData];

  const processedCoinData = allAssets.map(coin => {
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
    } as CryptoData
  })

  return <SwapClient coinData={processedCoinData} user={session.user} />
}

export default Swap