import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware function to protext specified routes from unauthorized access.
 * Ensures that only authenticated users can access `/visualize` and `/optimize` endpoints.
 * 
 * @param {Request} req - Incoming request object. 
 * @returns {Promise<NextResponse>} - A redirect to `/login` if unauthenticated; otherwise,
 * continues the request
 */
export default async function middleware(req: NextRequest): Promise<NextResponse> {

    // Retrieve the session token from the request
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Define the protected routes
    const protectedRoutes: string[] = ['/visualize', '/optimize'];

    // If the user is not authenticated and is trying to access a protected route, redirect to /login
    if (protectedRoutes.includes(req.nextUrl.pathname) && !session) {
        console.log('Unauthorized access detected. Redirecting to /login');

        // Add query parameters to login to pass unauthorized access attempts to the frontend
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('error', 'unauthorized');

        return NextResponse.redirect(new URL(loginUrl));
    }
    
    // Continue processing the request if authentication is valid
    return NextResponse.next();
}

/** 
 * Middleware configuration to apply protection only to specific routes.
 * This ensures that other routes remain publicly accessible.
 */
export const config = {
    matcher: ['/visualize', '/optimize'], // Protects only these pages
};