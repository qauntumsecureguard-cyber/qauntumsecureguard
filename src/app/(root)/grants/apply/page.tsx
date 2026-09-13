import GrantApplyClient from "@/components/clients/grant-apply-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function GrantApplyPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw redirect("/login");
  }

  return <GrantApplyClient user={session.user} />;
}
