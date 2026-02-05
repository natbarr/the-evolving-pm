import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Middleware Unit Tests
 *
 * These tests validate the middleware functions in isolation.
 * Since the middleware uses module-level state and NextRequest/NextResponse,
 * we test the logic functions separately and mock the Next.js primitives.
 */

// Mock next/server module
vi.mock("next/server", () => ({
  NextResponse: {
    next: vi.fn(() => ({
      headers: new Map(),
    })),
    json: vi.fn((body, init) => ({
      body,
      status: init?.status,
      headers: new Map(Object.entries(init?.headers || {})),
    })),
  },
}));

// We'll test the helper functions by extracting and reimplementing their logic
// since they're not exported from middleware.ts

describe("Middleware Logic", () => {
  describe("getClientIp logic", () => {
    // Reimplementation of getClientIp for testing
    function getClientIp(headers: Record<string, string | null>): string {
      const forwardedFor = headers["x-forwarded-for"];
      if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
      }

      const realIp = headers["x-real-ip"];
      if (realIp) {
        return realIp;
      }

      return headers["x-client-ip"] || "unknown";
    }

    it("extracts IP from x-forwarded-for header", () => {
      expect(getClientIp({ "x-forwarded-for": "192.168.1.1" })).toBe(
        "192.168.1.1"
      );
    });

    it("extracts first IP from comma-separated x-forwarded-for", () => {
      expect(
        getClientIp({ "x-forwarded-for": "192.168.1.1, 10.0.0.1, 172.16.0.1" })
      ).toBe("192.168.1.1");
    });

    it("trims whitespace from x-forwarded-for IP", () => {
      expect(getClientIp({ "x-forwarded-for": "  192.168.1.1  " })).toBe(
        "192.168.1.1"
      );
    });

    it("falls back to x-real-ip when x-forwarded-for is missing", () => {
      expect(
        getClientIp({ "x-forwarded-for": null, "x-real-ip": "10.0.0.1" })
      ).toBe("10.0.0.1");
    });

    it("falls back to x-client-ip when other headers are missing", () => {
      expect(
        getClientIp({
          "x-forwarded-for": null,
          "x-real-ip": null,
          "x-client-ip": "172.16.0.1",
        })
      ).toBe("172.16.0.1");
    });

    it('returns "unknown" when no IP headers are present', () => {
      expect(
        getClientIp({
          "x-forwarded-for": null,
          "x-real-ip": null,
          "x-client-ip": null,
        })
      ).toBe("unknown");
    });

    it("prioritizes x-forwarded-for over other headers", () => {
      expect(
        getClientIp({
          "x-forwarded-for": "192.168.1.1",
          "x-real-ip": "10.0.0.1",
          "x-client-ip": "172.16.0.1",
        })
      ).toBe("192.168.1.1");
    });
  });

  describe("Rate Limiting Logic", () => {
    const RATE_LIMIT_WINDOW_MS = 60 * 1000;
    const RATE_LIMIT_MAX_REQUESTS = 5;

    // Reimplementation of rate limiting logic for testing
    let rateLimitStore: Map<string, { count: number; resetTime: number }>;

    beforeEach(() => {
      rateLimitStore = new Map();
    });

    function isRateLimited(ip: string): boolean {
      const now = Date.now();
      const record = rateLimitStore.get(ip);

      if (!record || now > record.resetTime) {
        rateLimitStore.set(ip, {
          count: 1,
          resetTime: now + RATE_LIMIT_WINDOW_MS,
        });
        return false;
      }

      if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
        return true;
      }

      record.count++;
      return false;
    }

    function getRateLimitHeaders(
      ip: string
    ): Record<string, string> {
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

    function cleanupRateLimitStore(): void {
      const now = Date.now();
      const keysToDelete: string[] = [];

      rateLimitStore.forEach((record, ip) => {
        if (now > record.resetTime) {
          keysToDelete.push(ip);
        }
      });

      keysToDelete.forEach((ip) => rateLimitStore.delete(ip));
    }

    describe("isRateLimited", () => {
      it("allows first request from an IP", () => {
        expect(isRateLimited("192.168.1.1")).toBe(false);
      });

      it("allows requests under the limit", () => {
        const ip = "192.168.1.1";
        expect(isRateLimited(ip)).toBe(false); // 1
        expect(isRateLimited(ip)).toBe(false); // 2
        expect(isRateLimited(ip)).toBe(false); // 3
        expect(isRateLimited(ip)).toBe(false); // 4
        expect(isRateLimited(ip)).toBe(false); // 5
      });

      it("blocks requests at the limit", () => {
        const ip = "192.168.1.1";
        // Make 5 requests (the limit)
        for (let i = 0; i < 5; i++) {
          isRateLimited(ip);
        }
        // 6th request should be blocked
        expect(isRateLimited(ip)).toBe(true);
      });

      it("continues blocking after limit is exceeded", () => {
        const ip = "192.168.1.1";
        // Exhaust the limit
        for (let i = 0; i < 5; i++) {
          isRateLimited(ip);
        }
        // Multiple subsequent requests should all be blocked
        expect(isRateLimited(ip)).toBe(true);
        expect(isRateLimited(ip)).toBe(true);
        expect(isRateLimited(ip)).toBe(true);
      });

      it("tracks different IPs independently", () => {
        const ip1 = "192.168.1.1";
        const ip2 = "192.168.1.2";

        // Exhaust limit for ip1
        for (let i = 0; i < 5; i++) {
          isRateLimited(ip1);
        }
        expect(isRateLimited(ip1)).toBe(true);

        // ip2 should still be allowed
        expect(isRateLimited(ip2)).toBe(false);
      });

      it("resets after window expires", () => {
        const ip = "192.168.1.1";
        vi.useFakeTimers();

        // Exhaust limit
        for (let i = 0; i < 5; i++) {
          isRateLimited(ip);
        }
        expect(isRateLimited(ip)).toBe(true);

        // Advance time past the window
        vi.advanceTimersByTime(RATE_LIMIT_WINDOW_MS + 1);

        // Should be allowed again
        expect(isRateLimited(ip)).toBe(false);

        vi.useRealTimers();
      });

      it("creates new window after expiry", () => {
        const ip = "192.168.1.1";
        vi.useFakeTimers();

        // Make some requests
        isRateLimited(ip);
        isRateLimited(ip);

        // Advance past window
        vi.advanceTimersByTime(RATE_LIMIT_WINDOW_MS + 1);

        // First request in new window
        expect(isRateLimited(ip)).toBe(false);

        // Should have full quota again
        expect(isRateLimited(ip)).toBe(false);
        expect(isRateLimited(ip)).toBe(false);
        expect(isRateLimited(ip)).toBe(false);
        expect(isRateLimited(ip)).toBe(false);
        // 6th should be blocked
        expect(isRateLimited(ip)).toBe(true);

        vi.useRealTimers();
      });
    });

    describe("getRateLimitHeaders", () => {
      it("returns full limit for unknown IP", () => {
        const headers = getRateLimitHeaders("unknown-ip");
        expect(headers["X-RateLimit-Limit"]).toBe("5");
        expect(headers["X-RateLimit-Remaining"]).toBe("5");
        expect(headers["X-RateLimit-Reset"]).toBeUndefined();
      });

      it("returns correct remaining count", () => {
        const ip = "192.168.1.1";
        isRateLimited(ip); // 1 request
        isRateLimited(ip); // 2 requests

        const headers = getRateLimitHeaders(ip);
        expect(headers["X-RateLimit-Limit"]).toBe("5");
        expect(headers["X-RateLimit-Remaining"]).toBe("3");
      });

      it("returns zero remaining when exhausted", () => {
        const ip = "192.168.1.1";
        for (let i = 0; i < 5; i++) {
          isRateLimited(ip);
        }

        const headers = getRateLimitHeaders(ip);
        expect(headers["X-RateLimit-Remaining"]).toBe("0");
      });

      it("includes reset time for active records", () => {
        const ip = "192.168.1.1";
        isRateLimited(ip);

        const headers = getRateLimitHeaders(ip);
        expect(headers["X-RateLimit-Reset"]).toBeDefined();
        const resetSeconds = parseInt(headers["X-RateLimit-Reset"]);
        expect(resetSeconds).toBeGreaterThan(0);
        expect(resetSeconds).toBeLessThanOrEqual(60);
      });
    });

    describe("cleanupRateLimitStore", () => {
      it("removes expired entries", () => {
        vi.useFakeTimers();

        // Add an entry
        isRateLimited("192.168.1.1");
        expect(rateLimitStore.size).toBe(1);

        // Advance past window
        vi.advanceTimersByTime(RATE_LIMIT_WINDOW_MS + 1);

        // Cleanup should remove it
        cleanupRateLimitStore();
        expect(rateLimitStore.size).toBe(0);

        vi.useRealTimers();
      });

      it("keeps active entries", () => {
        vi.useFakeTimers();

        isRateLimited("192.168.1.1");
        expect(rateLimitStore.size).toBe(1);

        // Advance less than window
        vi.advanceTimersByTime(RATE_LIMIT_WINDOW_MS / 2);

        // Cleanup should keep it
        cleanupRateLimitStore();
        expect(rateLimitStore.size).toBe(1);

        vi.useRealTimers();
      });

      it("handles mixed expired and active entries", () => {
        vi.useFakeTimers();

        // Add first IP
        isRateLimited("192.168.1.1");

        // Advance past half the window
        vi.advanceTimersByTime(RATE_LIMIT_WINDOW_MS / 2 + 1);

        // Add second IP
        isRateLimited("192.168.1.2");

        // Advance to expire first but not second
        vi.advanceTimersByTime(RATE_LIMIT_WINDOW_MS / 2 + 1);

        expect(rateLimitStore.size).toBe(2);
        cleanupRateLimitStore();

        // First should be removed, second should remain
        expect(rateLimitStore.size).toBe(1);
        expect(rateLimitStore.has("192.168.1.1")).toBe(false);
        expect(rateLimitStore.has("192.168.1.2")).toBe(true);

        vi.useRealTimers();
      });
    });
  });

  describe("CORS Logic", () => {
    const ALLOWED_ORIGINS = [
      "https://theevolvingpm.com",
      "https://www.theevolvingpm.com",
      "http://localhost:4000",
    ];

    function isAllowedOrigin(origin: string | null): boolean {
      return !origin || ALLOWED_ORIGINS.includes(origin);
    }

    it("allows null origin (same-origin requests)", () => {
      expect(isAllowedOrigin(null)).toBe(true);
    });

    it("allows production domain", () => {
      expect(isAllowedOrigin("https://theevolvingpm.com")).toBe(true);
    });

    it("allows www subdomain", () => {
      expect(isAllowedOrigin("https://www.theevolvingpm.com")).toBe(true);
    });

    it("allows localhost development", () => {
      expect(isAllowedOrigin("http://localhost:4000")).toBe(true);
    });

    it("blocks unknown origins", () => {
      expect(isAllowedOrigin("https://malicious-site.com")).toBe(false);
    });

    it("blocks similar but different domains", () => {
      expect(isAllowedOrigin("https://theevolvingpm.com.evil.com")).toBe(false);
      expect(isAllowedOrigin("https://nottheevolvingpm.com")).toBe(false);
    });

    it("blocks http on production domain", () => {
      expect(isAllowedOrigin("http://theevolvingpm.com")).toBe(false);
    });

    it("blocks https on localhost", () => {
      expect(isAllowedOrigin("https://localhost:4000")).toBe(false);
    });
  });

  describe("Path Matching Logic", () => {
    function shouldApplyMiddleware(pathname: string): boolean {
      return pathname.startsWith("/api");
    }

    function shouldRateLimit(pathname: string, method: string): boolean {
      return pathname === "/api/submit" && method === "POST";
    }

    it("applies middleware to API routes", () => {
      expect(shouldApplyMiddleware("/api/submit")).toBe(true);
      expect(shouldApplyMiddleware("/api/ingest")).toBe(true);
      expect(shouldApplyMiddleware("/api/anything")).toBe(true);
    });

    it("does not apply middleware to non-API routes", () => {
      expect(shouldApplyMiddleware("/")).toBe(false);
      expect(shouldApplyMiddleware("/resources")).toBe(false);
      expect(shouldApplyMiddleware("/about")).toBe(false);
      expect(shouldApplyMiddleware("/submit")).toBe(false);
    });

    it("rate limits POST to /api/submit", () => {
      expect(shouldRateLimit("/api/submit", "POST")).toBe(true);
    });

    it("does not rate limit GET to /api/submit", () => {
      expect(shouldRateLimit("/api/submit", "GET")).toBe(false);
    });

    it("does not rate limit other API endpoints", () => {
      expect(shouldRateLimit("/api/ingest", "POST")).toBe(false);
      expect(shouldRateLimit("/api/other", "POST")).toBe(false);
    });
  });
});
