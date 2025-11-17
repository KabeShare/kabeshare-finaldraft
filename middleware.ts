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
  '/sitemap.xml',
  '/robots.txt',
  '/favicon.ico',
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

  // Detect common crawlers/bots to ensure they can reach public pages
  const ua = req.headers.get('user-agent') || '';
  const isBot =
    /bot|crawler|spider|crawling|google|bing|baidu|yandex|duckduck|yahoo|sogou|exabot|facebookexternalhit|facebot|slurp/i.test(
      ua
    );

  // Helper to create a pass-through response with proper robots headers
  const allow = (indexFollow = 'index, follow') => {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', indexFollow);
    return res;
  };

  // Explicitly allow public routes - bypass all Clerk checks
  if (isPublicRoute(req)) {
    console.log(`✅ Public route allowed: ${pathname}`);
    return allow('index, follow');
  }

  // For protected routes, check authentication
  if (isProtectedRoute(req)) {
    console.log(`🔒 Protected route - checking auth: ${pathname}`);
    const { userId } = await auth();
    if (!userId && !isBot) {
      console.log(`❌ No auth - redirecting to sign-in`);
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', pathname);
      return NextResponse.redirect(signInUrl);
    }
    // Authenticated users (or bots on protected pages) should not be indexed
    console.log(`✅ Authenticated or bot on protected - allow but noindex`);
    return allow('noindex, nofollow');
  }

  // Default: allow access and allow indexing
  console.log(`✅ Default - allowing access: ${pathname}`);
  return allow('index, follow');
});

export const config = {
  matcher: [
    // Match everything except static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)', // API routes
  ],
};
