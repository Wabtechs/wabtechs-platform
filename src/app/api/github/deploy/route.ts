import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { isAppError } from "@/lib/errors";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { triggerVercelDeploy } from "@/lib/vercel";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    await rateLimit(`deploy:${getClientIp(req)}`, { windowMs: 60_000, max: 3 });

    const deployment = await triggerVercelDeploy();

    return NextResponse.json(deployment, { status: 201 });
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status, headers: error.headers },
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
