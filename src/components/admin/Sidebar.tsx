"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, Award, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/add-balance", label: "Add Balance", icon: PlusCircle },
  { href: "/admin/grants", label: "Grant Requests", icon: Award },
  { href: "/admin/tax-refunds", label: "Tax Refunds", icon: DollarSign },
];

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 top-20 hidden md:flex flex-col w-48 lg:w-56 h-full border-r border-gray-200 dark:border-white/10 px-3 py-6 bg-white dark:bg-gray-900 transition-colors">
      <nav className="flex flex-col gap-1.5 w-full">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors w-full",
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
              )}
            >
              <Icon
                size={18}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;