import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  const user = await requireAdmin();

  const connection = await db.githubConnection.findUnique({
    where: { userId: user.id as string },
  });

  return NextResponse.json({
    connected: Boolean(connection),
    login: connection?.login ?? null,
    name: connection?.name ?? null,
    avatarUrl: connection?.avatarUrl ?? null,
    scope: connection?.scope ?? null,
  });
});

export const DELETE = safeHandler(async () => {
  const user = await requireAdmin();

  await db.githubConnection.deleteMany({
    where: { userId: user.id as string },
  });

  return NextResponse.json({ success: true });
});
