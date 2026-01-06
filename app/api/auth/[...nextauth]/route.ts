/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "firebase-google",
      name: "Firebase Google",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
        image: { label: "Image", type: "text" },
        role: { label: "Role", type: "text" },
        backendData: { label: "Backend Data", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) {
          return null;
        }

        try {
          // Backend data is already verified, just return user object
          const backendData = credentials.backendData
            ? JSON.parse(credentials.backendData)
            : null;

          return {
            id: credentials.email || "",
            email: credentials.email || "",
            name: credentials.name || "",
            image: credentials.image || "",
            role: credentials.role || "CANDIDATE",
            backendData: backendData,
            idToken: credentials.idToken,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // For Firebase credentials provider, user is already authorized
      if (user && (user as any).idToken) {
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      // Initial sign in - persist user data
      if (user) {
        token.idToken = (user as any).idToken;
        token.backendData = (user as any).backendData;
        token.role = (user as any).role || "CANDIDATE";
        token.email = user.email || "";
        token.name = user.name || "";

        // Store backend token in token if available
        if ((user as any).backendData?.token) {
          token.backendToken = (user as any).backendData.token;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token.backendData) {
        session.backendData = token.backendData;
        session.role = token.role as string;
      }

      // Set user data from token
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/authentication",
    error: "/authentication", // Error page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
