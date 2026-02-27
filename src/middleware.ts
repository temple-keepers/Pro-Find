import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that require authentication
const PROTECTED_API_PATTERNS = [
  "/api/providers/", // PUT/PATCH on provider routes
  "/api/quotes",
  "/api/jobs",
  "/api/upload",
  "/api/admin/",
];

// Routes that require admin
const ADMIN_PATTERNS = ["/api/admin/", "/admin"];

// Public API routes (no auth needed)
const PUBLIC_API_ROUTES = new Set([
  "/api/providers",      // GET listing
  "/api/reviews",        // POST review (rate-limited instead)
  "/api/suggestions",    // POST suggestion (rate-limited)
  "/api/contact",        // POST analytics
  "/api/search-log",     // POST analytics
  "/api/materials",      // GET materials
  "/api/claim",          // POST claim (rate-limited + auth recommended)
  "/api/quote-requests", // POST from customers (rate-limited)
  "/api/auth/signup",
  "/api/auth/unified-signup",
  "/api/auth/provider-login",
  "/api/auth/admin-check",
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Set security headers on all responses
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)"
  );

  // Skip auth check for public pages and GET requests to public API routes
  if (!pathname.startsWith("/api/") && !ADMIN_PATTERNS.some((p) => pathname.startsWith(p))) {
    return response;
  }

  // Skip auth for public API routes on safe methods
  if (PUBLIC_API_ROUTES.has(pathname) && method === "GET") {
    return response;
  }

  // Skip auth for auth endpoints
  if (pathname.startsWith("/api/auth/")) {
    return response;
  }

  // Skip auth for analytics/public POST endpoints (rate limiting handles abuse)
  if (
    pathname === "/api/contact" ||
    pathname === "/api/search-log" ||
    pathname === "/api/suggestions" ||
    pathname === "/api/reviews" ||
    pathname === "/api/quote-requests" ||
    pathname === "/api/claim"
  ) {
    return response;
  }

  // For protected routes, verify Supabase session exists
  const isProtectedAPI = PROTECTED_API_PATTERNS.some((p) =>
    pathname.startsWith(p)
  );
  const isAdminRoute = ADMIN_PATTERNS.some((p) => pathname.startsWith(p));

  if (isProtectedAPI || isAdminRoute) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }>) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
      // Redirect page routes to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match API routes
    "/api/:path*",
    // Match admin pages
    "/admin/:path*",
    // Match dashboard pages
    "/dashboard/:path*",
    "/shop-dashboard/:path*",
  ],
};
