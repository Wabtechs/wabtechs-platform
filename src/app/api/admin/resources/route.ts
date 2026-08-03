import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();

  const resources = await db.resource.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(resources);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const body = await req.json();
  const { id, ...data } = body;

  if (id) {
    const updated = await db.resource.update({ where: { id }, data });
    await createAuditLog({ action: "UPDATE", entity: "Ressource", entityId: updated.id, userId: user.id as string, details: JSON.stringify(data) });
    return NextResponse.json(updated);
  }

  const resource = await db.resource.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      url: data.url ?? null,
      type: data.type ?? null,
      published: data.published ?? false,
    },
  });
  await createAuditLog({ action: "CREATE", entity: "Ressource", entityId: resource.id, userId: user.id as string });
  return NextResponse.json(resource, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.resource.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Ressource", entityId: id, userId: user.id as string });
  return NextResponse.json({ success: true });
});