import { Home, Cog, CreditCard, ImageIcon, Smartphone, TrendingUp, Shield, Globe, Send, CheckCircle2, Lock, User, UserCheck, Star, Award, DollarSign, LayoutDashboard, ArrowDownLeft, ArrowUpRight, RefreshCw, ShoppingCart, Bell, Wallet, LucideIcon, ArrowLeftRight } from "lucide-react";

export const CRYPTO_ASSETS = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    id: "bitcoin",
    balance: 0,
    icon_image: "/images/coins/btc.png",
    network_image: null,
    network: null
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    id: "ethereum",
    balance: 0,
    icon_image: "/images/coins/eth.png",
    network_image: null,
    network: null
  },
  {
    symbol: "USDT",
    name: "Tether",
    id: "tether",
    balance: 0,
    icon_image: "/images/coins/usdt.png",
    network_image: "/images/coins/trx.png",
    network: "TRC20"
  },
  {
    symbol: "ADA",
    name: "Cardano",
    id: "cardano",
    balance: 0,
    icon_image: "/images/coins/ada.png",
    network_image: null,
    network: null
  },
  {
    symbol: "XLM",
    name: "Stellar",
    id: "stellar",
    balance: 0,
    icon_image: "/images/coins/xlm.png",
    network_image: null,
    network: null
  },
  {
    symbol: "XRP",
    name: "Ripple",
    id: "ripple",
    balance: 0,
    icon_image: "/images/coins/xrp.png",
    network_image: null,
    network: null
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    id: "dogecoin",
    balance: 0,
    icon_image: "/images/coins/doge.png",
    network_image: null,
    network: null
  },
  {
    symbol: "SOL",
    name: "Solana",
    id: "solana",
    balance: 0,
    icon_image: "/images/coins/sol.png",
    network_image: null,
    network: null
  }
]

export const PRECIOUS_METALS = [
  {
    symbol: "XAU",
    name: "Gold",
    id: "gold",
    balance: 0,
    icon_image: "/images/coins/gold.png",
    network_image: null,
    network: null
  },
  {
    symbol: "XAG",
    name: "Silver",
    id: "silver",
    balance: 0,
    icon_image: "/images/coins/silver.png",
    network_image: null,
    network: null
  },
  {
    symbol: "XPT",
    name: "Platinum",
    id: "platinum",
    balance: 0,
    icon_image: "/images/coins/platinum.png",
    network_image: null,
    network: null
  },
  {
    symbol: "XPD",
    name: "Palladium",
    id: "palladium",
    balance: 0,
    icon_image: "/images/coins/palladium.png",
    network_image: null,
    network: null
  }
]

export const METAL_PRICES: Record<string, number> = {
  XAU: 5115.80,
  XAG: 110.81,
  XPT: 2898.90,
  XPD: 2112.30
};

export const enum MenuItems {
  Home = "Home",
  Kyc = "Kyc",
  Deposit = "Deposit",
  Withdraw = "Withdraw",
  Card = "Card",
  Grants = "Grants",
  TaxRefund = "Tax Refund",
  Benefits = "Benefits",
  Settings = "Settings",
  Notification = "Notification"
}

export enum NotificationCategory {
  SWAP = "swap",
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  BUY = "buy",
  RECEIVE = "recieve",
  KYC_UPDATE = "kyc_update",
  METAL_BUY = "metal_buy",
  WALLET_CONNECT = "wallet_connect"
}

export interface SidebarMenuItem {
  href: string;
  icon: LucideIcon;
  label: string;
  isAction?: boolean;
}

export interface SidebarMenuGroup {
  title: string;
  items: SidebarMenuItem[];
}

export const SIDEBAR_MENU_GROUPS: SidebarMenuGroup[] = [
  {
    title: "MAIN",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/card", icon: CreditCard, label: "Cards" },
      { href: "/kyc", icon: UserCheck, label: "KYC Verification" },
      { href: "/notifications", icon: Bell, label: "Notifications" },
    ],
  },
  {
    title: "TRANSFERS",
    items: [
      { href: "/deposit", icon: ArrowDownLeft, label: "Deposit" },
      { href: "/withdraw", icon: ArrowUpRight, label: "Withdraw" },
      { href: "/swap", icon: RefreshCw, label: "Currency Swap" },
      { href: "/buy", icon: ShoppingCart, label: "Buy Crypto" },
    ],
  },
  {
    title: "SERVICES",
    items: [
      { href: "/grants", icon: Award, label: "Grants" },
      { href: "/tax-refund", icon: DollarSign, label: "Tax Refund" },
      { href: "/benefits", icon: Star, label: "Benefits" },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { href: "/settings", icon: Cog, label: "Settings" }
    ],
  },
];

export const MENU_ITEMS = [
  { href: "/dashboard", icon: Home, label: MenuItems.Home },
  { href: "/kyc", icon: UserCheck, label: MenuItems.Kyc },
  { href: "/card", icon: CreditCard, label: MenuItems.Card },
  { href: "/grants", icon: Award, label: MenuItems.Grants },
  { href: "/tax-refund", icon: DollarSign, label: MenuItems.TaxRefund },
  { href: "/benefits", icon: Star, label: MenuItems.Benefits },
  { href: "/settings", icon: Cog, label: MenuItems.Settings }
];

