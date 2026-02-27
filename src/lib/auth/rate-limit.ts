// ============================================
// ProFind Guyana — In-Memory Rate Limiter
// Simple sliding-window rate limiter for API routes.
// For production at scale, replace with Redis/Upstash.
// ============================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Max requests allowed in the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given key (usually IP or user ID).
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // New window
    store.set(key, {
      count: 1,
      resetAt: now + config.windowSeconds * 1000,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowSeconds * 1000,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Extract a rate-limit key from the request.
 * Uses X-Forwarded-For, X-Real-IP, or falls back to "anonymous".
 */
export function getRateLimitKey(request: Request, prefix: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "anonymous";
  return `${prefix}:${ip}`;
}

// Pre-configured limiters for common use cases
export const RATE_LIMITS = {
  /** Public form submissions: 10 per 5 minutes */
  publicSubmit: { maxRequests: 10, windowSeconds: 300 } as RateLimitConfig,
  /** Review submissions: 5 per 10 minutes */
  review: { maxRequests: 5, windowSeconds: 600 } as RateLimitConfig,
  /** Auth attempts: 10 per 15 minutes */
  auth: { maxRequests: 10, windowSeconds: 900 } as RateLimitConfig,
  /** File uploads: 20 per 10 minutes */
  upload: { maxRequests: 20, windowSeconds: 600 } as RateLimitConfig,
  /** Analytics/logging: 60 per minute */
  analytics: { maxRequests: 60, windowSeconds: 60 } as RateLimitConfig,
  /** Search: 30 per minute */
  search: { maxRequests: 30, windowSeconds: 60 } as RateLimitConfig,
} as const;
