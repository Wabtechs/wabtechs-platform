import { handlers } from "@/auth";
import type { NextRequest } from "next/server";
import { safeHandler } from "@/lib/safe-handler";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const { GET, POST: nextAuthPost } = handlers;

export { GET };

export const POST = safeHandler(async (req: Request) => {
  const url = new URL(req.url);
  if (url.pathname.endsWith("/callback/credentials")) {
    await rateLimit(`login:${getClientIp(req)}`, { windowMs: 60_000, max: 10 });
  }
  return nextAuthPost(req as NextRequest);
});
