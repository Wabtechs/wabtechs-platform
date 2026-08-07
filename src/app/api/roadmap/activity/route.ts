import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const revalidate = 30;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? "20");

  const activity = await db.auditLog.findMany({
    select: {
      id: true,
      action: true,
      entity: true,
      entityId: true,
      details: true,
      createdAt: true,
      user: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: "desc" },
    take: Math.max(1, Math.min(limit, 50)),
  });

  return NextResponse.json(
    activity.map((a) => ({
      id: a.id,
      action: a.action,
      entity: a.entity,
      entityId: a.entityId,
      details: a.details,
      createdAt: a.createdAt.toISOString(),
      userName: a.user?.name ?? null,
      avatar: a.user?.avatar ?? null,
    })),
  );
}
