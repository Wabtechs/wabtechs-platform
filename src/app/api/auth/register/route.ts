import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const POST = safeHandler(async (req: Request) => {
  await rateLimit(`register:${getClientIp(req)}`, { windowMs: 60_000, max: 5 });

  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: { name, email, password: hashedPassword, role: "USER" },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json({ user }, { status: 201 });
});
