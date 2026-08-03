import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();

  const changelogs = await db.changelog.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(changelogs);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const body = await req.json();
  const { id, ...data } = body;

  if (id) {
    const updated = await db.changelog.update({ where: { id }, data });
    await createAuditLog({ action: "UPDATE", entity: "Changelog", entityId: updated.id, userId: user.id as string, details: JSON.stringify(data) });
    return NextResponse.json(updated);
  }

  const changelog = await db.changelog.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content ?? null,
      version: data.version ?? null,
      date: data.date ?? null,
      published: data.published ?? false,
    },
  });
  await createAuditLog({ action: "CREATE", entity: "Changelog", entityId: changelog.id, userId: user.id as string });
  return NextResponse.json(changelog, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.changelog.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Changelog", entityId: id, userId: user.id as string });
  return NextResponse.json({ success: true });
});