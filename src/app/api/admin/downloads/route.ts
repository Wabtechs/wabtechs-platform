import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();

  const downloads = await db.download.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(downloads);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const body = await req.json();
  const { id, ...data } = body;

  if (id) {
    const updated = await db.download.update({ where: { id }, data });
    await createAuditLog({ action: "UPDATE", entity: "Téléchargement", entityId: updated.id, userId: user.id as string, details: JSON.stringify(data) });
    return NextResponse.json(updated);
  }

  const download = await db.download.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      fileUrl: data.fileUrl,
      fileSize: data.fileSize ?? null,
      category: data.category ?? null,
      published: data.published ?? false,
    },
  });
  await createAuditLog({ action: "CREATE", entity: "Téléchargement", entityId: download.id, userId: user.id as string });
  return NextResponse.json(download, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.download.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Téléchargement", entityId: id, userId: user.id as string });
  return NextResponse.json({ success: true });
});
