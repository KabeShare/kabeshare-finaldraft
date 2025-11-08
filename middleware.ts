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
  // Protect specific routes only - require authentication
  if (isProtectedRoute(req)) {
    const authObj = await auth();
    if (!authObj.userId) {
      const { NextResponse } = await import('next/server');
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }
  // All other routes (including public routes) are accessible without authentication
});

export const config = {
  matcher: [
    // Match everything except static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)', // API routes
  ],
};
