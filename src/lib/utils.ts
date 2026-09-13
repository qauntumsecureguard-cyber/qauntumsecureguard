import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCoinKey = (asset: { symbol: string, network: string | null }) => {
  return asset.network ? `${asset.symbol}_${asset.network}` : asset.symbol;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}