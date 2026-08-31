import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

const slug = `e2e-test-article-${Date.now()}`;

test.describe("Admin", () => {
	test.describe.configure({ mode: "serial" });

	test("Le dashboard admin s'affiche après connexion", async ({ page }) => {
		await loginAsAdmin(page);
		await expect(page).toHaveURL(/\/admin/);
		await expect(
			page.getByText("Dashboard", { exact: false }).first(),
		).toBeVisible();
	});

	test("La gestion des articles liste les contenus", async ({ page }) => {
		await loginAsAdmin(page);
		await page.goto("/admin/posts");
		await expect(page.getByRole("heading", { name: "Articles" })).toBeVisible();
		await expect(page.getByText(/articles au total/)).toBeVisible();
	});

	test("Création d'un article publié via l'UI", async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto("/admin/posts/new");
		await expect(
			page.getByRole("heading", { name: "Nouvel article" }),
		).toBeVisible();

		await page.getByLabel("Titre").fill(`Article de test E2E`);
		await page.getByLabel("Slug").fill(slug);
		await page
			.getByLabel("Description")
			.fill("Description générée par les tests E2E pour valider le CRUD.");
		await page
			.getByPlaceholder("Écrivez votre contenu en Markdown...")
			.fill("# Titre\n\nContenu de test **important**.");
		await page.getByLabel("Tags (séparés par des virgules)").fill("E2E, Test");
		await page.getByLabel("Publié", { exact: true }).check();

		await page.getByRole("button", { name: /Créer l'article/i }).click();

		const postResp = await page.waitForResponse(
			(res) =>
				res.url().includes("/api/admin/posts") && res.request().method() === "POST",
			{ timeout: 20_000 },
		);
		expect(postResp.status()).toBe(201);

		await page.waitForURL(/\/admin\/posts$/, { timeout: 20_000 });
		await page.goto("/admin/posts");
		await expect(page.getByRole("heading", { name: "Articles" })).toBeVisible();
		await expect(page.getByText("Article de test E2E").first()).toBeVisible();
	});

	test("L'article créé est visible publiquement (branchage DB)", async ({
		page,
	}) => {
		await page.goto(`/blog/${slug}`);
		await expect(
			page.getByRole("heading", { name: "Article de test E2E" }),
		).toBeVisible();
		await expect(page.getByText("Contenu de test")).toBeVisible();
	});

	test("Nettoyage : suppression de l'article de test", async ({ page }) => {
		await loginAsAdmin(page);
		await page.goto("/admin/posts");
		await expect(page.getByRole("heading", { name: "Articles" })).toBeVisible();

		for (;;) {
			const row = page
				.locator(".group", { hasText: "Article de test E2E" })
				.first();
			if ((await row.count()) === 0) break;
			const del = row.getByRole("button", { name: "Supprimer l'article" });
			if ((await del.count()) === 0) break;
			page.once("dialog", (dialog) => dialog.accept());
			await del.click();
			await expect(
				page.getByText("Article de test E2E").first(),
			).toHaveCount(0, { timeout: 10_000 });
		}
		await expect(page.getByText("Article de test E2E")).toHaveCount(0);
	});
});
