import { describe, expect, it, vi, afterEach } from "vitest";
import { AppError, ErrorCode } from "@/lib/errors";
import {
  exchangeCodeForToken,
  getAuthorizeUrl,
  getGitHubOAuthConfig,
  getRedirectBase,
  githubFetch,
  githubPaginate,
} from "@/lib/github";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("getGitHubOAuthConfig", () => {
  it("retourne la config avec clientId et secret", () => {
    vi.stubEnv("GITHUB_CLIENT_ID", "client-123");
    vi.stubEnv("GITHUB_CLIENT_SECRET", "secret-456");

    const config = getGitHubOAuthConfig();

    expect(config).not.toBeNull();
    expect(config?.clientId).toBe("client-123");
    expect(config?.clientSecret).toBe("secret-456");
    expect(config).not.toHaveProperty("redirectUri");
  });

  it("retourne null sans credentials", () => {
    vi.stubEnv("GITHUB_CLIENT_ID", "");
    vi.stubEnv("GITHUB_CLIENT_SECRET", "");
    expect(getGitHubOAuthConfig()).toBeNull();
  });
});

describe("getRedirectBase", () => {
  it("utilise l'origin fourni en priorité", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://other.example.com");
    expect(getRedirectBase("https://wabtechs-platform.vercel.app")).toBe(
      "https://wabtechs-platform.vercel.app",
    );
  });

  it("utilise NEXT_PUBLIC_BASE_URL par défaut", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://example.com");
    expect(getRedirectBase()).toBe("https://example.com");
  });

  it("utilise VERCEL_URL quand NEXT_PUBLIC_BASE_URL est absent", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "");
    vi.stubEnv("VERCEL_URL", "wabtechs-platform.vercel.app");
    expect(getRedirectBase()).toBe("https://wabtechs-platform.vercel.app");
  });

  it("retombe sur localhost en environnement local", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "");
    vi.stubEnv("VERCEL_URL", "");
    expect(getRedirectBase()).toBe("http://localhost:3000");
  });
});

describe("getAuthorizeUrl", () => {
  it("construit l'URL d'autorisation avec scope et state", () => {
    vi.stubEnv("GITHUB_CLIENT_ID", "client-123");
    vi.stubEnv("GITHUB_CLIENT_SECRET", "secret-456");

    const url = getAuthorizeUrl("state-abc");

    expect(url).toContain("https://github.com/login/oauth/authorize");
    expect(url).toContain("client_id=client-123");
    expect(url).toContain("state=state-abc");
    expect(url).toContain("scope=repo%2Cread%3Auser%2Cuser%3Aemail");
  });

  it("utilise l'origin fourni pour le redirect_uri (évite le localhost en prod)", () => {
    vi.stubEnv("GITHUB_CLIENT_ID", "client-123");
    vi.stubEnv("GITHUB_CLIENT_SECRET", "secret-456");

    const url = getAuthorizeUrl("state-abc", "https://wabtechs-platform.vercel.app");

    expect(url).toContain(
      "redirect_uri=" +
        encodeURIComponent("https://wabtechs-platform.vercel.app/api/github/callback"),
    );
  });

  it("lève une erreur sans config", () => {
    expect(() => getAuthorizeUrl("state")).toThrow(AppError);
  });
});

describe("githubFetch", () => {
  it("retourne les données JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ login: "octo" }), { status: 200 })),
    );

    const data = await githubFetch<{ login: string }>("token", "/user");

    expect(data.login).toBe("octo");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("api.github.com/user"),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token" }),
      }),
    );
  });

  it("lève NOT_FOUND sur 404", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 404 })));
    await expect(githubFetch("token", "/missing")).rejects.toMatchObject({
      code: ErrorCode.NOT_FOUND,
      status: 404,
    });
  });

  it("lève UNAUTHORIZED sur 401", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 401 })));
    await expect(githubFetch("token", "/user")).rejects.toMatchObject({
      code: ErrorCode.UNAUTHORIZED,
    });
  });

  it("lève TOO_MANY_REQUESTS sur 403", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 403 })));
    await expect(githubFetch("token", "/user")).rejects.toMatchObject({
      code: ErrorCode.TOO_MANY_REQUESTS,
    });
  });

  it("lève INTERNAL sur erreur inattendue", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 502 })));
    await expect(githubFetch("token", "/user")).rejects.toMatchObject({
      code: ErrorCode.INTERNAL,
      status: 502,
    });
  });
});

describe("githubPaginate", () => {
  it("extrait le total depuis le header Link", async () => {
    const headers = new Headers({
      link: '<https://api.github.com/repos?page=2>; rel="next", <https://api.github.com/repos?page=5>; rel="last"',
    });
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(new Response(JSON.stringify([{ id: 1 }]), { status: 200, headers })),
    );

    const result = await githubPaginate<{ id: number }>("token", "/repos");

    expect(result.total).toBe(5);
    expect(result.items).toHaveLength(1);
  });

  it("retombe sur la longueur des items sans header Link", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(new Response(JSON.stringify([{ id: 1 }, { id: 2 }]), { status: 200 })),
    );

    const result = await githubPaginate<{ id: number }>("token", "/repos");

    expect(result.total).toBe(2);
  });
});

describe("exchangeCodeForToken", () => {
  it("échangé le code contre un token", async () => {
    vi.stubEnv("GITHUB_CLIENT_ID", "client-123");
    vi.stubEnv("GITHUB_CLIENT_SECRET", "secret-456");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({ access_token: "gho_token", token_type: "bearer", scope: "repo" }),
            { status: 200 },
          ),
        ),
    );

    const token = await exchangeCodeForToken("code-xyz");

    expect(token.access_token).toBe("gho_token");
    expect(fetch).toHaveBeenCalledWith(
      "https://github.com/login/oauth/access_token",
      expect.objectContaining({
        body: expect.stringContaining("code-xyz"),
      }),
    );
  });

  it("lève une erreur si GitHub refuse le code", async () => {
    vi.stubEnv("GITHUB_CLIENT_ID", "client-123");
    vi.stubEnv("GITHUB_CLIENT_SECRET", "secret-456");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ error: "bad_verification_code" }), { status: 400 }),
        ),
    );

    await expect(exchangeCodeForToken("bad")).rejects.toThrow(AppError);
  });
});
