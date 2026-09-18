"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { User } from '@/lib/auth'
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import Image from "next/image";

export function TopNav({ user }: { user: User }) {
  const pathname = usePathname();
  const send = pathname.startsWith("/send");
  const receive = pathname.startsWith("/receive");
  const buy = pathname.startsWith("/buy");
  const title = (send || receive || buy) ? "Home" : pathname.split('/').pop() || "Dashboard";

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="mr-4" />
        <h1 className="text-xl font-semibold capitalize">{title}</h1>
      </div>

      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>Qauntum Secure Guard</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {user.role === "admin" && (
                <SheetClose asChild>
                  <Link href="/admin" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                    Admin
                  </Link>
                </SheetClose>
              )}
              <SheetClose asChild>
                <Link href="/profile" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                  Profile
                </Link>
              </SheetClose>

              <div className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Services
              </div>
              <SheetClose asChild>
                <Link href="/benefits" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                  Benefits
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/connect-wallet" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                  Connect Wallet
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/notifications" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                  Notifications
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/settings" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                  Settings
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="hidden md:inline-flex">
              {user.name.charAt(0)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {user.role === "admin" && (
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/admin">Admin</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </nav>
  );
}
