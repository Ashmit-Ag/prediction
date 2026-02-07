import { DefaultSession } from "next-auth"
import { AdminRole } from "@prisma/client"

type AppRole = "USER" | AdminRole

declare module "next-auth" {
  interface User {
    id: string
    role: AppRole
  }

  interface Session {
    user: {
      id: string
      role: AppRole
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: AppRole
  }
}
