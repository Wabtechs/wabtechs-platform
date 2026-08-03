import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  rateLimit(`download:${getClientIp(req)}`, { windowMs: 60_000, max: 30 });

  try {
    const template = await db.template.findUnique({ where: { slug } });
    if (!template) {
      return NextResponse.json({ error: "Template introuvable" }, { status: 404 });
    }

    await db.template.update({
      where: { id: template.id },
      data: { downloads: { increment: 1 } },
    });

    return NextResponse.json({
      url: template.downloadUrl ?? template.repoUrl ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
