import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "../scripts/load-env";

const prisma = new PrismaClient();

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`[seed] Variable d'environnement manquante: ${name}`);
	}
	return value;
}

async function main() {
	const email = requireEnv("SEED_ADMIN_EMAIL");
	const password = await bcrypt.hash(requireEnv("SEED_ADMIN_PASSWORD"), 12);
	const name = process.env.SEED_ADMIN_NAME ?? "Emmanuel Mulonda Johannes";

	const admin = await prisma.user.upsert({
		where: { email },
		update: { name, role: "ADMIN" },
		create: {
			email,
			name,
			password,
			role: "ADMIN",
			bio: "Développeur full-stack et fondateur de WabTechs.",
			github: "https://github.com/wabtechs",
		},
	});

	console.log("Admin user created/updated:", admin.email, admin.role);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
