import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://theevolvingpm.com",
  "https://www.theevolvingpm.com",
  // Development: ports 4000-4010
  "http://localhost:4000",
  "http://localhost:4001",
  "http://localhost:4002",
  "http://localhost:4003",
  "http://localhost:4004",
  "http://localhost:4005",
  "http://localhost:4006",
  "http://localhost:4007",
  "http://localhost:4008",
  "http://localhost:4009",
  "http://localhost:4010",
];

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute for submit endpoint

// In-memory store for rate limiting (resets on server restart)
// For production at scale, use Redis or similar
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getClientIp(request: NextRequest): string {
  // Check various headers for the real IP (behind proxies/load balancers)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback (may not be accurate behind proxy)
  return request.headers.get("x-client-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    // First request or window expired - start new window
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  // Increment count
  record.count++;
  return false;
}

function getRateLimitHeaders(ip: string): Record<string, string> {
  const record = rateLimitStore.get(ip);
  const now = Date.now();

  if (!record) {
    return {
      "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
      "X-RateLimit-Remaining": String(RATE_LIMIT_MAX_REQUESTS),
    };
  }

  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - record.count);
  const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

  return {
    "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(resetSeconds),
  };
}

// Clean up old entries periodically (simple garbage collection)
function cleanupRateLimitStore() {
  const now = Date.now();
  const keysToDelete: string[] = [];

  rateLimitStore.forEach((record, ip) => {
    if (now > record.resetTime) {
      keysToDelete.push(ip);
    }
  });

  keysToDelete.forEach((ip) => rateLimitStore.delete(ip));
}

// Run cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");

  // Only apply to API routes
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check if origin is allowed
  const isAllowedOrigin = !origin || ALLOWED_ORIGINS.includes(origin);

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });

    if (isAllowedOrigin && origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");
    response.headers.set("Access-Control-Max-Age", "86400");

    return response;
  }

  // Apply rate limiting only to POST /api/submit
  if (pathname === "/api/submit" && request.method === "POST") {
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      const rateLimitHeaders = getRateLimitHeaders(clientIp);

      return NextResponse.json(
        {
          error: "Too Many Requests",
          message: "You have exceeded the rate limit. Please try again later.",
        },
        {
          status: 429,
          headers: {
            ...rateLimitHeaders,
            "Retry-After": rateLimitHeaders["X-RateLimit-Reset"],
          },
        }
      );
    }
  }

  // Continue to the route handler
  const response = NextResponse.next();

  // Add CORS headers to response
  if (isAllowedOrigin && origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");

  // Add rate limit headers for submit endpoint
  if (pathname === "/api/submit") {
    const clientIp = getClientIp(request);
    const rateLimitHeaders = getRateLimitHeaders(clientIp);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
