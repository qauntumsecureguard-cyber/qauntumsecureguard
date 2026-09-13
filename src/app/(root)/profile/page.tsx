import ProfileClient from "@/components/clients/profile-client";
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

async function Profile() {
  const [session, sessions] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    auth.api.listSessions({ headers: await headers() })
  ])

  if (!session) {
    return redirect("/login");
  }

  return <ProfileClient session={session} sessions={sessions} />
}

export default Profile