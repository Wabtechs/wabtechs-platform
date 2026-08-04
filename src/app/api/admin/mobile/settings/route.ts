import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();
  const settings = await db.siteSetting.findMany({
    where: { group: "mobile-builder" },
  });
  return NextResponse.json(settings);
});

export const PUT = safeHandler(async (req: Request) => {
  await requireAdmin();
  const body = await req.json();
  const { key, value } = body as { key: string; value: string };

  const setting = await db.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value, group: "mobile-builder" },
  });

  return NextResponse.json(setting);
});
