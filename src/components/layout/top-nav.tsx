"use client";

import { Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { User } from '@/lib/auth'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";

export function TopNav({ user }: { user: User }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const send = pathname.startsWith("/send");
  const receive = pathname.startsWith("/receive");
  const buy = pathname.startsWith("/buy");
  const title = (send || receive || buy) ? "Home" : pathname.split('/').pop() || "Dashboard";

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="mr-4" />
        <h1 className="text-xl font-semibold capitalize">{title}</h1>
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {user.name.split("")[0]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {user.role === "admin" && (
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link
                    href="/admin"
                  >
                    Admin
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                asChild
                className="cursor-pointer"
              >
                <Link
                  href="/profile"
                >
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center space-x-2">
          <Sun className="text-sm w-4 h-4" />
          <button
            onClick={toggleTheme}
            className="w-10 h-6 flex items-center bg-gray-300 dark:bg-blue-600 rounded-full p-1 duration-300 ease-in-out cursor-pointer"
          >
            <div
              className={cn(
                "bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out",
                theme === "dark" && "translate-x-4"
              )}
            />
          </button>
          <Moon className="text-sm w-4 h-4" />
        </div>
      </div>
    </nav>
  );
}
