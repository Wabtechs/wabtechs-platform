import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export async function POST(request: Request) {
  try {
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
      return NextResponse.json({ message: "Vous êtes déjà inscrit." }, { status: 200 });
    }

    const token = crypto.randomUUID();
    await db.newsletter.create({ data: { email, token } });

    return NextResponse.json({ message: "Inscription réussie !" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
