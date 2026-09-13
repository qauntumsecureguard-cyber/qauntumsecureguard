"use client";

import { useState } from 'react'
import { toast } from 'sonner'
import { TableCell } from '../ui/table';
import Loader from '../Loader';
import { User } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { createNotification } from '@/actions/notification.action';
import { CRYPTO_ASSETS, NotificationCategory, PRECIOUS_METALS } from '@/constants';
import { getCoinKey } from '@/lib/utils';

function UpdateCoinBalanceButton({ user }: { user: User }) {
  const router = useRouter();

  const [type, setType] = useState("")
  const [newBalance, setNewBalance] = useState(0)

  const [isSubmitting, setIsSubmitting] = useState(false);

  const userCoins = JSON.parse(user.coins) as UserCoin;

  const handleClick = () => {
    if (!type) return toast.error("Please choose the type of coin to add new balance.")

    if (newBalance < 0) {
      return toast.error("New balance must not be less than zero.")
    }

    setIsSubmitting(true);

    authClient.admin.updateUser({
      userId: user.id,
      data: {
        coins: JSON.stringify({
          ...userCoins,
          [type]: {
            ...userCoins[type as keyof UserCoin],
            balance: newBalance,
          }
        })
      }
    }, {
      onError(context) {
        setIsSubmitting(false);
        toast.error(context.error.message || "An error occured. Please try again.")
      },
      onSuccess() {
        setIsSubmitting(false);
        toast.success("User balance updated successfully.")
        createNotification({
          userId: user.id,
          type: NotificationCategory.RECEIVE,
          title: "Balance Updated",
          description: `You received ${newBalance} worth of ${type}.`,
          to: type,
          toAmount: newBalance
        })
        setNewBalance(0)
        router.refresh();
      }
    });
  }

  return (
    <>
      <TableCell className="text-gray-500">
        <select required value={type} onChange={(e) => setType(e.target.value)} className="w-[120px] border rounded px-3 py-2 focus:outline-none focus:border-[#42a5f5]">
          <option value="">Choose</option>
          <optgroup label="Crypto Coins">
            {CRYPTO_ASSETS.map((asset) => {
              const key = getCoinKey(asset);
              return (
                <option key={key} value={key}>
                  {asset.symbol} {asset.network ? `(${asset.network})` : ""}
                </option>
              )
            })}
          </optgroup>
          <optgroup label="Precious Metals">
            {PRECIOUS_METALS.map((asset) => {
              const key = getCoinKey(asset);
              return (
                <option key={key} value={key}>
                  {asset.symbol} ({asset.name})
                </option>
              )
            })}
          </optgroup>
        </select>
      </TableCell>
      <TableCell className="text-gray-500">
        <input
          type="number"
          value={newBalance}
          className="border pl-2"
          min={1}
          onChange={(e) => {
            setNewBalance(Boolean(e.target.valueAsNumber) ? e.target.valueAsNumber : 0)
          }}
        />
      </TableCell>
      <TableCell>
        <button
          onClick={handleClick}
          disabled={isSubmitting}
          style={{ cursor: isSubmitting ? "not-allowed" : "pointer" }}
          className="px-6 py-2 bg-[#3b99fb] font-semibold text-sm rounded-sm text-white"
        >
          {isSubmitting ? <Loader /> : "Update"}
        </button>
      </TableCell>
    </>
  )
}

export default UpdateCoinBalanceButton;