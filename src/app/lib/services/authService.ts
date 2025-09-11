import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginAction } from ".";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user && user.accessToken) {
        token.accessToken = user.accessToken;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        user: {
          id: token.sub,
          name: token.name,
          email: token.email,
          role: token.role,
          status: token.status,
        },
      };
    },
    async signIn({ user }) {
      if (!user) return false;
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
    signOut: "/auth/signin",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const userResponse = await loginAction({
            email: credentials.email,
            password: credentials.password,
          });

          if (userResponse) {
            const { token, user } = userResponse ?? {};
            return {
              id: user.id ?? "",
              accessToken: token,
              name: user.name ?? "",
              email: user.email ?? "",
              role: user.role ?? "",
              status: user.status ?? "",
            };
          }
          return null;
        } catch  {
           return null;
        }
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
