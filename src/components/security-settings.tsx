"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { User } from "better-auth"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

function SecuritySettings({ user }: { user: User }) {
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [emailData, setEmailData] = useState({ current: user.email, new: "" })
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  const router = useRouter();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords((prev) => ({ ...prev, [name]: value }))

    if (name === "new") {
      let strength = 0
      if (value.length >= 8) strength++
      if (/[A-Z]/.test(value)) strength++
      if (/[0-9]/.test(value)) strength++
      if (/[^A-Za-z0-9]/.test(value)) strength++
      setPasswordStrength(strength)
    }
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-destructive"
    if (passwordStrength === 2) return "bg-yellow-500"
    if (passwordStrength === 3) return "bg-primary"
    return "bg-accent"
  }

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "Weak"
    if (passwordStrength === 2) return "Fair"
    if (passwordStrength === 3) return "Good"
    return "Strong"
  }

  const passwordsHaveSmallLength = passwords.current.length < 8 || passwords.new.length < 8 || passwords.confirm.length < 8

  const handleUpdatePassword = async () => {
    setUpdatingPassword(true)

    authClient.changePassword({
      newPassword: passwords.new,
      currentPassword: passwords.current,
      revokeOtherSessions: true
    }, {
      onError: (context) => {
        toast.error(context.error.message)
      },
      onSuccess: () => {
        toast.success("Password changed sucessfully.")
        router.refresh();
      },
    }).finally(() => {
      setUpdatingPassword(false)
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Security Settings</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your account security and authentication</p>
      </div>

      <Tabs defaultValue="password" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-inherit border border-border text-xs sm:text-sm">
          <TabsTrigger value="password">Change Password</TabsTrigger>
          <TabsTrigger value="email">Change Email</TabsTrigger>
        </TabsList>

        {/* Change Password Tab */}
        <TabsContent
          value="password"
          className="space-y-4 mt-6 bg-inherit rounded-lg p-4 sm:p-6 border border-border"
        >
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm text-foreground">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                name="current"
                type={showPasswords.current ? "text" : "password"}
                value={passwords.current}
                onChange={handlePasswordChange}
                disabled={updatingPassword}
                placeholder="Enter your current password"
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground pr-10 text-sm"
              />
              <button
                onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm text-foreground">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                name="new"
                type={showPasswords.new ? "text" : "password"}
                value={passwords.new}
                onChange={handlePasswordChange}
                disabled={updatingPassword}
                placeholder="Enter your new password"
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground pr-10 text-sm"
              />
              <button
                onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {passwords.new && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()} transition-all`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{getStrengthText()}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use at least 8 characters with uppercase, numbers, and symbols
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm text-foreground">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                name="confirm"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwords.confirm}
                disabled={updatingPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground pr-10 text-sm"
              />
              <button
                onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwords.confirm && passwords.new === passwords.confirm && (
              <p className="text-xs text-accent flex items-center gap-1">
                <Check className="h-3 w-3" /> Passwords match
              </p>
            )}
            {passwords.confirm && passwords.new !== passwords.confirm && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <X className="h-3 w-3" /> Passwords do not match
              </p>
            )}
          </div>

          <pre className="text-xs text-gray-600">
            {passwordsHaveSmallLength
              ? "All field must be at least 8 characters."
              : null
            }
          </pre>
          <pre className="text-xs text-red-600">
            {!passwordsHaveSmallLength && passwords.current === passwords.new
              ? "Current password and new password cannot be the same."
              : null
            }
          </pre>
          <Button
            className="w-full mt-4 text-sm sm:text-base bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={
              (passwords.new !== passwords.confirm) || !passwords.confirm || !passwords.current || !passwords.new || (passwords.current === passwords.new) || passwordsHaveSmallLength || updatingPassword
            }
            onClick={handleUpdatePassword}
          >
            {updatingPassword ? "Updating Password..." : "Update Password"}
          </Button>
        </TabsContent>

        {/* Change Email Tab */}
        <TabsContent value="email" className="space-y-4 mt-6 bg-inherit rounded-lg p-4 sm:p-6 border border-border">
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Current Email</Label>
            <Input value={emailData.current} disabled className="bg-muted/50 border-border text-foreground text-sm" />
          </div>

          {!showEmailForm ? (
            <Button
              onClick={() => setShowEmailForm(true)}
              variant="outline"
              className="w-full text-sm sm:text-base border-primary text-primary hover:bg-primary/10"
            >
              Change Email Address
            </Button>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="new-email" className="text-sm text-foreground">
                  New Email Address
                </Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="Enter your new email"
                  value={emailData.new}
                  onChange={(e) => setEmailData((prev) => ({ ...prev, new: e.target.value }))}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground">
                A verification link will be sent to your new email address
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="flex-1 text-sm sm:text-base bg-primary text-primary-foreground hover:bg-primary/90">
                  Send Verification Link
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEmailForm(false)}
                  className="flex-1 text-sm sm:text-base hover:bg-background"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SecuritySettings