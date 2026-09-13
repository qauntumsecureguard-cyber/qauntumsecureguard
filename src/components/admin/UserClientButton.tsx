"use client";

import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Badge } from '../ui/badge';
import { createNotification } from '@/actions/notification.action';
import { NotificationCategory } from '@/constants';

function UserClientButton({ walletStatus, userId }: { walletStatus: string, userId: string }) {
  const handleWalletChange = (status: "connected" | "pending" | "not-connected") => {
    authClient.admin.updateUser({
      userId,
      data: {
        walletStatus: status
      }
    }, {
      onError(context) {
        toast.error(context.error.message || "An error occured.")
      },
      onSuccess() {
        toast.success("User Wallet Status updated successfully")
        createNotification({
          userId,
          type: NotificationCategory.WALLET_CONNECT,
          title: "Wallet Status Updated",
          description: `Your wallet connection status has been updated to ${status}.`,
        })
      }
    })
  }

  return (
    <div>
      <span className="block mb-4 capitalize">Wallet Status: <Badge>{walletStatus}</Badge></span>

      <div className="flex flex-col justify-start w-full gap-3">
        <button
          className='bg-green-500 w-1/2 px-2 py-1 rounded-md'
          onClick={() => handleWalletChange("connected")}
        >
          Change to Connected
        </button>
        <button
          className='bg-blue-500 w-1/2 px-2 py-1 rounded-md'
          onClick={() => handleWalletChange("pending")}
        >
          Change to Pending
        </button>
        <button
          className='bg-red-500 w-1/2 px-2 py-1 rounded-md'
          onClick={() => handleWalletChange("not-connected")}
        >
          Change to Not Connected
        </button>
      </div>
    </div>
  )
}

export default UserClientButton