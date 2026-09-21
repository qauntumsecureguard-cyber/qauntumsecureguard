import Link from "next/link";
import SidebarMenuSection from "../sidebar-menu-section";

export function Sidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white text-black h-screen fixed left-0 top-0 overflow-y-auto border-r border-gray-200">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <Link href="/" className="text-lg font-bold text-black hover:text-blue-600 transition-colors">
          Qauntum Secure Guard
        </Link>
      </div>

      <div className="px-3 py-4">
        {/* Grouped Menu Section */}
        <SidebarMenuSection unreadCount={unreadCount} />
      </div>
    </aside>
  );
}
