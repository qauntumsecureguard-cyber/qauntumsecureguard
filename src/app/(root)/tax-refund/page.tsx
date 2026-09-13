import TaxRefundClient from "@/components/clients/tax-refund-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function TaxRefundPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw redirect("/login");
  }

  return <TaxRefundClient user={session.user} />;
}
