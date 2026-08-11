import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { triggerVercelDeploy } from "@/lib/vercel";
import { safeHandler } from "@/lib/safe-handler";

export const POST = safeHandler(async (req: Request) => {
  await requireAdmin();
  await rateLimit(`deploy:${getClientIp(req)}`, { windowMs: 60_000, max: 3 });

  const deployment = await triggerVercelDeploy();

  return NextResponse.json(deployment, { status: 201 });
});
