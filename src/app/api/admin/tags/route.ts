import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();

  const tags = await db.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true, podcasts: true } } },
  });
  return NextResponse.json(tags);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { name } = await req.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const tag = await db.tag.upsert({
    where: { name: name.trim() },
    update: {},
    create: { name: name.trim(), slug },
  });
  await createAuditLog({ action: "CREATE", entity: "Tag", entityId: tag.id, userId: user.id as string });
  return NextResponse.json(tag, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.tag.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Tag", entityId: id, userId: user.id as string });
  return NextResponse.json({ success: true });
});
