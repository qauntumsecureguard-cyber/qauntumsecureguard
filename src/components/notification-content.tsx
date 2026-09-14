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

  const unreadNotifications = (await getUserNotifications(session.user.id)).filter(one => one.read === false);
  const count = unreadNotifications.length;

  return <span>{count > 99 ? "99+" : count}</span>
}

export default NotificationContent;