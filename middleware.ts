import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the paths that require authentication
const protectedPaths = ['/dashboard', '/chat', '/library', '/youtube', '/sheets'];

export function middleware(request: NextRequest) {
  // Check if the requested path is protected
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected) {
    // Get the authentication token from cookies
    const token = request.cookies.get('sb-access-token')?.value;

    // If no token is found, redirect to the login page
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Optionally, verify the token here (e.g., check expiration, validity)
    // If the token is invalid, you can also redirect to the login page
  }

  // If the request is not for a protected path or the user is authenticated, continue
  return NextResponse.next();
}

// Specify the paths that the middleware should run on
export const config = {
  matcher: ['/dashboard', '/chat', '/library' , '/youtube', '/sheets'],
};
