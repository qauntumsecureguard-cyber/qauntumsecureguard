import { BottomNav } from '@/components/layout/bottom-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { TopNav } from '@/components/layout/top-nav'
import { auth } from "@/lib/auth"
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { recordUserGeo } from "@/lib/geo";
import { getUserNotifications } from "@/actions/notification.action";

async function RootLayout({ children }: { children: React.ReactNode }) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session) {
    throw redirect("/login")
  }

  if (!(session.user as any).ipAddress || !(session.user as any).country) {
    recordUserGeo(session.user.id, reqHeaders).catch(() => {});
  }

  let unreadCount = 0;
  try {
    const notifications = await getUserNotifications(session.user.id);
    unreadCount = notifications.filter((n) => !n.read).length;
  } catch (error) {
    console.error("Failed to fetch notification count:", error);
  }

  return (
    <>
      <div className="flex min-h-dvh bg-white text-gray-700 dark:bg-dark-800 dark:text-white">
        <Sidebar />
        <div className="content-area flex-1 md:ml-64 mr-0">
          <TopNav user={session.user} />
          {children}
        </div>
        <BottomNav unreadCount={unreadCount} />
      </div>
    </>
  )
}

export default RootLayout