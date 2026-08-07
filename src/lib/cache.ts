import { AppError, ErrorCode } from "@/lib/errors";

interface CacheEntry {
  value: string;
  expiresAt: number;
}

let redisChecked = false;
let redisClient: Redis | null = null;

type Redis = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode: string, ttl: number): Promise<string | "OK">;
  del(...keys: string[]): Promise<number>;
  keys(pattern: string): Promise<string[]>;
};

const memoryStore = new Map<string, CacheEntry>();

export const ROADMAP_CACHE_TTL = 10; // seconds
export const ROADMAP_AGGREGATE_TTL = 15; // seconds
export const CACHE_PREFIX = "roadmap:";

async function getRedis(): Promise<Redis | null> {
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
    redisClient = client as unknown as Redis;
    console.log("✓ Redis cache connected");
  } catch (error) {
    console.warn("⚠️ Redis cache unavailable, falling back to memory store:", error);
    redisClient = null;
  }

  return redisClient;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const fullKey = `${CACHE_PREFIX}${key}`;
  const redis = await getRedis();

  if (redis) {
    try {
      const raw = await redis.get(fullKey);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      console.error("Redis get error:", error);
    }
  }

  const entry = memoryStore.get(fullKey);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    memoryStore.delete(fullKey);
    return null;
  }
  return JSON.parse(entry.value) as T;
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds = ROADMAP_CACHE_TTL,
): Promise<void> {
  const fullKey = `${CACHE_PREFIX}${key}`;
  const serialized = JSON.stringify(value);
  const redis = await getRedis();

  if (redis) {
    try {
      await redis.set(fullKey, serialized, "EX", ttlSeconds);
      return;
    } catch (error) {
      console.error("Redis set error:", error);
    }
  }

  memoryStore.set(fullKey, { value: serialized, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export async function cacheDel(key: string): Promise<void> {
  const fullKey = `${CACHE_PREFIX}${key}`;
  const redis = await getRedis();
  if (redis) {
    try {
      await redis.del(fullKey);
    } catch (error) {
      console.error("Redis del error:", error);
    }
  }
  memoryStore.delete(fullKey);
}

export async function cacheDelPrefix(prefix: string): Promise<void> {
  const fullPrefix = `${CACHE_PREFIX}${prefix}`;
  const redis = await getRedis();
  if (redis) {
    try {
      const keys = await redis.keys(`${fullPrefix}*`);
      if (keys.length > 0) await redis.del(...keys);
    } catch (error) {
      console.error("Redis keys/del error:", error);
    }
  }
  for (const key of Array.from(memoryStore.keys())) {
    if (key.startsWith(fullPrefix)) memoryStore.delete(key);
  }
}

export async function invalidateRoadmapCache(): Promise<void> {
  await cacheDelPrefix("stats");
  await cacheDelPrefix("aggregate");
  await cacheDelPrefix("history");
  await cacheDelPrefix("duplicates");
}

export function assertCacheKey(key: string): string {
  if (!key || key.length > 200) {
    throw new AppError("Clé de cache invalide", 400, ErrorCode.BAD_REQUEST);
  }
  return key;
}
