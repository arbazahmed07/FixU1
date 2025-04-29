import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path starts with /admin
  if (path.startsWith('/admin')) {
    try {
      // Get token from cookies
      const authToken = request.cookies.get('auth-token')?.value;
      
      if (!authToken) {
        // No token, redirect to login
        return NextResponse.redirect(new URL(`/login?from=${path}`, request.url));
      }
      
      // Verify the token
      const payload = await verifyToken(authToken);
      
      // Check if the user is an admin
      if (!payload.isAdmin) {
        // User is not an admin, redirect to home
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // User is an admin, allow access
      return NextResponse.next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL(`/login?from=${path}`, request.url));
    }
  }

  return NextResponse.next();
}

// Configure matching paths for the middleware
export const config = {
  matcher: ['/admin/:path*'],
};