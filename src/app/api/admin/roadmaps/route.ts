import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();

  const roadmaps = await db.roadmap.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(roadmaps);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const body = await req.json();
  const { id, ...data } = body;

  if (id) {
    const updated = await db.roadmap.update({ where: { id }, data });
    await createAuditLog({ action: "UPDATE", entity: "Roadmap", entityId: updated.id, userId: user.id as string, details: JSON.stringify(data) });
    return NextResponse.json(updated);
  }

  const roadmap = await db.roadmap.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      status: data.status ?? "planned",
      quarter: data.quarter ?? null,
      year: data.year ?? null,
      order: data.order ?? 0,
      published: data.published ?? false,
    },
  });
  await createAuditLog({ action: "CREATE", entity: "Roadmap", entityId: roadmap.id, userId: user.id as string });
  return NextResponse.json(roadmap, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.roadmap.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Roadmap", entityId: id, userId: user.id as string });
  return NextResponse.json({ success: true });
});