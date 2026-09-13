import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins"
import { auth } from "./auth"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient()
  ]
})