"use client";

import { toast } from 'sonner'
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateKycStatus } from '@/actions/kyc.action';

function KycClientButton({ kyc, userId }: { kyc: { status: string, image: string, type: string }, userId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleKyc = async (status: KYCStatus) => {
    if (kyc.status === status) return toast.error("Kyc Status is already " + status)
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const res = await updateKycStatus({
        userId,
        status: status as "approved" | "pending" | "rejected",
        currentKyc: kyc
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Kyc Status updated successfully");
        router.refresh();
      }
    } catch (err) {
      toast.error("An error occurred while updating status");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <span className="block mb-4 capitalize">Kyc Status: <Badge>{kyc.status}</Badge></span>

      <div className="flex flex-col justify-start w-full gap-3">
        <button
          className='text-sm bg-green-500 w-1/2 px-2 py-1 rounded-md'
          onClick={() => handleKyc("approved")}
          disabled={isSubmitting}
          style={{ opacity: isSubmitting ? 0.5 : 1, cursor: isSubmitting ? "not-allowed" : "pointer", pointerEvents: isSubmitting ? "none" : "auto" }}
        >
          Change to Approved
        </button>
        <button
          className='text-sm bg-blue-500 w-1/2 px-2 py-1 rounded-md'
          onClick={() => handleKyc("pending")}
          disabled={isSubmitting}
          style={{ opacity: isSubmitting ? 0.5 : 1, cursor: isSubmitting ? "not-allowed" : "pointer", pointerEvents: isSubmitting ? "none" : "auto" }}
        >
          Change to Pending
        </button>
        <button
          className='text-sm bg-red-500 w-1/2 px-2 py-1 rounded-md'
          onClick={() => handleKyc("rejected")}
          disabled={isSubmitting}
          style={{ opacity: isSubmitting ? 0.5 : 1, cursor: isSubmitting ? "not-allowed" : "pointer", pointerEvents: isSubmitting ? "none" : "auto" }}
        >
          Change to Rejected
        </button>
      </div>
    </div>
  )
}

export default KycClientButton