import { describe, expect, it, vi, afterEach } from "vitest";
import { AppError, ErrorCode } from "@/lib/errors";
import { getVercelHookConfig, triggerVercelDeploy } from "@/lib/vercel";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("getVercelHookConfig", () => {
  it("retourne la config avec le hook URL", () => {
    vi.stubEnv("VERCEL_DEPLOY_HOOK_URL", "https://api.vercel.com/v1/integrations/deploy/abc");
    expect(getVercelHookConfig()).toEqual({
      hookUrl: "https://api.vercel.com/v1/integrations/deploy/abc",
    });
  });

  it("retourne null sans hook URL", () => {
    vi.stubEnv("VERCEL_DEPLOY_HOOK_URL", "");
    expect(getVercelHookConfig()).toBeNull();
  });
});

describe("triggerVercelDeploy", () => {
  it("déclenche un déploiement et retourne son id et url", async () => {
    vi.stubEnv("VERCEL_DEPLOY_HOOK_URL", "https://api.vercel.com/v1/integrations/deploy/abc");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            id: "dpl_123",
            url: "wabtechs-platform-abc.vercel.app",
            readyState: "QUEUED",
            created: 1234567890,
          }),
          { status: 201 },
        ),
      ),
    );

    const result = await triggerVercelDeploy();

    expect(result.id).toBe("dpl_123");
    expect(result.url).toBe("wabtechs-platform-abc.vercel.app");
    expect(result.state).toBe("QUEUED");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.vercel.com/v1/integrations/deploy/abc",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("lève une erreur sans hook configuré", async () => {
    vi.stubEnv("VERCEL_DEPLOY_HOOK_URL", "");
    await expect(triggerVercelDeploy()).rejects.toThrow(AppError);
  });

  it("lève UNAUTHORIZED sur 401", async () => {
    vi.stubEnv("VERCEL_DEPLOY_HOOK_URL", "https://api.vercel.com/v1/integrations/deploy/abc");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 401 })));
    await expect(triggerVercelDeploy()).rejects.toMatchObject({
      code: ErrorCode.UNAUTHORIZED,
    });
  });

  it("lève INTERNAL sur une réponse invalide", async () => {
    vi.stubEnv("VERCEL_DEPLOY_HOOK_URL", "https://api.vercel.com/v1/integrations/deploy/abc");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 201 })));
    await expect(triggerVercelDeploy()).rejects.toMatchObject({
      code: ErrorCode.INTERNAL,
    });
  });
});
