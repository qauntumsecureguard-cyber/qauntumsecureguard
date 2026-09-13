"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { User } from "better-auth"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

const personalInfoSchema = z.object({
  firstName: z.string().min(5, { message: "First name is required" }).max(15, { message: "First name must not exceed 15 characters" }),
  lastName: z.string().min(5, { message: "Last name is required" }).max(15, { message: "Last name must not exceed 15 characters" }),
})

type FormValues = z.infer<typeof personalInfoSchema>

function PersonalInfo({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, lastName] = user.name.split(" ")

  const form = useForm<FormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: firstName || "",
      lastName: lastName || ""
    },
  })

  const handleSave = (values: FormValues) => {
    const previousUserName = user.name, userNewName = `${values.firstName + " " + values.lastName}`;
    if (previousUserName === userNewName) {
      return toast.error("Make a change to your name to save.")
    }

    setIsLoading(true)
    authClient.updateUser({
      name: userNewName
    }, {
      onError: (ctx) => {
        toast.error(ctx.error.message)
      },
      onSuccess: () => {
        setIsEditing(false)
        toast.success("Name updated successfully!")
      },
    }).finally(() => {
      setIsLoading(false)
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSave)}
        className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm px-6 border-border"
      >
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Personal Information</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Update your profile details</p>
            </div>

            {isEditing
              ? (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    setIsEditing(true)
                  }}
                  type="button"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Edit
                </Button>
              )
            }
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing || isLoading}
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing || isLoading}
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form >
  )
}

export default PersonalInfo