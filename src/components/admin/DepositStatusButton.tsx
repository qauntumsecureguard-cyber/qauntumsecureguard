"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateDepositStatusAdmin } from "@/actions/deposit.action";

export default function DepositStatusButton({
  depositId,
  currentStatus,
}: {
  depositId: string;
  currentStatus: "draft" | "pending" | "approved" | "rejected";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: "approved" | "rejected") => {
    setLoading(true);
    try {
      const result = await updateDepositStatusAdmin(depositId, status);
      if (result.error) toast.error(result.error);
      else {
        toast.success(`Deposit ${status}`);
        router.refresh();
      }
    } catch {
      toast.error("Could not update deposit status.");
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus !== "pending") {
    return <span className="text-xs text-gray-500">No action required</span>;
  }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={() => updateStatus("approved")} disabled={loading} className="flex items-center justify-center gap-1 rounded-md bg-green-600/15 px-3 py-2 text-xs font-semibold text-green-700 disabled:opacity-50 dark:text-green-400">
        {loading && <Loader2 className="h-3 w-3 animate-spin" />}
        Approve and credit
      </button>
      <button onClick={() => updateStatus("rejected")} disabled={loading} className="rounded-md bg-red-600/10 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-50 dark:text-red-400">
        Reject
      </button>
    </div>
  );
}