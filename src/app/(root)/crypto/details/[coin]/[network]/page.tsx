import { getCoinRelatedTransactions } from '@/actions/notification.action';
import CryptoDetailsNetworkClient from '@/components/clients/crypto-details-network-client'
import { CRYPTO_ASSETS, PRECIOUS_METALS } from '@/constants';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { getAssetsData } from '@/lib/assets';

type Params = {
  params: Promise<{ coin: string, network: string }>
}

async function CryptoDetailsNetwork({ params }: Params) {
  const { coin, network } = (await params);

  const asset = [...CRYPTO_ASSETS, ...PRECIOUS_METALS].filter(asset => asset.symbol === coin.toUpperCase())[0];

  if (!asset) {
    throw notFound();
  }

  const [session, assets] = await Promise.all([
    auth.api.getSession({
      headers: await headers()
    }),
    getAssetsData()
  ])

  const { coinData, metalData } = assets;
  const allAssets = [...coinData, ...metalData];
  const assetData = allAssets.find(a => a.id === asset.id);
  const coinPrice = assetData ? { usd: assetData.price } : { usd: 0 };

  if (!session) {
    throw redirect("/login")
  }

  const transactions = await getCoinRelatedTransactions(session.user.id, coin.toLocaleUpperCase());

  const coinProp = (
    network === "native" ? coin.toUpperCase() : `${coin.toUpperCase()}_${network.toUpperCase()}`
  ) as keyof UserCoin

  return (
    <CryptoDetailsNetworkClient
      coin={coin}
      transactions={JSON.stringify(transactions)}
      coinDetails={{
        coinBalance: (JSON.parse(session.user.coins) as UserCoin)[coinProp].balance,
        coinPrice: coinPrice.usd,
        coinName: asset.name,
        src: asset.icon_image,
        alt: asset.name,
        networkSrc: asset.network_image,
        network: asset.network
      }}
    />
  )
}

export default CryptoDetailsNetwork