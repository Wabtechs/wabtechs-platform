import { describe, expect, it, beforeEach } from "vitest";
import { AppError } from "@/lib/errors";
import { getClientIp, rateLimit, resetRateLimit } from "@/lib/rate-limit";

describe("getClientIp", () => {
  it("extrait la première IP du header x-forwarded-for", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.5, 70.41.3.18" },
    });
    expect(getClientIp(req)).toBe("203.0.113.5");
  });

  it("retombe sur x-real-ip", () => {
    const req = new Request("http://localhost", {
      headers: { "x-real-ip": "198.51.100.7" },
    });
    expect(getClientIp(req)).toBe("198.51.100.7");
  });

  it("renvoie unknown sans header", () => {
    expect(getClientIp(new Request("http://localhost"))).toBe("unknown");
  });
});

describe("rateLimit", () => {
  beforeEach(async () => {
    await resetRateLimit("test:key");
  });

  it("autorise les requêtes sous le maximum", async () => {
    await rateLimit("test:key", { windowMs: 60_000, max: 3 });
    await rateLimit("test:key", { windowMs: 60_000, max: 3 });
    const result = await rateLimit("test:key", { windowMs: 60_000, max: 3 });
    expect(result.remaining).toBe(0);
  });

  it("lève une AppError 429 au-delà du maximum", async () => {
    for (let i = 0; i < 3; i++) {
      await rateLimit("test:key", { windowMs: 60_000, max: 3 });
    }
    await expect(rateLimit("test:key", { windowMs: 60_000, max: 3 })).rejects.toThrowError(
      AppError,
    );
    await expect(rateLimit("test:key", { windowMs: 60_000, max: 3 })).rejects.toThrowError(
      "Trop de requêtes",
    );
  });

  it("renouvelle la fenêtre après expiration", async () => {
    await rateLimit("test:key", { windowMs: -1, max: 1 });
    await rateLimit("test:key", { windowMs: -1, max: 1 });
    await expect(rateLimit("test:key", { windowMs: 60_000, max: 1 })).resolves.toBeDefined();
  });
});
