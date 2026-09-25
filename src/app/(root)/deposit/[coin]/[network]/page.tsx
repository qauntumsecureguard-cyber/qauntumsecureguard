import DepositClient from "@/components/clients/deposit-client";
import { PRECIOUS_METALS } from "@/constants";
import { getAssetsData } from "@/lib/assets";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserDepositRequest } from "@/actions/deposit.action";

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

  const { coinData } = await getAssetsData();
  const existingRequest = await getUserDepositRequest();
  const coinDetails = coinData.find(
    (asset) =>
      asset.symbol.toLowerCase() === coin.toLowerCase() &&
      (asset.network?.toLowerCase() === network.toLowerCase() || network === "native")
  );

  return (
    <DepositClient
      key={`${coin.toLowerCase()}-${network.toLowerCase()}`}
      coin={coin}
      network={network}
      price={coinDetails?.price ?? 0}
      existingRequest={existingRequest}
    />
  )
}

export default DepositCoinNetwork