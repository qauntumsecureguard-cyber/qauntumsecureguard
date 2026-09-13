import { getUserNotifications } from "@/actions/notification.action"
import NotificationsClient from "@/components/clients/notifications-client"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";

async function Notifications() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw redirect("/login");
  }

  const notifications = await getUserNotifications(session.user.id)
  return <NotificationsClient notifications={JSON.stringify(notifications)} user={session.user} />
}

export default Notifications