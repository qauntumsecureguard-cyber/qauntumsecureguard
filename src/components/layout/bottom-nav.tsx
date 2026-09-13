"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/constants";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex justify-evenly gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center py-2.5 px-3 transition-colors",
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Icon className="text-xl" />
              <span className="text-[11px] mt-1 font-medium">{item.label}</span>
              {item.label === "Me" && (
                <span className="absolute top-1.5 right-2 bg-red-500 text-white text-[10px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
                  0
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
