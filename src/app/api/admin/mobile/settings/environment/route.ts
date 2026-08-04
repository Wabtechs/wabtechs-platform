import { NextResponse } from "next/server";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { EnvDetectionService } from "@/modules/mobile-builder/utils/env-detection";

export const GET = safeHandler(async () => {
  await requireAdmin();
  const diagnostic = await EnvDetectionService.runDiagnostic();
  return NextResponse.json(diagnostic);
});
