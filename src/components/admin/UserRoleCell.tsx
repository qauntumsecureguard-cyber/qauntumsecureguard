"use client";

import { Pen } from "lucide-react"
import { Badge } from "../ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function UserRoleCell({ userId, userRole }: { userId: string, userRole: "admin" | "user" }) {
  const router = useRouter();

  const handleChangeRole = async (userId: string, role: "admin" | "user") => {
    authClient.admin.setRole(
      { userId, role },
      {
        onError(context) {
          toast.error(context.error.message || "An error occurred. Please try again.");
        },
        onSuccess() {
          toast.success("User role updated successfully.");
          router.refresh();
        }
      }
    );
  }

  return (
    <div className="flex justify-start items-center gap-2">
      <Badge variant={userRole === "admin" ? "default" : "secondary"}>
        {userRole === "admin" ? "Admin" : "User"}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Pen size={15} className="cursor-pointer" />

        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={userRole === "admin"}
            onClick={() => handleChangeRole(userId, "admin")}
          >
            Admin
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={userRole === "user"}
            onClick={() => handleChangeRole(userId, "user")}
          >
            User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserRoleCell