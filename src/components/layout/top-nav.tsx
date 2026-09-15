"use client";

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
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Services</DropdownMenuLabel>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/grants">Grants</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/tax-refund">Tax Refund</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/benefits">Benefits</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </nav>
  );
}
