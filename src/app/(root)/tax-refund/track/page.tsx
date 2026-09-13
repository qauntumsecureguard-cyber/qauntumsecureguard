import { getUserTaxRefunds } from "@/actions/tax-refund.action";
import TaxRefundTrackClient from "@/components/clients/tax-refund-track-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TaxRefundTrackPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw redirect("/login");
  }

  const { refunds } = await getUserTaxRefunds();

  return <TaxRefundTrackClient initialRefunds={refunds} />;
}
