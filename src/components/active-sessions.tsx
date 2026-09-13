"use client"

import type React from "react"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Monitor, Trash2, Tablet, AlertTriangle } from "lucide-react"
import { Session } from "better-auth"
import { UAParser } from "ua-parser-js"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function ActiveSessions({ sessions, currentSession }: { sessions: Session[], currentSession: Session }) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleRevokeSession = async (token: string) => {
    await authClient.revokeSession({
      token
    }, {
      onError: (e) => {
        toast.error(e.error.message);
      },
      onSuccess: () => {
        toast.success("Session revoked successfully.")
        router.refresh()
      }
    })
  }

  const handleRevokeAllOtherSessions = async () => {
    await authClient.revokeOtherSessions(undefined, {
      onError: (e) => {
        toast.error(e.error.message)
      },
      onSuccess: () => {
        toast.success("All other sessions logged out successfully.")
        router.refresh()
      }
    });
  }

  const handleDeleteAccount = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    setIsDeleting(true)
    authClient.deleteUser({
      password: "",
      callbackURL: "/"
    }, {
      onError: (ctx) => {
        toast.error(ctx.error.message || "Failed to delete account")
      },
      onSuccess: () => {
        toast.success("We've sent you a confirmation email", {
          description: "Follow the link to confirm, or simply ignore it to cancel"
        })
        setIsDeleting(false)
        localStorage.setItem("goodbye", "true")
      }
    }).finally(() => {
      setShowDeleteDialog(false)
      setIsDeleting(false)
    })
  }

  const getDeviceIcon = (deviceType: string | undefined) => {
    switch (deviceType) {
      case "mobile":
        return <Smartphone className="h-5 w-5" />
      case "tablet":
        return <Tablet className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  const formatDate = (date: Date) => {
    return Intl.DateTimeFormat(undefined, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(date)
  }

  return (
    <>
      <Card className="border-border bg-inherit">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Active Sessions</CardTitle>
          <CardDescription className="text-sm sm:text-base">Manage your login sessions</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {sessions.sort((a, b) => {
            if (a.token === currentSession.token) return -1
            if (b.token === currentSession.token) return 1
            return 0
          }).map((sessionInfo) => {
            const session = UAParser(sessionInfo.userAgent!)

            return (
              <div
                key={session.toString + "-" + Math.random()}
                className="flex flex-row items-start justify-between gap-3 p-3 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="text-primary mt-1 shrink-0">
                    {getDeviceIcon(session.device.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-row items-center gap-2">
                      <p className="font-medium text-sm truncate">{session.os.name}</p>
                      {sessionInfo.token === currentSession.token && (
                        <Badge className="text-xs w-fit bg-primary text-primary-foreground">Current</Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-1">{session.browser.name}</p>
                    <p className="text-xs text-muted-foreground">Last active: {formatDate(sessionInfo.updatedAt)}</p>
                    <p className="text-xs text-muted-foreground">Created at: {formatDate(sessionInfo.createdAt)}</p>
                    <p className="text-xs text-muted-foreground">Expires at: {formatDate(sessionInfo.expiresAt)}</p>
                  </div>
                </div>

                {sessionInfo.token !== currentSession.token && (
                  <button
                    onClick={() => handleRevokeSession(sessionInfo.token)}
                    className="ml-0 sm:ml-2 p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            )
          })}

          <Button
            className="w-full text-sm sm:text-base bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleRevokeAllOtherSessions}
            disabled={sessions?.length < 2}
          >
            Logout All Other Sessions
          </Button>

          <Button
            className="w-full text-sm sm:text-base bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <AlertDialogTitle className="text-xl">Delete Account</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base space-y-2">
              <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              <p className="font-semibold text-destructive">
                All your data, sessions, and settings will be permanently removed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ActiveSessions