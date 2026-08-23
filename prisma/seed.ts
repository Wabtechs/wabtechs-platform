import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@wabtechs.com";
  const password = await bcrypt.hash("Admin@12345", 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Emmanuel Mulonda Johannes",
      password,
      role: "ADMIN",
      bio: "Développeur full-stack et fondateur de WabTechs.",
      github: "https://github.com/wabtechs",
    },
  });

  console.log("Admin user created/updated:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
