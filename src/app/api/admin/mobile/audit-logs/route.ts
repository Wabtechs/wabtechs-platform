import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { MobileAuditLogRepository } from "@/modules/mobile-builder/database/repository";

const repo = new MobileAuditLogRepository();

export const GET = safeHandler(async (req: Request) => {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const appId = searchParams.get("appId");
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  const logs = appId
    ? await repo.getByAppId(appId, limit)
    : await db.mobileAuditLog.findMany({ orderBy: { createdAt: "desc" }, take: limit });

  return NextResponse.json(logs);
});
