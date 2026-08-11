import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { safeHandler } from "@/lib/safe-handler";
import { Messages } from "@/lib/messages";

export const POST = safeHandler(
  async (req: Request, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    await rateLimit(`download:${getClientIp(req)}`, { windowMs: 60_000, max: 30 });

    const template = await db.template.findUnique({ where: { slug } });
    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template introuvable ou supprimé", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const paid = Number(template.price) > 0;
    if (paid) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json(
          { success: false, error: Messages.errors.unauthorized, code: "UNAUTHORIZED" },
          { status: 401 },
        );
      }

      const purchase = await db.templatePurchase.findFirst({
        where: { userId: session.user.id as string, templateId: template.id },
      });
      if (!purchase) {
        return NextResponse.json(
          { success: false, error: "Achat requis pour télécharger ce template", code: "FORBIDDEN" },
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
  },
);
