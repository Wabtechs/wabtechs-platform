import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators";
import { safeHandler } from "@/lib/safe-handler";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const POST = safeHandler(async (request: Request) => {
  rateLimit(`contact:${getClientIp(request)}`, { windowMs: 60_000, max: 10 });

  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  await db.contactMessage.create({ data: parsed.data });

  return NextResponse.json({ message: "Message envoyé !" }, { status: 201 });
});
