import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// ══════════════════════════════════════════════════
// 🔑 COMPTE DÉMO — fonctionne SANS base de données
// Email:    demo@ecotrans.com
// Password: Demo1234
// ══════════════════════════════════════════════════
const DEMO_USER = {
  id: "demo-user-001",
  email: "demo@ecotrans.com",
  password: "Demo1234",
  firstName: "Jean",
  lastName: "Kamga",
  country: "CAMEROON" as const,
  role: "USER" as const,
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        // ── 1. Vérifier le compte démo d'abord ──
        if (
          credentials.email === DEMO_USER.email &&
          credentials.password === DEMO_USER.password
        ) {
          return {
            id: DEMO_USER.id,
            email: DEMO_USER.email,
            name: `${DEMO_USER.firstName} ${DEMO_USER.lastName}`,
            firstName: DEMO_USER.firstName,
            lastName: DEMO_USER.lastName,
            country: DEMO_USER.country,
            role: DEMO_USER.role,
          };
        }

        // ── 2. Sinon, vérifier dans la BD (quand elle est connectée) ──
        try {
          const prisma = (await import("@/lib/prisma")).default;
          const bcrypt = (await import("bcryptjs")).default;

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("Aucun compte trouvé avec cet email");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error("Mot de passe incorrect");
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            country: user.country,
            role: user.role,
          };
        } catch (error: any) {
          // Si la BD n'est pas connectée, on le signale clairement
          if (
            error?.message?.includes("connect") ||
            error?.message?.includes("ECONNREFUSED") ||
            error?.message?.includes("P1001") ||
            error?.code === "P1001"
          ) {
            throw new Error(
              "Base de données non connectée. Utilisez le compte démo : demo@ecotrans.com / Demo1234"
            );
          }
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.country = (user as any).country;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        (session.user as any).country = token.country;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "ecotrans-dev-secret-change-in-production",
};