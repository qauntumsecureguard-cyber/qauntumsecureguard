"use client";

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Home, Menu, PlusCircle, Award, DollarSign } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/add-balance", label: "Add Balance", icon: PlusCircle },
  { href: "/admin/grants", label: "Grant Requests", icon: Award },
  { href: "/admin/tax-refunds", label: "Tax Refunds", icon: DollarSign },
];

function MobileSidebar() {
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger>
          <Menu color="white" size={28} />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 z-200">
          <SheetHeader className="-mt-2 mb-4">
            <Link
              href="/"
              className="text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600"
            >
              Qauntum Secure Guard
            </Link>
          </SheetHeader>
          <nav className="flex flex-col gap-1.5 px-2">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link key={item.href} href={item.href} className="w-full">
                  <SheetClose
                    className={cn(
                      "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors text-left",
                      isActive
                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                    )}
                  >
                    <Icon
                      size={18}
                      className={cn(
                        "shrink-0",
                        isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                  </SheetClose>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileSidebar;