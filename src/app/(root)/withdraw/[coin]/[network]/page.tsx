import WithdrawClient from "@/components/clients/withdraw-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAssetsData } from "@/lib/assets";
import { PRECIOUS_METALS } from "@/constants";
import connectToDb from "@/config/connectToDb";
import CardModel from "@/models/card.model";
import mongoose from "mongoose";

type Params = {
  params: Promise<{ coin: string; network: string }>;
};

async function WithdrawCoinNetwork({ params }: Params) {
  const { coin, network } = await params;

  const [session, assets] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    getAssetsData(),
  ]);

  if (!session) {
    throw redirect("/login");
  }

  await connectToDb();
  const userId = new mongoose.Types.ObjectId(session.user.id);
  const approvedCard = await CardModel.findOne({
    userId,
    status: "approved",
  }).lean();

  const hasApprovedCard = Boolean(approvedCard);

  const { coinData } = assets;

  const processedCoinData = coinData.map((c) => {
    const userCoins = JSON.parse(session.user.coins) as UserCoin;
    let coinSymbol = "";
    if (c.symbol === "USDT" && c.network === "SOLANA") {
      coinSymbol = "USDT_SOLANA";
    } else {
      coinSymbol = c.symbol;
    }

    return {
      ...c,
      balance: Number(userCoins[coinSymbol as keyof typeof userCoins]?.balance || 0),
    } as CryptoData;
  });

  if (PRECIOUS_METALS.find((cn) => cn.symbol.toLowerCase() === coin.toLowerCase())) {
    throw redirect("/swap");
  }

  return (
    <WithdrawClient
      coin={coin}
      network={network}
      coinData={processedCoinData}
      user={session.user}
      hasApprovedCard={hasApprovedCard}
    />
  );
}

export default WithdrawCoinNetwork;