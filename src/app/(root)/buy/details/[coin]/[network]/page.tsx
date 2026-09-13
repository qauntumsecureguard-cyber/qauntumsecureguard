import BuyDetailsClient from "@/components/clients/buy-details-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAssetsData } from "@/lib/assets";
import { PRECIOUS_METALS } from "@/constants";

type Params = {
  params: Promise<{ coin: string; network: string }>
}

async function BuyCoinNetwork({ params }: Params) {
  const { coin, network } = (await params);

  const [session, assets] = await Promise.all([
    auth.api.getSession({
      headers: await headers()
    }),
    getAssetsData()
  ])

  if (!session) {
    throw redirect("/login")
  }

  if (PRECIOUS_METALS.find((cn) => cn.symbol.toLowerCase() === coin.toLowerCase())) {
    throw redirect("/swap")
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
    } as CryptoData
  })

  return <BuyDetailsClient coin={coin} network={network} coinData={processedCoinData} user={session.user} />
}

export default BuyCoinNetwork