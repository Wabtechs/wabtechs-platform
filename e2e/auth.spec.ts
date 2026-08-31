import { expect, test } from "@playwright/test";
import { getAdminCredentials } from "./helpers";

test.describe("Authentification", () => {
	test("L'accès à /admin non authentifié redirige vers /login", async ({
		page,
	}) => {
		await page.goto("/admin");
		await page.waitForURL(/\/login/);
		await expect(page.getByLabel("Email")).toBeVisible();
		await expect(
			page.getByRole("button", { name: /Se connecter/i }),
		).toBeVisible();
	});

	test("Un utilisateur peut se connecter puis atteindre l'admin", async ({
		page,
	}) => {
		const creds = getAdminCredentials();

		await page.goto("/login");
		await page.getByLabel("Email").fill(creds.email);
		await page.getByLabel("Mot de passe").fill(creds.password);
		await page.getByRole("button", { name: /Se connecter/i }).click();

		await page.waitForURL(/\/admin/, { timeout: 20_000 });
		await expect(page).toHaveURL(/\/admin/);
	});

	test("Des identifiants invalides affichent une erreur", async ({ page }) => {
		await page.goto("/login");
		await page.getByLabel("Email").fill("inconnu@wabtechs.com");
		await page.getByLabel("Mot de passe").fill("motdepasseincorrect");
		await page.getByRole("button", { name: /Se connecter/i }).click();

		await expect(
			page.getByText("Email ou mot de passe incorrect."),
		).toBeVisible({
			timeout: 15_000,
		});
	});
});
