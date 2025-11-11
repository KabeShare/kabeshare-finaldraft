import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define ALL public routes - these will be completely open to crawlers
const isPublicRoute = createRouteMatcher([
  '/',
  '/vision',
  '/all-products',
  '/product/(.*)',
  '/api/product/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sitemap(.*)',
  '/robots.txt',
]);

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/cart(.*)',
  '/my-orders(.*)',
  '/order-placed(.*)',
  '/add-address(.*)',
  '/user-point(.*)',
  '/seller(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Explicitly allow public routes - bypass all Clerk checks
  if (isPublicRoute(req)) {
    console.log(`✅ Public route allowed: ${pathname}`);
    return NextResponse.next();
  }

  // For protected routes, check authentication
  if (isProtectedRoute(req)) {
    console.log(`🔒 Protected route - checking auth: ${pathname}`);
    const { userId } = await auth();
    if (!userId) {
      console.log(`❌ No auth - redirecting to sign-in`);
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', pathname);
      return NextResponse.redirect(signInUrl);
    }
    console.log(`✅ Authenticated - allowing access`);
  }

  // Default: allow access
  console.log(`✅ Default - allowing access: ${pathname}`);
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match everything except static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)', // API routes
  ],
};
