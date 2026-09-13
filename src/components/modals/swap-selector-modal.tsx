import { CRYPTO_ASSETS, PRECIOUS_METALS } from "@/constants";
import CryptoImage from "../crypto-image";
import { X } from "lucide-react";
import { User } from "@/lib/auth";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Params = {
  isOpen: boolean,
  onClose: () => void,
  user: User,
  selectCrypto: (asset: { network: string | null, symbol: string }) => void,
  from: FromAndTo,
  to: FromAndTo,
  currentSelector: "from" | "to",
}

function SwapSelectorModal({
  isOpen, onClose, user, selectCrypto, from, to, currentSelector
}: Params) {
  const [tab, setTab] = useState<"assets" | "metals">("assets");

  if (!isOpen) return null;

  const coins = JSON.parse(user.coins) as UserCoin;

  const handleSelectorChange = (asset: { network: string | null, symbol: string }) => {
    selectCrypto({ network: asset.network, symbol: asset.symbol })
  }

  const currentAssets = tab === "assets" ? CRYPTO_ASSETS : PRECIOUS_METALS;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white dark:bg-gray-900 rounded-t-xl md:rounded-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Select Asset</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTab("assets")}
              className={cn(
                "text-xs font-bold py-2 px-4 rounded-md transition-colors",
                tab === "assets"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
              )}
            >
              Assets
            </button>
            <button
              onClick={() => setTab("metals")}
              className={cn(
                "text-xs font-bold py-2 px-4 rounded-md transition-colors",
                tab === "metals"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
              )}
            >
              Precious Metals
            </button>
          </div>
        </div>

        <div className="p-4">
          {currentAssets.map((asset) => {
            const coinKey = asset.network ? `${asset.symbol}_${asset.network}` : asset.symbol;
            const coin = coins[coinKey as keyof UserCoin] || { balance: 0 }

            if (from.symbol === asset.symbol && currentSelector === "to") return null
            if (to.symbol === asset.symbol && currentSelector === "from") return null

            return (
              <button
                key={asset.id + crypto.randomUUID()}
                onClick={() => handleSelectorChange(asset)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <CryptoImage
                    src={asset.icon_image}
                    alt={asset.name}
                    networkSrc={asset.network_image}
                    network={asset.network}
                  />
                  <div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm">
                          {asset.symbol} {tab === "metals" && `(${asset.name})`}
                        </span>
                        {asset.network && (
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                            {asset.network}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <span>Balance:</span> {coin.balance}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SwapSelectorModal
