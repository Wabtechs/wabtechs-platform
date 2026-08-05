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

  const [total, messages] = await Promise.all([
    db.contactMessage.count(),
    db.contactMessage.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    messages,
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

  const { id, read } = await req.json();
  const message = await db.contactMessage.update({ where: { id }, data: { read } });
  await createAuditLog({
    action: "UPDATE",
    entity: "Message",
    entityId: message.id,
    userId: user.id as string,
    details: JSON.stringify({ read }),
  });
  return NextResponse.json(message);
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.contactMessage.delete({ where: { id } });
  await createAuditLog({
    action: "DELETE",
    entity: "Message",
    entityId: id,
    userId: user.id as string,
  });
  return NextResponse.json({ success: true });
});