export const features = [
  {
    icon: Globe,
    title: "Multi-Chain Support",
    description: "Support for multiple blockchains including Ethereum, Binance Smart Chain, Polygon, and more.",
    tags: ["Ethereum", "BSC", "Polygon"],
    color: "purple",
  },
  {
    icon: TrendingUp,
    title: "DeFi Integration",
    description: "Direct access to decentralized exchanges, lending platforms, and yield farming opportunities.",
    tags: ["Swap", "Stake", "Farm"],
    color: "pink",
  },
  {
    icon: Shield,
    title: "Advanced Security",
    description:
      "Enterprise-grade security with multi-sig support, hardware wallet integration, and biometric authentication.",
    tags: ["2FA", "Multi-sig", "Biometric"],
    color: "purple",
  },
  {
    icon: TrendingUp,
    title: "Portfolio Tracking",
    description: "Real-time portfolio monitoring with price alerts, performance analytics, and tax reporting tools.",
    tags: ["Analytics", "Alerts", "Reports"],
    color: "pink",
  },
  {
    icon: ImageIcon,
    title: "NFT Support",
    description: "Store, view, and manage your NFT collection with support for multiple marketplaces and chains.",
    tags: ["Gallery", "Trading", "Tracking"],
    color: "purple",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform",
    description: "Access your wallet seamlessly across desktop, mobile, and browser extension platforms.",
    tags: ["Desktop", "Mobile", "Extension"],
    color: "pink",
  },
]

export const securityFeatures = [
  {
    icon: Lock,
    title: "Military-Grade Encryption",
    description:
      "Your private keys are encrypted using AES-256 encryption, the same standard used by military and financial institutions.",
  },
  {
    icon: CheckCircle2,
    title: "Multi-Factor Authentication",
    description:
      "Enhanced security with optional biometric authentication, hardware key support, and time-based OTP.",
  },
  {
    icon: Send,
    title: "Smart Contract Auditing",
    description:
      "Automatic scanning and verification of smart contracts before interaction to prevent malicious transactions.",
  },
]

export const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/card", icon: CreditCard, label: "Cards" },
  { href: "/grants", icon: Award, label: "Grants" },
  { href: "/tax-refund", icon: DollarSign, label: "Tax Refund" },
  { href: "/settings", icon: User, label: "Me" }
];

export const platforms = [
  { value: "trustwallet", label: "Trust Wallet" },
  { value: "metamask", label: "Metamask" },
  { value: "lobstr", label: "Lobstr" },
  { value: "bitpay", label: "Bitpay" },
  { value: "coinbase", label: "Coinbase Wallet" },
  { value: "edge", label: "Edge Wallet" },
  { value: "uniswap", label: "Uniswap" },
  { value: "polygon", label: "Polygon" },
  { value: "blockchain", label: "Blockchain" },
  { value: "exodus", label: "Exodus" },
  { value: "atomic_wallet", label: "Atomic Wallet" },
  { value: "robinhood", label: "Robinhood Wallet" },
  { value: "uphold_wallet", label: "Uphold Wallet" },
  { value: "luno", label: "Luno Wallet" },
  { value: "ledger_wallet", label: "Ledger Wallet" },
  { value: "trezor_wallet", label: "Trezor Wallet" },
  { value: "electrum_wallet", label: "Electrum Wallet" },
  { value: "coinomi_wallet", label: "Coinomi Wallet" },
  { value: "safepal_wallet", label: "Safepal Wallet" },
  { value: "zengo_wallet", label: "Zengo Wallet" },
  { value: "other", label: "Others" },
]

export const faqs = [
  { question: "What level of protection does my wallet receive?", answer: "Your wallet benefits from military-grade 256-bit encryption, dual-factor authentication, and 95% of holdings remain in offline vault storage." },
  { question: "What transaction costs should I expect?", answer: "We provide competitive rates beginning at 0.1% per trade. High-volume participants receive preferential pricing structures." },
  { question: "What's the timeline for fund withdrawals?", answer: "Digital asset withdrawals complete within 15-30 minutes. Traditional bank transfers typically take 1-3 business days." },
  { question: "Is customer assistance available?", answer: "Certainly! Round-the-clock support is available through multiple channels including live chat, email, and telephone. Our dedicated specialists are prepared to assist." },
]

export const patner = [
  {
    name: "Coinbase",
    image: "/images/patners/coinbase.png"
  },
  {
    name: "Crypto.com",
    image: "/images/patners/cryptocom.png"
  },
  {
    name: "Paybis.com",
    image: "/images/patners/paybis.png"
  },
  {
    name: "Trustwallet.com",
    image: "/images/patners/trust-wallet.png"
  },
  {
    name: "Moonpay.com",
    image: "/images/patners/moonpay.png"
  },
  {
    name: "Bitpay.com",
    image: "/images/patners/bitpay.png"
  },
  {
    name: "Kraken.com",
    image: "/images/patners/kraken.png"
  },
  {
    name: "Binance.us",
    image: "/images/patners/binance.png"
  },
  {
    name: "Robinhood.com",
    image: "/images/patners/robinhood.png"
  }
]