import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { MobileReleaseRepository } from "@/modules/mobile-builder/database/repository";
import { type ReleaseStatus } from "@prisma/client";

const repo = new MobileReleaseRepository();

export const GET = safeHandler(async () => {
  await requireAdmin();
  const releases = await repo.getAll();
  return NextResponse.json(releases);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();
  const body = await req.json();
  const { appId, version, buildId, changelog, status } = body as {
    appId: string;
    version: string;
    buildId?: string;
    changelog?: string;
    status?: ReleaseStatus;
  };

  const release = await repo.create({ appId, version, buildId, changelog, status });
  await createAuditLog({
    action: "APP_RELEASED",
    entity: "MobileRelease",
    entityId: release.id,
    userId: user.id as string,
    details: JSON.stringify({ appId, version, status: status ?? "DRAFT" }),
  });

  return NextResponse.json(release, { status: 201 });
});

export const PUT = safeHandler(async (req: Request) => {
  const user = await requireAdmin();
  const body = await req.json();
  const { id, version, status, changelog, buildId } = body as {
    id: string;
    version?: string;
    status?: ReleaseStatus;
    changelog?: string;
    buildId?: string | null;
  };

  const release = await repo.update(id, { version, status, changelog, buildId });
  await createAuditLog({
    action: "APP_RELEASED",
    entity: "MobileRelease",
    entityId: id,
    userId: user.id as string,
    details: JSON.stringify({
      appId: release.appId,
      version: release.version,
      status: release.status,
    }),
  });

  return NextResponse.json(release);
});
