"use client"

import { toast } from 'sonner'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { AlertTriangle, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'

type ActionsCellProps = {
  userId: string,
  userBanned: boolean | null | undefined
}

function ActionsCell({ userId, userBanned }: ActionsCellProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { refetch } = authClient.useSession()
  const router = useRouter()

  function handleImpersonateUser(userId: string) {
    authClient.admin.impersonateUser(
      { userId },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to impersonate")
        },
        onSuccess: () => {
          refetch()
          router.push("/dashboard")
        },
      }
    )
  }

  function handleBanUser(userId: string) {
    authClient.admin.banUser(
      { userId },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to ban user")
        },
        onSuccess: () => {
          toast.success("User banned")
          router.refresh()
        },
      }
    )
  }

  function handleUnbanUser(userId: string) {
    authClient.admin.unbanUser(
      { userId },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to unban user")
        },
        onSuccess: () => {
          toast.success("User unbanned")
          router.refresh()
        },
      }
    )
  }

  function handleRevokeSessions(userId: string) {
    authClient.admin.revokeUserSessions(
      { userId },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to revoke user sessions")
        },
        onSuccess: () => {
          toast.success("User sessions revoked")
        },
      }
    )
  }

  function handleDeleteUser(userId: string) {
    authClient.admin.removeUser(
      { userId },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to delete user")
        },
        onSuccess: () => {
          toast.success("User deleted")
          router.refresh()
        },
      }
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="p-0 w-8 h-8">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuItem
            className="cursor-pointer focus:bg-black/30"
            onClick={() => handleRevokeSessions(userId)}
          >
            Revoke User Sessions
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer focus:bg-black/30"
            onClick={() => handleImpersonateUser(userId)}
          >
            Impersonate User
          </DropdownMenuItem>
          {userBanned ? (
            <DropdownMenuItem
              className="cursor-pointer focus:bg-black/30"
              onClick={() => handleUnbanUser(userId)}
            >
              Unban User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => handleBanUser(userId)}
              className="cursor-pointer focus:bg-black/30"
            >
              Ban User
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="cursor-pointer"
          >
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <AlertDialogTitle className="text-xl">Delete User</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base space-y-2">
              <p>Are you sure you want to delete this user? This action cannot be undone.</p>
              <p className="font-semibold text-destructive">
                All data, sessions, and settings will be permanently removed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteUser(userId)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ActionsCell