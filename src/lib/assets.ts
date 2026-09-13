import { CRYPTO_ASSETS, PRECIOUS_METALS, METAL_PRICES } from "@/constants";

export async function getAssetsData() {
  try {
    const uniqueIds = [...new Set(CRYPTO_ASSETS.map((asset) => asset.id))].join(",");

    // Fetch Crypto and Metal prices in parallel
    const [cryptoResponse, metalResponse] = await Promise.allSettled([
      fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${uniqueIds}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`,
      ),
      process.env.METAL_DEV_API_KEY
        ? fetch(`https://api.metals.dev/v1/latest?api_key=${process.env.METAL_DEV_API_KEY}&currency=USD&unit=toz`, {
          next: { revalidate: 43200 } // Refetch every 12 hours (2 times a day)
        })
        : Promise.reject("No Metal API key found")
    ]);

    // Handle Crypto Data
    let cryptoDataMap: any = {};
    if (cryptoResponse.status === "fulfilled" && cryptoResponse.value.ok) {
      cryptoDataMap = await cryptoResponse.value.json();
    }

    // Handle Metal Data
    let metalPricesFromApi: Record<string, number> = {};
    if (metalResponse.status === "fulfilled" && metalResponse.value.ok) {
      try {
        const metalData = await metalResponse.value.json();
        // Robust check for the metals object structure
        if (metalData?.status === "success" && metalData?.data?.metals) {
          metalPricesFromApi = {
            XAU: metalData.data.metals.gold,
            XAG: metalData.data.metals.silver,
            XPT: metalData.data.metals.platinum,
            XPD: metalData.data.metals.palladium,
          };
        }
      } catch (e) {
        console.error("Error parsing metal API response:", e);
      }
    }

    const coinData = CRYPTO_ASSETS.map((coin) => {
      return {
        symbol: coin.symbol,
        name: coin.name,
        id: coin.id,
        balance: coin.balance,
        icon_image: coin.icon_image,
        network_image: coin.network_image,
        network: coin.network,
        price: Number(cryptoDataMap[coin.id]?.usd || 0),
        change24h: Number(cryptoDataMap[coin.id]?.usd_24h_change || 0),
        volume_24h: Number(cryptoDataMap[coin.id]?.usd_24h_vol || 0),
        market_cap: Number(cryptoDataMap[coin.id]?.usd_market_cap || 0),
      } as CryptoData;
    });

    const metalData = PRECIOUS_METALS.map((metal) => ({
      ...metal,
      price: metalPricesFromApi[metal.symbol] || METAL_PRICES[metal.symbol] || 0,
      change24h: 0,
      volume_24h: 0,
      market_cap: 0
    })) as CryptoData[];

    return { coinData, metalData };
  } catch (err) {
    console.error("Error fetching assets data:", err);
    return { coinData: [], metalData: [] };
  }
}
