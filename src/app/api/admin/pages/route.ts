import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();

  const items = await db.page.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const body = await req.json();
  const { id, ...data } = body;

  if (id) {
    const updated = await db.page.update({
      where: { id },
      data,
    });
    await createAuditLog({ action: "UPDATE", entity: "Page", entityId: updated.id, userId: user.id as string, details: JSON.stringify(data) });
    return NextResponse.json(updated);
  }

  const item = await db.page.create({
    data: {
      slug: data.slug,
      title: data.title,
      content: data.content ?? null,
      published: data.published ?? false,
      metaTitle: data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,
    },
  });
  await createAuditLog({ action: "CREATE", entity: "Page", entityId: item.id, userId: user.id as string });
  return NextResponse.json(item, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.page.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Page", entityId: id, userId: user.id as string });
  return NextResponse.json({ success: true });
});
