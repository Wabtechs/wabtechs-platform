import { describe, expect, it, vi, beforeEach } from "vitest";
import { AppError } from "@/lib/errors";
import { rateLimit, getClientIp, resetRateLimit } from "@/lib/rate-limit";

const mocks = vi.hoisted(() => {
  const fns = {
    ping: vi.fn(),
    incr: vi.fn(),
    expire: vi.fn(),
    ttl: vi.fn(),
    del: vi.fn(),
  };
  return {
    fns,
    MockRedis: class {
      on() {}
      ping() {
        return fns.ping();
      }
      incr(...args: string[]) {
        return fns.incr(...args);
      }
      expire(...args: (string | number)[]) {
        return fns.expire(...args);
      }
      ttl(...args: string[]) {
        return fns.ttl(...args);
      }
      del(...args: string[]) {
        return fns.del(...args);
      }
    },
  };
});

vi.mock("ioredis", () => ({
  default: mocks.MockRedis,
}));

describe("rateLimit avec Redis", () => {
  beforeEach(() => {
    mocks.fns.ping.mockResolvedValue("PONG");
    mocks.fns.incr.mockReset();
    mocks.fns.expire.mockReset();
    mocks.fns.ttl.mockReset();
    mocks.fns.del.mockReset();
  });

  it("compte via Redis sous le maximum", async () => {
    mocks.fns.incr.mockResolvedValue(2);
    mocks.fns.ttl.mockResolvedValue(30);
    const result = await rateLimit("redis:key", { windowMs: 60_000, max: 5 });
    expect(result.remaining).toBe(3);
    expect(mocks.fns.incr).toHaveBeenCalledWith("ratelimit:redis:key");
  });

  it("pose l'expiration à la première requête", async () => {
    mocks.fns.incr.mockResolvedValue(1);
    mocks.fns.ttl.mockResolvedValue(60);
    await rateLimit("redis:key", { windowMs: 60_000, max: 5 });
    expect(mocks.fns.expire).toHaveBeenCalledWith("ratelimit:redis:key", 60);
  });

  it("lève une AppError 429 au-delà du maximum", async () => {
    mocks.fns.incr.mockResolvedValue(6);
    mocks.fns.ttl.mockResolvedValue(45);
    await expect(rateLimit("redis:key", { windowMs: 60_000, max: 5 })).rejects.toThrowError(
      AppError,
    );
  });

  it("retombe sur le store mémoire si Redis échoue", async () => {
    mocks.fns.incr.mockRejectedValue(new Error("redis down"));
    await resetRateLimit("fallback:key");
    const result = await rateLimit("fallback:key", { windowMs: 60_000, max: 3 });
    expect(result.remaining).toBe(2);
  });

  it("resetRateLimit supprime la clé Redis et mémoire", async () => {
    mocks.fns.del.mockResolvedValue(1);
    await resetRateLimit("redis:key");
    expect(mocks.fns.del).toHaveBeenCalledWith("ratelimit:redis:key");
  });

  it("getClientIp gère le header vide", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "" },
    });
    expect(getClientIp(req)).toBe("unknown");
  });
});
