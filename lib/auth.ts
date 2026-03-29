import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Auth: Missing email or password");
            throw new Error("Missing credentials");
          }
          const user = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (!user) {
            console.error(`Auth: User not found - ${credentials.email}`);
            throw new Error("هذا الحساب غير موجود");
          }
          if (!user.password) {
            console.error(`Auth: No password set for user - ${credentials.email}`);
            throw new Error("هذا الحساب لا يمتلك كلمة مرور مسجلة");
          }
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            console.error(`Auth: Password mismatch for user - ${credentials.email}`);
            throw new Error("كلمة المرور غير صحيحة");
          }

          // EMERGENCY BYPASS FOR DIAGNOSTIC ACCOUNT
          if (user.email === 'mazaacdemy@gmail.com') {
            console.log("Auth: Force SUPER_ADMIN for diagnostic account");
            return { id: user.id, name: user.name, email: user.email, role: "SUPER_ADMIN" };
          }

          console.log(`Auth: Success for user - ${credentials.email} (Role: ${user.role})`);
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        } catch (error: any) {
          console.error("Auth: Global error in authorize:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.profileImage = (user as any).profileImage;
      }
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.profileImage = session.profileImage || token.profileImage;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).profileImage = token.profileImage;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-dev",
};
