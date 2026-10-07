"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateWithdrawalStatusAdmin } from "@/actions/withdrawal.action";

export default function WithdrawalStatusButton({
  withdrawalId,
  currentStatus,
}: {
  withdrawalId: string;
  currentStatus: "pending" | "approved" | "completed" | "rejected";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdate = async (
    status: "approved" | "completed" | "rejected" | "pending"
  ) => {
    if (status === currentStatus) return;
    setLoading(status);
    try {
      const res = await updateWithdrawalStatusAdmin(withdrawalId, status);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Withdrawal marked as ${status}`);
        router.refresh();
      }
    } catch {
      toast.error("Failed to update withdrawal status");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 min-w-[100px]">
      {currentStatus !== "approved" && currentStatus !== "completed" && (
        <button
          onClick={() => handleUpdate("completed")}
          disabled={!!loading}
          className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
        >
          {loading === "completed" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : null}
          Approve / Complete
        </button>
      )}

      {currentStatus !== "pending" && (
        <button
          onClick={() => handleUpdate("pending")}
          disabled={!!loading}
          className="w-full py-1.5 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
        >
          {loading === "pending" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : null}
          Pending
        </button>
      )}

      {currentStatus !== "rejected" && (
        <button
          onClick={() => handleUpdate("rejected")}
          disabled={!!loading}
          className="w-full py-1.5 px-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-500 text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
        >
          {loading === "rejected" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : null}
          Reject
        </button>
      )}
    </div>
  );
}
