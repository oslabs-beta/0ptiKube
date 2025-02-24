//NextAuth is the main authentication handler.
//GithubProvider is the authentication provider for GitHub OAuth.
import NextAuth, { DefaultSession, Account, User } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

// Database imports
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Type imports
//Session and JWT are TypeScript types for session and token handling.
import type { Session, SessionStrategy } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

// Extend the session type to ensure user is defined
declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      picture: string | null;
    };
  }
}

const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  //Defines a secret key for encryption (recommended for session security).
  //Customizes authentication-related pages:
  ///login is used as the sign-in page.
  //If authentication fails, it redirects to the homepage (/) with an error message in the URL.

  secret: process.env.NEXTAUTH_SECRET,
  // Added session expiration logic - 2025-02-20
  session: {
    strategy: 'jwt' as SessionStrategy, // Corrected TS Type
    maxAge: 30 * 24 * 60 * 60, // 30 days (60 seconds * 60 minutes * 24 hours * 30 days)
  },
  pages: {
    signIn: '/login',
    error: '/?error=Authentication%20Failed',
  },
  //Ensures that the user's ID is available in session.user
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },

    //This checks if the user logged in using GitHub.
    //they did, the code runs database queries to check if they are a new or existing user.
    //If the user is new, it creates a new entry in the database.
    //If the user exists, it updates their last login timestamp
    async signIn({ user, account }: { user: User; account: Account | null }) {
      if (account?.provider === 'github') {
        try {         
          // Remove the connection test and directly try the operation
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.github_id, user.id));

          if (existingUser.length === 0) {
            // Create new user
            await db.insert(users).values({
              github_id: user.id,
              name: user.name || 'Unknown',
              last_login: new Date(),
            });
          } else {
            // Update existing user
            await db
              .update(users)
              .set({ last_login: new Date() })
              .where(eq(users.github_id, user.id));
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
      // If the URL is pointing to logout, redirect to the /login endpoint
      if (url === '/login') {
        return baseUrl + '/login';
      }
      // Otherwise, redirect to the /visualize endpoint
      return baseUrl + '/visualize';
    }
  },
};

//This initializes NextAuth.js authentication handler with the given configuration
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
