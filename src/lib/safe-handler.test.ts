import { describe, expect, it, vi } from "vitest";
import { AppError, ErrorCode } from "@/lib/errors";
import { safeHandler } from "@/lib/safe-handler";

describe("safeHandler", () => {
  it("retourne la réponse du handler en cas de succès", async () => {
    const handler = safeHandler(async () => new Response("ok", { status: 200 }));
    const res = await handler(new Request("http://localhost"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("ok");
  });

  it("convertit une AppError en JSON avec son statut et son code", async () => {
    const handler = safeHandler(async () => {
      throw new AppError("Non autorisé", 401, ErrorCode.UNAUTHORIZED);
    });
    const res = await handler(new Request("http://localhost"));
    expect(res.status).toBe(401);
    expect(res.headers.get("content-type")).toContain("application/json");
    const body = await res.json();
    expect(body).toEqual({ error: "Non autorisé", code: ErrorCode.UNAUTHORIZED });
  });

  it("réutilise les headers de l'AppError", async () => {
    const handler = safeHandler(async () => {
      throw new AppError("Trop de requêtes", 429, ErrorCode.TOO_MANY_REQUESTS, {
        "Retry-After": "5",
      });
    });
    const res = await handler(new Request("http://localhost"));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("5");
  });

  it("retourne une erreur 500 générique pour les erreurs inattendues", async () => {
    const handler = safeHandler(async () => {
      throw new Error("boom");
    });
    const res = await handler(new Request("http://localhost"));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ error: "Erreur serveur", code: ErrorCode.INTERNAL });
  });

  it("n'expose pas le message interne en production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const handler = safeHandler(async () => {
      throw new Error("secret internal detail");
    });
    const res = await handler(new Request("http://localhost"));
    const body = await res.json();
    expect(body.error).not.toContain("secret");
    vi.unstubAllEnvs();
  });
});
