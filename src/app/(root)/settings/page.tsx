import SettingsClient from '@/components/clients/settings-client'
import NotificationContent from '@/components/notification-content'
import { ArrowLeft, Bell, UserPlus } from 'lucide-react'
import Link from 'next/link'

function Settings() {
  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-all duration-300 pb-24 md:pb-4 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 p-4">
        <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold text-center flex-1">Settings</h1>
        <div className="w-6"></div>
      </div>

      {/* Main Settings Section */}
      <div className="space-y-0 bg-transparent">
        <Link
          href="/notifications"
          className="relative flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 transition-colors"
        >
          <Bell className="mr-3 text-gray-600 dark:text-gray-400 w-5" />
          <span>Notifications</span>
          <span className="absolute top-5 right-4 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            <NotificationContent />
          </span>
        </Link>

        <Link
          href="/kyc"
          className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 transition-colors"
        >
          <UserPlus className="mr-3 text-gray-600 dark:text-gray-400 w-5" />
          <span>Kyc</span>
        </Link>
      </div>

      <SettingsClient />
    </div>
  )
}

export default Settings
