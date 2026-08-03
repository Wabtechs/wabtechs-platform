import { describe, expect, it, beforeEach } from "vitest";
import { AppError } from "@/lib/errors";
import {
  getClientIp,
  rateLimit,
  resetRateLimit,
} from "@/lib/rate-limit";

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
  beforeEach(() => {
    resetRateLimit("test:key");
  });

  it("autorise les requêtes sous le maximum", () => {
    rateLimit("test:key", { windowMs: 60_000, max: 3 });
    rateLimit("test:key", { windowMs: 60_000, max: 3 });
    const result = rateLimit("test:key", { windowMs: 60_000, max: 3 });
    expect(result.remaining).toBe(0);
  });

  it("lève une AppError 429 au-delà du maximum", () => {
    for (let i = 0; i < 3; i++) {
      rateLimit("test:key", { windowMs: 60_000, max: 3 });
    }
    expect(() => rateLimit("test:key", { windowMs: 60_000, max: 3 })).toThrowError(
      AppError,
    );
    expect(() => rateLimit("test:key", { windowMs: 60_000, max: 3 })).toThrowError(
      "Trop de requêtes",
    );
  });

  it("renouvelle la fenêtre après expiration", () => {
    rateLimit("test:key", { windowMs: -1, max: 1 });
    rateLimit("test:key", { windowMs: -1, max: 1 });
    expect(() =>
      rateLimit("test:key", { windowMs: 60_000, max: 1 }),
    ).not.toThrowError();
  });
});
