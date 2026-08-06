import { handlers } from "@/auth";
import { NextResponse, type NextRequest } from "next/server";
import { isAppError } from "@/lib/errors";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const { GET, POST: nextAuthPost } = handlers;

export { GET };

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    if (url.pathname.endsWith("/callback/credentials")) {
      await rateLimit(`login:${getClientIp(req)}`, { windowMs: 60_000, max: 10 });
    }
    return nextAuthPost(req);
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status, headers: error.headers },
      );
    }
    throw error;
  }
}
