import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const ROLE_REFRESH_MS = 5 * 60 * 1000;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const trimmedEmail = (credentials.email as string).trim();
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email: trimmedEmail },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.roleCheckedAt = Date.now();
        return token;
      }

      if (!token.id) {
        return token;
      }

      const checkedAt = typeof token.roleCheckedAt === "number" ? token.roleCheckedAt : 0;
      if (Date.now() - checkedAt < ROLE_REFRESH_MS) {
        return token;
      }

      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });

        if (!dbUser) {
          return { ...token, id: undefined, role: undefined, roleCheckedAt: Date.now() };
        }

        token.role = dbUser.role;
        token.roleCheckedAt = Date.now();
      } catch {
        // Do not extend the grace window on DB errors — retry on next request
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "";
      }
      return session;
    },
  },
  trustHost: true,
});
