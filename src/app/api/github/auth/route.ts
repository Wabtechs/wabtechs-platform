import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/auth-guard";
import { getAuthorizeUrl, getGitHubOAuthConfig } from "@/lib/github";

export async function GET(req: NextRequest) {
  await requireAdmin();

  const config = getGitHubOAuthConfig();
  if (!config) {
    return NextResponse.json(
      {
        error:
          "GitHub OAuth non configuré. Renseignez GITHUB_CLIENT_ID et GITHUB_CLIENT_SECRET dans l'environnement.",
      },
      { status: 503 },
    );
  }

  const origin = req.nextUrl.origin;
  const state = randomUUID();
  const res = NextResponse.redirect(getAuthorizeUrl(state, origin));
  res.cookies.set("github_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    path: "/",
  });
  return res;
}
