import { getUserNotifications } from '@/actions/notification.action';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

async function NotificationContent() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw redirect("/login");
  }

  const unreadNotifications = (await getUserNotifications(session.user.id)).filter(one => one.read === false)

  return <div>{unreadNotifications.length}</div>
}

export default NotificationContent