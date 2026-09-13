"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import CryptoCoins from "../crypto-coins";
import { Badge } from "../ui/badge";

type Props = {
  coinData: CryptoData[];
  page: "buy" | "deposit" | "withdraw";
};

export default function CryptoListClient({ coinData, page }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = coinData.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.network?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-[0.5px] focus:ring-gray-700"
        />
      </div>

      <div className="mb-6">
        <Badge className="px-5 py-2 bg-transparent border border-gray-300 dark:border-gray-700 text-black dark:text-white">
          All Networks
        </Badge>
      </div>

      <div>
        <CryptoCoins coinData={filteredData} page={page} />
      </div>
    </>
  );
}
