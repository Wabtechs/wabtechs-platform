import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { isAppError } from "@/lib/errors";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    await rateLimit(`download:${getClientIp(req)}`, { windowMs: 60_000, max: 30 });

    const template = await db.template.findUnique({ where: { slug } });
    if (!template) {
      return NextResponse.json({ error: "Template introuvable" }, { status: 404 });
    }

    const paid = Number(template.price) > 0;
    if (paid) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json(
          { error: "Connectez-vous pour télécharger ce template" },
          { status: 401 },
        );
      }

      const purchase = await db.templatePurchase.findFirst({
        where: { userId: session.user.id as string, templateId: template.id },
      });
      if (!purchase) {
        return NextResponse.json(
          { error: "Achat requis pour télécharger ce template" },
          { status: 403 },
        );
      }
    }

    await db.template.update({
      where: { id: template.id },
      data: { downloads: { increment: 1 } },
    });

    return NextResponse.json({
      url: template.downloadUrl ?? template.repoUrl ?? null,
    });
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status, headers: error.headers },
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
