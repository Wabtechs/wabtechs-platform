import { AppError, ErrorCode } from "@/lib/errors";

interface RateLimitOptions {
  windowMs?: number;
  max?: number;
}

interface RateLimitResult {
  remaining: number;
  reset: number;
}

interface RedisClient {
  ping(): Promise<string>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  ttl(key: string): Promise<number>;
  del(...keys: string[]): Promise<number>;
}

let redisChecked = false;
let redisClient: RedisClient | null = null;

interface MemoryEntry {
  count: number;
  expiresAt: number;
}

const memoryStore = new Map<string, MemoryEntry>();

export async function getRedisClient(): Promise<RedisClient | null> {
  if (redisChecked) return redisClient;
  redisChecked = true;

  try {
    const { default: Redis } = await import("ioredis");
    const client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      connectTimeout: 2000,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
      enableOfflineQueue: false,
    });
    client.on("error", () => {});
    await client.ping();
    redisClient = client;
    console.log("✓ Redis connected");
  } catch (error) {
    console.warn("⚠️ Redis unavailable, falling back to memory store:", error);
    redisClient = null;
  }

  return redisClient;
}

export function getClientIp(req: Request): string {
  const xff = req.headers?.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  const realIp = req.headers?.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export async function rateLimit(
  key: string,
  { windowMs = 60_000, max = 20 }: RateLimitOptions = {},
): Promise<RateLimitResult> {
  const redis = await getRedisClient();
  const now = Date.now();
  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));
  const redisKey = `ratelimit:${key}`;

  if (redis) {
    try {
      const count = await redis.incr(redisKey);
      if (count === 1) {
        await redis.expire(redisKey, windowSeconds);
      }
      const ttl = await redis.ttl(redisKey);
      if (count > max) {
        const retryAfter = Math.max(1, ttl);
        throw new AppError("Trop de requêtes", 429, ErrorCode.TOO_MANY_REQUESTS, {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.floor(now / 1000) + ttl),
        });
      }
      return {
        remaining: Math.max(0, max - count),
        reset: Math.floor(now / 1000) + windowSeconds,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("Redis rate limit error:", error);
    }
  }

  const entry = memoryStore.get(key);
  if (!entry || entry.expiresAt <= now) {
    memoryStore.set(key, { count: 1, expiresAt: now + windowMs });
    return { remaining: Math.max(0, max - 1), reset: now + windowMs };
  }

  entry.count += 1;
  if (entry.count > max) {
    const retryAfter = Math.max(1, Math.ceil((entry.expiresAt - now) / 1000));
    throw new AppError("Trop de requêtes", 429, ErrorCode.TOO_MANY_REQUESTS, {
      "Retry-After": String(retryAfter),
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(Math.floor(entry.expiresAt / 1000)),
    });
  }

  return { remaining: Math.max(0, max - entry.count), reset: entry.expiresAt };
}

export async function resetRateLimit(key: string) {
  const redis = await getRedisClient();
  if (redis) {
    await redis.del(`ratelimit:${key}`);
  }
  memoryStore.delete(key);
}
