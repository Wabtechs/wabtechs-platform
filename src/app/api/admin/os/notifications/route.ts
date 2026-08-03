import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const url = new URL(req.url);
  const unreadOnly = url.searchParams.get("unread") === "true";
  const notifications = await db.notification.findMany({
    where: { userId: user.id as string, ...(unreadOnly ? { read: false } : {}) },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(notifications);
});

export const PATCH = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id, all } = await req.json();
  if (all) {
    await db.notification.updateMany({ where: { userId: user.id as string }, data: { read: true } });
    return NextResponse.json({ success: true });
  }
  await db.notification.updateMany({ where: { id, userId: user.id as string }, data: { read: true } });
  return NextResponse.json({ success: true });
});