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
    signIn: '/login',
    error: '/?error=Authentication%20Failed',
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
          console.log('GitHub user is:', user);
          console.log('GitHub account is:', account);
          
          // Remove the connection test and directly try the operation
          const existingUser = await db.select()
            .from(users)
            .where(eq(users.github_id, user.id));
          
          if (existingUser.length === 0) {
            // Create new user
            await db.insert(users).values({
              github_id: user.id,
              name: user.name || 'Unknown',
              last_login: new Date()
            });
            console.log('Created new user');
          } else {
            // Update existing user
            await db.update(users)
              .set({ last_login: new Date() })
              .where(eq(users.github_id, user.id));
            console.log('Updated existing user');
          }
          return true;
        } catch (error) {
          console.error('Database operation error:', error);
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log('redirecting to', url)
      console.log('base url is', baseUrl)
      // Always redirect to /visualize after successful login
      return baseUrl + '/visualize'
    }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

