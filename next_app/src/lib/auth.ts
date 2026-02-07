//lib/auth.ts

import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextAuthOptions } from "next-auth"
import { AdminRole } from "@prisma/client"

type AppRole = "USER" | AdminRole

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        type: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const { email, password, type } = credentials

        try {
          // -------- USER LOGIN --------
          if (type === "user") {
            const user = await prisma.user.findUnique({
              where: { email },
            })

            if (!user) return null

            const valid = await bcrypt.compare(
              password,
              user.password
            )

            if (!valid) return null

            return {
              id: user.id,
              email: user.email,
              role: "USER" as AppRole,
            }
          }

          // -------- ADMIN / MANAGER LOGIN --------
          if (type === "admin") {
            const admin = await prisma.admin.findUnique({
              where: { email },
            })

            if (!admin) return null

            const valid = await bcrypt.compare(
              password,
              admin.password
            )

            if (!valid) return null

            return {
              id: admin.id,
              email: admin.email,
              role: admin.role as AppRole,
            }
          }

          return null
        } catch (err) {
          console.error("Auth error:", err)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role as AppRole
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as AppRole
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
}
