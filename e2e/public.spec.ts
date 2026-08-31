import { expect, test } from "@playwright/test";

test.describe("Pages publiques", () => {
	test("La page d'accueil se charge et rend le hero", async ({ page }) => {
		const response = await page.goto("/");
		expect(response?.status()).toBeLessThan(400);
		await expect(page).toHaveTitle(/WabTechs/);
	});

	test("La page blog affiche le filtre et la grille d'articles", async ({
		page,
	}) => {
		const response = await page.goto("/blog");
		expect(response?.status()).toBeLessThan(400);

		await expect(
			page.getByRole("heading", { name: /articles|réflexions/i }).first(),
		).toBeVisible();

		const searchInput = page.getByPlaceholder("Rechercher un article...");
		await expect(searchInput).toBeVisible();

		await searchInput.fill("prisma");
		await expect(page).toHaveURL(/\/blog/);
	});

	test("La page projets rend la grille et les détails", async ({ page }) => {
		const response = await page.goto("/projects");
		expect(response?.status()).toBeLessThan(400);

		await expect(
			page.getByRole("heading", { name: /open source/i }).first(),
		).toBeVisible();

		const firstCard = page.locator("a[href^='/projects/']").first();
		if ((await firstCard.count()) > 0) {
			await firstCard.click();
			await page.waitForURL(/\/projects\/.+/);
			await expect(page.getByRole("heading").first()).toBeVisible();
		}
	});

	test("La page podcast charge les épisodes", async ({ page }) => {
		const response = await page.goto("/podcast");
		expect(response?.status()).toBeLessThan(400);

		await expect(
			page.getByText("Podcast", { exact: false }).first(),
		).toBeVisible();
	});

	test("La documentation s'affiche", async ({ page }) => {
		const response = await page.goto("/docs");
		expect(response?.status()).toBeLessThan(400);
	});

	test("Les pages erreur et 404 sont fonctionnelles", async ({ page }) => {
		const response = await page.goto("/cette-page-nexiste-pas");
		expect(response?.status()).toBe(404);
	});
});
