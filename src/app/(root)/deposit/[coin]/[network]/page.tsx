import DepositClient from "@/components/clients/deposit-client";
import { PRECIOUS_METALS } from "@/constants";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type Params = {
  params: Promise<{ coin: string; network: string }>
}

async function DepositCoinNetwork({ params }: Params) {
  const { coin, network } = (await params);

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    throw redirect("/login")
  }

  if (PRECIOUS_METALS.find((cn) => cn.symbol.toLowerCase() === coin.toLowerCase())) {
    throw redirect("/swap")
  }

  return <DepositClient coin={coin} network={network} user={session.user} />
}

export default DepositCoinNetwork