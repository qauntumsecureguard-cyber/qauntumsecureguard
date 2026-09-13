interface CryptoData {
  symbol: string;
  name: string;
  id: string;
  balance: number;
  icon_image: string;
  network_image: string | null;
  network: string | null;
  price: number;
  change24h: number;
  volume_24h: number;
  market_cap: number;
}

type UserCoin = {
  BTC: {
    balance: number
  },
  "USDT_TRC20": {
    balance: number,
    network: "TRC20"
  },
  ADA: {
    balance: number
  },
  XLM: {
    balance: number
  },
  XRP: {
    balance: number
  },
  DOGE: {
    balance: number
  },
  SOL: {
    balance: number
  },
  XAU: {
    balance: number
  },
  XAG: {
    balance: number
  },
  XPT: {
    balance: number
  },
  XPD: {
    balance: number
  }
}

type FromAndTo = {
  symbol: string
  name: string
  balance: number
  icon_image: string
  network_image: string | null
  network: string | null
  price: number
}

type NotificationType = {
  _id: string;
  userId: string;
  type: "swap" | "deposit" | "withdraw" | "buy" | "recieve" | "kyc_update" | "metal_buy" | "wallet_connect";
  title?: string;
  description?: string;
  from?: string;
  to?: string;
  fromAmount?: number
  toAmount?: number
  read: boolean;
  createdAt: string;
  updatedAt: string;
};

type KYCStatus = "none" | "pending" | "approved" | "rejected"
type Step = "register" | "email" | "submit" | "approval"