import { request } from "playwright/test";
import type { FullConfig } from "playwright/test";

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@wabtechs.com";
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "Admin@12345";

async function waitUntil(check: () => Promise<boolean>, label: string): Promise<void> {
  for (let attempt = 0; attempt < 30; attempt++) {
    if (await check()) return;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error(`[warmup] le serveur dev est instable: ${label}`);
}

export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = (config.projects[0]?.use.baseURL ?? "http://localhost:3000") as string;
  const ctx = await request.newContext({ baseURL });

  await waitUntil(async () => (await ctx.get("/login")).ok(), "GET /login");
  await waitUntil(async () => (await ctx.get("/api/auth/providers")).ok(), "GET /api/auth/providers");

  await waitUntil(async () => {
    const csrfRes = await ctx.get("/api/auth/csrf");
    if (!csrfRes.ok()) return false;
    const { csrfToken } = (await csrfRes.json()) as { csrfToken: string };
    const post = await ctx.post("/api/auth/callback/credentials", {
      form: {
        csrfToken,
        callbackUrl: `${baseURL}/admin`,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
      headers: { "X-Auth-Return-Redirect": "1" },
    });
    return post.ok();
  }, "POST credentials (compilation du chemin de connexion)");

  for (const path of ["/admin", "/admin/posts", "/admin/audit", "/admin/os/projects"]) {
    await ctx.get(path).catch(() => undefined);
  }

  await ctx.dispose();
}
