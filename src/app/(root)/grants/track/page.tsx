import GrantTrackClient from "@/components/clients/grant-track-client";
import { auth } from "@/lib/auth";
import { getUserGrants } from "@/actions/grant.action";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function GrantTrackPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw redirect("/login");
  }

  const { grants } = await getUserGrants();

  return <GrantTrackClient initialGrants={grants} />;
}
