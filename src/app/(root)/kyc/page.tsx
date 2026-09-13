import KycClient from "@/components/clients/kyc-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function Kyc() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw redirect("/login");
  }

  return <KycClient user={session.user} />
}

export default Kyc