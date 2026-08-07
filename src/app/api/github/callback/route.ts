import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { exchangeCodeForToken, githubFetch, type GitHubUser } from "@/lib/github";

export async function GET(req: NextRequest) {
  const user = await requireAdmin();

  const origin = req.nextUrl.origin;
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const expectedState = req.cookies.get("github_oauth_state")?.value;

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL("/admin/github?error=state", origin));
  }

  try {
    const token = await exchangeCodeForToken(code);
    const ghUser = await githubFetch<GitHubUser>(token.access_token, "/user");

    await db.githubConnection.upsert({
      where: { userId: user.id as string },
      create: {
        userId: user.id as string,
        githubId: ghUser.id,
        login: ghUser.login,
        name: ghUser.name,
        avatarUrl: ghUser.avatar_url,
        accessToken: token.access_token,
        scope: token.scope,
      },
      update: {
        githubId: ghUser.id,
        login: ghUser.login,
        name: ghUser.name,
        avatarUrl: ghUser.avatar_url,
        accessToken: token.access_token,
        scope: token.scope,
      },
    });
  } catch {
    return NextResponse.redirect(new URL("/admin/github?error=github", origin));
  }

  const res = NextResponse.redirect(new URL("/admin/github?connected=1", origin));
  res.cookies.delete("github_oauth_state");
  return res;
}
