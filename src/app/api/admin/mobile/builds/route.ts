import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { MobileBuildRepository } from "@/modules/mobile-builder/database/repository";
import { type PlatformTarget } from "@prisma/client";

const repo = new MobileBuildRepository();

export const GET = safeHandler(async () => {
  await requireAdmin();
  const builds = await repo.getAll();
  return NextResponse.json(builds);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();
  const body = await req.json();
  const { appId, platform, version } = body as {
    appId: string;
    platform: PlatformTarget;
    version: string;
  };

  const build = await repo.create({ appId, platform, version });
  await createAuditLog({
    action: "BUILD_STARTED",
    entity: "MobileBuild",
    entityId: build.id,
    userId: user.id as string,
    details: JSON.stringify({ appId, platform, version }),
  });

  return NextResponse.json(build, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  await requireAdmin();
  const { id } = await req.json();
  await db.mobileBuild.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
