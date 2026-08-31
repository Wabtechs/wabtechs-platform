import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "./load-env";

const prisma = new PrismaClient();

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`[make-admin] Variable d'environnement manquante: ${name}`);
	}
	return value;
}

async function main() {
	const email = requireEnv("SEED_ADMIN_EMAIL");
	const password = requireEnv("SEED_ADMIN_PASSWORD");
	const adminName = process.env.SEED_ADMIN_NAME ?? "Admin";

	let user = await prisma.user.findUnique({ where: { email } });

	if (user) {
		user = await prisma.user.update({
			where: { email },
			data: { role: "ADMIN" },
		});
		console.log("Updated user to ADMIN:", user.email, user.role);
	} else {
		const hashedPassword = await bcrypt.hash(password, 12);
		user = await prisma.user.create({
			data: {
				email,
				name: adminName,
				password: hashedPassword,
				role: "ADMIN",
			},
		});
		console.log("Created admin user:", user.email, user.role);
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
