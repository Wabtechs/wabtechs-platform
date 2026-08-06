import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { githubFetch, type GitHubRepo } from "@/lib/github";

export const GET = safeHandler(async () => {
  const user = await requireAdmin();

  const connection = await db.githubConnection.findUnique({
    where: { userId: user.id as string },
  });
  if (!connection) {
    return NextResponse.json({ repos: [] });
  }

  const repos = await githubFetch<GitHubRepo[]>(
    connection.accessToken,
    "/user/repos?per_page=100&sort=updated",
  );

  return NextResponse.json({
    repos: repos.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      openIssues: r.open_issues_count,
      defaultBranch: r.default_branch,
      archived: r.archived,
      updatedAt: r.updated_at,
      owner: r.owner.login,
    })),
  });
});
