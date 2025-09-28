// middleware.js
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  // ✅ Make these routes public
  if (
    req.nextUrl.pathname === "/" ||
    req.nextUrl.pathname.startsWith("/vision") ||
    req.nextUrl.pathname.startsWith("/all-products")
  ) {
    return; // allow public access
  }

  // 🔒 Everything else requires authentication
  const { userId } = await auth();
  if (!userId) {
    // Redirect unauthenticated users to sign-in page
    return Response.redirect(new URL("/sign-in", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
