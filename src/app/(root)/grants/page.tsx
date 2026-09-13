import GrantsClient from "@/components/clients/grants-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function GrantsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw redirect("/login");
  }

  return <GrantsClient />;
}
