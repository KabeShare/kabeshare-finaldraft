import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/vision',
  '/all-products',
  '/product/(.*)',
  '/api/product/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sitemap',
  '/sitemap.xml',
]);

export default clerkMiddleware(async (auth, req) => {
  // Check if we have valid Clerk configuration
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasValidClerkKey =
    publishableKey &&
    publishableKey !==
      'pk_test_ZGV2LWNsZXJrLWZha2Uta2V5LWZvci1kZXZlbG9wbWVudA' &&
    (publishableKey.startsWith('pk_test_') ||
      publishableKey.startsWith('pk_live_'));

  // If no valid Clerk key, allow all access (development mode)
  if (!hasValidClerkKey) {
    console.log('🔓 Middleware: Allowing all access (development mode)');
    return;
  }

  // If route is public, allow access
  if (isPublicRoute(req)) {
    return;
  }

  // For protected routes, require authentication
  const { userId } = await auth();
  if (!userId) {
    const { NextResponse } = await import('next/server');
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
});

export const config = {
  matcher: [
    // Match everything except static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)', // API routes
  ],
};
