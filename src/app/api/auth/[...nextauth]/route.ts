import NextAuth, { DefaultSession, Account, User } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
// Update import paths
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

// Extend the session type to ensure user is defined
declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
    };
  }
}

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',  // Change this to root since that's where your login page is
    error: '/?error=Authentication%20Failed',  // Update error path to match
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async signIn({ user, account }: { user: User; account: Account | null }) {
      if (account?.provider === 'github') {
        try {
          const existingUser = await db.select().from(users).where(eq(users.github_id, user.id));
          
          if (existingUser.length === 0) {
            await db.insert(users).values({
              github_id: user.id,
              name: user.name || 'Unknown',
              last_login: new Date()
            });
          } else {
            await db.update(users)
              .set({ last_login: new Date() })
              .where(eq(users.github_id, user.id));
          }
        } catch (error) {
          console.error('Database error:', error);
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + '/visualize'
    }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Remove the duplicate export default NextAuth(authOptions)
