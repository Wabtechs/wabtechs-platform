import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();

  const tutorials = await db.tutorial.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(tutorials);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const body = await req.json();
  const { id, ...data } = body;

  if (id) {
    const updated = await db.tutorial.update({ where: { id }, data });
    await createAuditLog({ action: "UPDATE", entity: "Tutoriel", entityId: updated.id, userId: user.id as string, details: JSON.stringify(data) });
    return NextResponse.json(updated);
  }

  const tutorial = await db.tutorial.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      content: data.content ?? null,
      coverImage: data.coverImage ?? null,
      published: data.published ?? false,
    },
  });
  await createAuditLog({ action: "CREATE", entity: "Tutoriel", entityId: tutorial.id, userId: user.id as string });
  return NextResponse.json(tutorial, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.tutorial.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Tutoriel", entityId: id, userId: user.id as string });
  return NextResponse.json({ success: true });
});
