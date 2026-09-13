"use client";

import CryptoImage from "./crypto-image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

type PreciousMetalsProps = {
  metalData: CryptoData[],
  page: "dashboard" | "buy" | "deposit" | "withdraw"
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <p className="text-gray-500 dark:text-gray-400">No precious metals found</p>
  </div>
);

function PreciousMetals({ metalData, page }: PreciousMetalsProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/dashboard";

  const getHref = (asset: CryptoData) => {
    switch (page) {
      case "dashboard":
        return `/crypto/details/${asset.symbol.toLowerCase()}/${asset.network ? asset.network.toLowerCase() : "native"}`
      case "buy":
        return `/buy/details/${asset.symbol.toLowerCase()}/${asset.network ? asset.network.toLowerCase() : "native"}`
      case "deposit":
        return `/deposit/${asset.symbol.toLowerCase()}/${asset.network ? asset.network.toLowerCase() : "native"}`
      case "withdraw":
        return `/withdraw/${asset.symbol.toLowerCase()}/${asset.network ? asset.network.toLowerCase() : "native"}`
    }
  }

  if (!metalData || metalData.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={cn("space-y-4", !isHomePage && "space-y-2")}>
      {metalData.map((asset) => {
        const isPositive = asset.change24h >= 0;

        return (
          <Link
            key={asset.id}
            className="block"
            href={getHref(asset)}
          >
            <div
              className={cn(
                "flex items-center justify-between p-4 py-2 rounded-lg",
                isHomePage && "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-[#2e3847] py-4"
              )}
            >
              <div className="flex items-center space-x-3">
                <CryptoImage
                  src={asset.icon_image}
                  alt={asset.name}
                  networkSrc={asset.network_image}
                  network={asset.network}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">{asset.symbol} ({asset.name})</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    ${asset.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm">{asset.balance}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  ${(asset.balance * asset.price).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default PreciousMetals;
