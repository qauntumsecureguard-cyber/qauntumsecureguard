"use client"

import { useRouter } from "next/navigation"
import { Eye, Trash2, Bell, ArrowLeft, ArrowUpRight, ArrowDownLeft, ClipboardCheck, ShoppingBag, Gift, ArrowLeftRight } from "lucide-react"
import {
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
} from "@/actions/notification.action";
import { User } from "@/lib/auth";

import { PRECIOUS_METALS } from "@/constants";

const getIcon = (type: string) => {
  switch (type) {
    case "swap":
      return <ArrowLeftRight className="w-5 h-5 text-blue-500" />
    case "deposit":
      return <ArrowDownLeft className="w-5 h-5 text-green-500" />
    case "withdraw":
      return <ArrowUpRight className="w-5 h-5 text-red-500" />
    case "buy":
      return <ShoppingBag className="w-5 h-5 text-yellow-500" />
    case "recieve":
      return <ArrowDownLeft className="w-5 h-5 text-green-500" />
    case "kyc_update":
      return <ClipboardCheck className="w-5 h-5 text-orange-500" />
    case "metal_buy":
      return <ShoppingBag className="w-5 h-5 text-amber-600" />
    case "wallet_connect":
      return <Bell className="w-5 h-5 text-indigo-500" />
    default:
      return <Bell className="w-5 h-5 text-gray-500" />
  }
}

const getAssetDisplayName = (symbol?: string) => {
  if (!symbol) return "";
  const metal = PRECIOUS_METALS.find(m => m.symbol.toUpperCase() === symbol.toUpperCase());
  if (metal) {
    return `${symbol.toUpperCase()} (${metal.name})`;
  }
  return symbol.toUpperCase();
}

function NotificationsClient({ notifications, user }: { notifications: string, user: User }) {
  const router = useRouter();

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    router.refresh()
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    router.refresh()
  };

  const handleMarkAllRead = async (userId: string) => {
    await markAllNotificationsAsRead(userId);
    router.refresh()
  };

  return (
    <main className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300 p-4 pb-24 md:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4">
        <button
          onClick={() => router.back()}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-semibold text-center flex-1">Notifications</h1>
        <button
          onClick={() => handleMarkAllRead(user.id)}
          className="text-sm text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-medium"
        >
          Mark All Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {JSON.parse(notifications).length > 0 ? (
          (JSON.parse(notifications) as NotificationType[]).map((notification) => (
            <div
              key={notification._id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Content */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Icon */}
                  <div className="shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {notification.title || (
                        notification.type === "swap" ? "Crypto Swap" :
                          notification.type === "deposit" ? "Deposit" :
                            notification.type === "withdraw" ? "Withdrawal" :
                              notification.type === "buy" ? "Buy Crypto" :
                                notification.type === "recieve" ? "Receive Balance" :
                                  notification.type === "kyc_update" ? "KYC Update" :
                                    notification.type === "metal_buy" ? "Precious Metal" :
                                      notification.type === "wallet_connect" ? "Wallet Connected" : "Notification"
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 wrap-break-word">
                      {notification.description || (
                        notification.type === "swap"
                          ? `Swapped ${notification.fromAmount} ${getAssetDisplayName(notification.from)} to ${notification.toAmount} ${getAssetDisplayName(notification.to)}`
                          : notification.type === "withdraw"
                            ? `Withdraw Failed ${notification.fromAmount} ${getAssetDisplayName(notification.from)}`
                            : notification.type === "deposit"
                              ? `Deposited ${notification.toAmount} ${getAssetDisplayName(notification.to)}`
                              : notification.type === "buy"
                                ? `Bought ${notification.toAmount} ${getAssetDisplayName(notification.to)}`
                                : notification.type === "metal_buy"
                                  ? `Bought ${notification.toAmount} ${getAssetDisplayName(notification.to)}`
                                  : notification.type === "wallet_connect"
                                    ? "Your wallet has been successfully connected."
                                    : ""
                      )}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 inline-block">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 shrink-0">
                  {notification.read
                    ? null
                    : (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Mark as read"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )
                  }
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Delete notification"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No notifications yet</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default NotificationsClient;