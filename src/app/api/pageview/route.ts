import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const POST = safeHandler(async (request: Request) => {
  await rateLimit(`pageview:${getClientIp(request)}`, { windowMs: 60_000, max: 60 });

  const { path } = (await request.json()) as { path?: unknown };
  if (typeof path !== "string" || !path.startsWith("/") || path.length > 200) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? "";
  const referer = request.headers.get("referer") ?? "";

  await db.pageView.create({
    data: { path, ip, userAgent, referer },
  });

  return NextResponse.json({ success: true });
});
