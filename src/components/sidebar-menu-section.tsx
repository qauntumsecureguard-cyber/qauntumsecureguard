"use client";

import { SIDEBAR_MENU_GROUPS } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SidebarMenuSection() {
  const pathname = usePathname();

  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && (window as any).smartsupp) {
      (window as any).smartsupp("chat:open");
    } else {
      window.location.href = "/support";
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {SIDEBAR_MENU_GROUPS.map((group) => (
        <div key={group.title} className="space-y-1.5">
          <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {group.title}
          </h3>
          <nav className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const itemPath = item.href.split("?")[0];
              const isActive =
                !item.isAction &&
                (pathname === item.href ||
                  (itemPath !== "/dashboard" && pathname.startsWith(itemPath)));

              if (item.isAction) {
                return (
                  <button
                    key={item.label}
                    onClick={handleSupportClick}
                    className="w-full flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/80 dark:hover:bg-white/10 px-3 py-2.5 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <Icon className="w-4.5 h-4.5 mr-3 shrink-0 text-gray-500 dark:text-gray-400" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium px-3.5 py-2.5 rounded-xl transition-colors",
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-xs"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/80 dark:hover:bg-white/10"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4.5 h-4.5 mr-3 shrink-0 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white"
                    )}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}

export default SidebarMenuSection;