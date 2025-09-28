// middleware.ts - Development-friendly version
import { NextResponse } from 'next/server';

// Simple middleware that allows all access in development
export default function middleware(request) {
  // Skip middleware entirely in development or when Clerk is not properly configured
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasValidClerkKey =
    publishableKey &&
    publishableKey !==
      'pk_test_ZGV2LWNsZXJrLWZha2Uta2V5LWZvci1kZXZlbG9wbWVudA' &&
    (publishableKey.startsWith('pk_test_') ||
      publishableKey.startsWith('pk_live_'));

  if (!hasValidClerkKey || process.env.NODE_ENV === 'development') {
    console.log('🔓 Middleware: Allowing all access (development mode)');
    return NextResponse.next();
  }

  // In production with valid keys, you can add authentication logic here
  // For now, allow all access
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match everything except static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)', // API routes
  ],
};
