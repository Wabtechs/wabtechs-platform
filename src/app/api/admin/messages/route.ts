import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();

  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(messages);
});

export const PATCH = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id, read } = await req.json();
  const message = await db.contactMessage.update({ where: { id }, data: { read } });
  await createAuditLog({ action: "UPDATE", entity: "Message", entityId: message.id, userId: user.id as string, details: JSON.stringify({ read }) });
  return NextResponse.json(message);
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.contactMessage.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Message", entityId: id, userId: user.id as string });
  return NextResponse.json({ success: true });
});