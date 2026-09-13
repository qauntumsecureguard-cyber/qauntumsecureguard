import { cn } from '@/lib/utils';
import Link from 'next/link';
import NotificationContent from './notification-content';
import { Bell } from 'lucide-react';

async function NotificationSidebarContent() {
  const isActive = false;

  return (
    <div className="pt-2">
      <Link
        href="/notifications"
        className={cn(
          "relative flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded-lg",
          isActive && "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white"
        )}
      >
        <Bell className="w-5 h-5 mr-3" />
        <span>Notifications</span>
        <span className="absolute top-0 right-11 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          <NotificationContent />
        </span>
      </Link>
    </div>
  )
}

export default NotificationSidebarContent