import { AppError, ErrorCode } from "@/lib/errors";

interface RateLimitOptions {
  windowMs?: number;
  max?: number;
}

interface Entry {
  count: number;
  reset: number;
}

const store = new Map<string, Entry>();

export function getClientIp(req: Request): string {
  const xff = req.headers?.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  const realIp = req.headers?.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export function rateLimit(
  key: string,
  { windowMs = 60_000, max = 20 }: RateLimitOptions = {},
) {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.reset <= now) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { remaining: max - 1, reset: now + windowMs };
  }

  existing.count++;

  if (existing.count > max) {
    const retryAfter = Math.ceil((existing.reset - now) / 1000);
    throw new AppError("Trop de requêtes", 429, ErrorCode.TOO_MANY_REQUESTS, {
      "Retry-After": String(retryAfter),
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(existing.reset),
    });
  }

  return { remaining: max - existing.count, reset: existing.reset };
}

export function resetRateLimit(key: string) {
  store.delete(key);
}
