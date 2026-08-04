import { test, expect } from "playwright/test";
import { login } from "./helpers";

test.describe("Admin connecté", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("le dashboard admin affiche le message de bienvenue", async ({ page }) => {
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByText(/Bonjour,/)).toBeVisible();
  });

  test("le journal d'audit se charge avec ses filtres", async ({ page }) => {
    await page.goto("/admin/audit");
    await expect(page.getByRole("heading", { name: "Journal d'audit" })).toBeVisible();
    await expect(page.getByLabel("Action")).toBeVisible();
    await expect(page.getByLabel("Recherche")).toBeVisible();
    await expect(page.getByRole("button", { name: "Filtrer" })).toBeVisible();
  });

  test("la page des articles se charge", async ({ page }) => {
    await page.goto("/admin/posts");
    await expect(page.getByRole("heading", { name: "Articles" })).toBeVisible();
  });

  test("la page Project OS projets se charge", async ({ page }) => {
    await page.goto("/admin/os/projects");
    await expect(page.getByRole("heading", { name: "Projets" })).toBeVisible();
  });
});
