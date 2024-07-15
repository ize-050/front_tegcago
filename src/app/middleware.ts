import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/profile', '/dashboard']; // Add your protected paths here

export function middleware(request: NextRequest) {
  const { pathname, cookies }:any = request.nextUrl;

  // Check if the path is protected and the user is not authenticated
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const sessionToken = cookies.get('next-auth.session-token');

  if (!sessionToken && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url)); // Redirect to login
  }
  

  // If the path is not protected or the user is authenticated, proceed
  return NextResponse.next();
}

export const config = {
    matcher: [
      '/profile',
      '/dashboard',
      // Add other protected paths
    ],
  };