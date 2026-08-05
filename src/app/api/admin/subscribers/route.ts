import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

const PAGE_SIZE = 50;

export const GET = safeHandler(async (req: Request) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const skip = (page - 1) * PAGE_SIZE;

  const [total, subscribers] = await Promise.all([
    db.newsletter.count(),
    db.newsletter.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    subscribers,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
    },
  });
});

export const PATCH = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id, active } = await req.json();
  if (!id || typeof active !== "boolean") {
    return NextResponse.json({ error: "id et active requis" }, { status: 400 });
  }
  const updated = await db.newsletter.update({ where: { id }, data: { active } });
  await createAuditLog({
    action: "UPDATE",
    entity: "Abonné",
    entityId: updated.id,
    userId: user.id as string,
    details: JSON.stringify({ active }),
  });
  return NextResponse.json(updated);
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.newsletter.delete({ where: { id } });
  await createAuditLog({
    action: "DELETE",
    entity: "Abonné",
    entityId: id,
    userId: user.id as string,
  });
  return NextResponse.json({ success: true });
});
