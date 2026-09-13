import Link from "next/link";
import SidebarMenuSection from "../sidebar-menu-section";

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white h-screen fixed left-0 top-0 overflow-y-auto border-r border-gray-200 dark:border-white/10 transition-colors duration-200">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-white/10">
        <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Qauntum Secure Guard
        </Link>
      </div>

      <div className="px-3 py-4">
        {/* Grouped Menu Section */}
        <SidebarMenuSection />
      </div>
    </aside>
  );
}
