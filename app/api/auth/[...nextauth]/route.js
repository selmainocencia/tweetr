import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const mockUsers = [
  {
    id: "1",
    username: "john",
    password: "password123",
    name: "John Doe",
    email: "john@example.com",
    verified: false,
    role: "user",
    mustChangePassword: false,
  },
  {
    id: "2",
    username: "jane",
    password: "password123",
    name: "Jane Smith",
    email: "jane@example.com",
    verified: false,
    role: "user",
    mustChangePassword: false,
  },
  {
    id: "3",
    username: "admin",
    password: "admin123",
    name: "Admin",
    email: "admin@tweetr.app",
    verified: false,
    role: "admin",
    mustChangePassword: false,
  },
];

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        try {
          const { makeSureDbIsReady } = await import("@/lib/db");
          const { User } = await import("@/models/User");
          await makeSureDbIsReady();
          const user = await User.findOne({ username: credentials.username });
          if (user) {
            const { default: bcrypt } = await import("bcryptjs");
            const valid = await bcrypt.compare(
              credentials.password,
              user.password,
            );
            if (valid) {
              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                username: user.username,
                verified: user.verified,
                role: user.role,
                mustChangePassword: user.mustChangePassword,
              };
            }
            return null;
          }
        } catch {
          // fall through to mock users
        }

        const user = mockUsers.find((u) => u.username === credentials.username);
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            verified: user.verified,
            role: user.role,
            mustChangePassword: user.mustChangePassword,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.verified = user.verified;
        token.role = user.role;
        token.mustChangePassword = user.mustChangePassword;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.verified = token.verified;
        session.user.role = token.role;
        session.user.mustChangePassword = token.mustChangePassword;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
