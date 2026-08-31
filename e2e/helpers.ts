import { resolve } from "node:path";
import type { Page } from "@playwright/test";
import { config as loadEnv } from "dotenv";

loadEnv({ path: resolve(process.cwd(), ".env") });
loadEnv({ path: resolve(process.cwd(), ".env.local") });

export interface Credentials {
	email: string;
	password: string;
	name: string;
}

export function getAdminCredentials(): Credentials {
	const email = unquote(process.env.SEED_ADMIN_EMAIL);
	const password = unquote(process.env.SEED_ADMIN_PASSWORD);
	const name = unquote(process.env.SEED_ADMIN_NAME) ?? "Admin";

	if (!email || !password) {
		throw new Error(
			"Variables SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD manquantes dans .env pour les tests E2E.",
		);
	}

	return { email, password, name };
}

export async function loginAsAdmin(page: Page): Promise<void> {
	const creds = getAdminCredentials();
	await page.goto("/login");
	await page.getByLabel("Email").fill(creds.email);
	await page.getByLabel("Mot de passe").fill(creds.password);
	await page.getByRole("button", { name: /Se connecter/i }).click();
	await page.waitForURL(/\/admin/, { timeout: 20_000 });
}

function unquote(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const trimmed = value.trim();
	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1);
	}
	return trimmed;
}
