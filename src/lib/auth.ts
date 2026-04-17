import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "student@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // For now, we'll use simple demo login
        // TODO: Replace with real database authentication
        if (credentials?.email && credentials?.password) {
          // Demo user - replace with real authentication
          if (credentials.email === "demo@sonopass.com" && credentials.password === "demo123") {
            return {
              id: "1",
              email: credentials.email,
              name: "Demo Student",
            };
          }

          // For development, accept any email/password combination
          return {
            id: Math.random().toString(),
            email: credentials.email,
            name: credentials.email.split('@')[0],
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production',
};
