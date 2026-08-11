import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

const patchSchema = z
  .object({
    all: z.boolean().optional(),
    id: z.string().min(1).optional(),
  })
  .refine((v) => v.all === true || v.id, {
    message: "Précisez un identifiant ou all: true.",
    path: ["id"],
  });

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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const parsed = patchSchema.parse(body);

  if (parsed.all) {
    await db.notification.updateMany({
      where: { userId: user.id as string },
      data: { read: true },
    });
    return NextResponse.json({ success: true });
  }

  await db.notification.updateMany({
    where: { id: parsed.id, userId: user.id as string },
    data: { read: true },
  });
  return NextResponse.json({ success: true });
});
