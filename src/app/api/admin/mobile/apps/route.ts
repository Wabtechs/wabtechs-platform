import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { MobileAppRepository } from "@/modules/mobile-builder/database/repository";
import type { CreateMobileAppInput } from "@/modules/mobile-builder/types/mobile.types";

const repo = new MobileAppRepository();

export const GET = safeHandler(async () => {
  await requireAdmin();
  const apps = await repo.getAll();
  return NextResponse.json(apps);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();
  const body = await req.json();
  const input = body as CreateMobileAppInput;

  const app = await repo.create(input);
  await createAuditLog({
    action: "APP_CREATED",
    entity: "MobileApp",
    entityId: app.id,
    userId: user.id as string,
    details: JSON.stringify({ name: app.name, packageName: app.packageName }),
  });

  return NextResponse.json(app, { status: 201 });
});
