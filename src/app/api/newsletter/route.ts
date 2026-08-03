import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { z } from "zod";
import { sendConfirmationEmail } from "@/lib/email";
import { safeHandler } from "@/lib/safe-handler";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const subscribeSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export const POST = safeHandler(async (request: Request) => {
  rateLimit(`newsletter:${getClientIp(request)}`, { windowMs: 60_000, max: 5 });

  const body = await request.json();
  const parsed = subscribeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors.email?.[0] ?? "Email invalide" },
      { status: 400 },
    );
  }

  const { email } = parsed.data;

  const existing = await db.newsletter.findUnique({ where: { email } });
  if (existing) {
    if (existing.active) {
      return NextResponse.json({ message: "Vous êtes déjà inscrit." }, { status: 200 });
    }
    return NextResponse.json({ message: "Un email de confirmation vous a déjà été envoyé." }, { status: 200 });
  }

  const token = crypto.randomUUID();
  await db.newsletter.create({ data: { email, token, active: false } });

  try {
    await sendConfirmationEmail(email, token);
  } catch {
    // Email sending failed but subscriber is recorded
  }

  return NextResponse.json(
    { message: "Email de confirmation envoyé. Vérifiez votre boîte de réception." },
    { status: 201 },
  );
});
