import DashboardClient from "@/components/clients/dashboard-client"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getAssetsData } from "@/lib/assets"

async function Dashboard() {
  const [session, assets] = await Promise.all([
    auth.api.getSession({
      headers: await headers()
    }),
    getAssetsData()
  ])

  if (!session) {
    throw redirect("/login")
  }

  const coinData = assets.coinData.map(coin => {
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

  return <DashboardClient coinData={coinData} user={session.user} />
}

export default Dashboard