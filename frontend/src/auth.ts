import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: "demo",
      name: "Demo Candidate",
      credentials: {},
      async authorize() {
        return {
          id: "demo-candidate-uuid-1",
          name: "Mukesh Singh",
          email: "mukesh@interviewos.dev",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        };
      },
    }),
    Google({
      clientId: googleClientId || "pending-google-client-id",
      clientSecret: googleClientSecret || "pending-google-client-secret",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.sub = user.id || token.sub;
        token.name = user.name || token.name;
        token.email = user.email || token.email;
        token.picture = user.image || token.picture;
      }
      if (account && profile) {
        token.sub = profile.sub || token.sub;
        token.name = profile.name || token.name;
        token.email = profile.email || token.email;
        token.picture = profile.picture || token.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.sub as string) || session.user.id;
        session.user.name = token.name || session.user.name;
        session.user.email = token.email || session.user.email;
        session.user.image = (token.picture as string) || session.user.image;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || "interviewos-dev-auth-secret-change-in-production-min-32-chars",
});
