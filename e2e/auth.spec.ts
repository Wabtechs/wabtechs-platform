import { test, expect } from "playwright/test";

test.describe("Contrôle d'accès", () => {
  test("un visiteur non connecté est redirigé de /admin vers /login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fadmin/);
  });

  test("un visiteur non connecté est redirigé de /admin/audit vers /login", async ({ page }) => {
    await page.goto("/admin/audit");
    await expect(page).toHaveURL(/\/login/);
  });

  test("un visiteur non connecté ne peut pas interroger /api/admin/stats", async ({ request }) => {
    const res = await request.get("/api/admin/stats");
    expect(res.status()).toBe(401);
  });
});
