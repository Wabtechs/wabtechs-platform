import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'wabtechserveur@gmail.com';
  const password = 'lollipop';
  
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    console.log('Updated user to ADMIN:', user.email, user.role);
  } else {
    const hashedPassword = await bcrypt.hash(password, 12);
    user = await prisma.user.create({
      data: {
        email,
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Created admin user:', user.email, user.role);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());