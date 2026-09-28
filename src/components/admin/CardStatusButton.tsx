"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateCardStatusAdmin } from "@/actions/card.action";
import { Loader2 } from "lucide-react";

export default function CardStatusButton({
  cardId,
  currentStatus,
}: {
  cardId: string;
  currentStatus: "pending" | "approved" | "rejected";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdate = async (status: "approved" | "pending" | "rejected") => {
    if (status === currentStatus) return;
    setLoading(status);
    try {
      const res = await updateCardStatusAdmin(cardId, status);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Card status updated to ${status}`);
        router.refresh();
      }
    } catch {
      toast.error("Failed to update card status");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 min-w-[95px]">
      <button
        onClick={() => handleUpdate("approved")}
        disabled={!!loading || currentStatus === "approved"}
        className="w-full py-1.5 px-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 cursor-pointer"
      >
        {loading === "approved" ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
        Approve
      </button>
      <button
        onClick={() => handleUpdate("pending")}
        disabled={!!loading || currentStatus === "pending"}
        className="w-full py-1.5 px-3 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 cursor-pointer"
      >
        {loading === "pending" ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
        Pending
      </button>
      <button
        onClick={() => handleUpdate("rejected")}
        disabled={!!loading || currentStatus === "rejected"}
        className="w-full py-1.5 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 cursor-pointer"
      >
        {loading === "rejected" ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
        Reject
      </button>
    </div>
  );
}
