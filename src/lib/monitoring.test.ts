import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { captureError } from "@/lib/monitoring";

describe("captureError", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("console.error en mode développement avec contexte", () => {
    vi.stubEnv("NODE_ENV", "development");
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("boom");

    captureError(error, { page: "/accueil" });

    expect(spy).toHaveBeenCalledWith("[Monitoring]", "boom", {
      stack: error.stack,
      page: "/accueil",
    });
  });

  it("log une valeur non-Error en mode développement", () => {
    vi.stubEnv("NODE_ENV", "development");
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const stack = undefined;

    captureError("simple string");

    expect(spy).toHaveBeenCalledWith("[Monitoring]", "simple string", { stack });
  });

  it("envoie un POST à /api/monitoring/error hors développement", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    captureError(new Error("prod boom"), { ref: 42 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("/api/monitoring/error");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body.message).toBe("prod boom");
    expect(body.context).toEqual({ ref: 42 });
    expect(body.timestamp).toBeTruthy();
  });

  it("ignore les échecs d'envoi réseau", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    await captureError("x");
    expect(fetch).toHaveBeenCalled();
  });
});
