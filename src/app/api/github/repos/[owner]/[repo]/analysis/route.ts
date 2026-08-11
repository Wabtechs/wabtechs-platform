import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { AppError, ErrorCode } from "@/lib/errors";
import { githubFetch, githubPaginate } from "@/lib/github";
import { safeHandler } from "@/lib/safe-handler";

interface GitHubContributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

interface GitHubRelease {
  tag_name: string;
  published_at: string;
}

interface GitHubRepoDetail {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;
  language: string | null;
  description: string | null;
  license: { spdx_id: string | null } | null;
  pushed_at: string;
}

export const GET = safeHandler(
  async (_req: Request, { params }: { params: Promise<{ owner: string; repo: string }> }) => {
    const user = await requireAdmin();
    const { owner, repo } = await params;

    const connection = await db.githubConnection.findUnique({
      where: { userId: user.id as string },
    });
    if (!connection) {
      throw new AppError("Votre compte GitHub n’est pas connecté.", 401, ErrorCode.UNAUTHORIZED);
    }

    const token = connection.accessToken;
    const base = `/repos/${owner}/${repo}`;
    const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    const [detail, languages, recentCommits, contributors, pulls] = await Promise.all([
      githubFetch<GitHubRepoDetail>(token, base),
      githubFetch<Record<string, number>>(token, `${base}/languages`),
      githubPaginate<unknown>(token, `${base}/commits?since=${since}&per_page=1`),
      githubFetch<GitHubContributor[]>(token, `${base}/contributors?per_page=10`),
      githubPaginate<unknown>(token, `${base}/pulls?state=open&per_page=1`),
    ]);

    let latestRelease: GitHubRelease | null = null;
    try {
      latestRelease = await githubFetch<GitHubRelease>(token, `${base}/releases/latest`);
    } catch (error) {
      if (!(error instanceof AppError && error.code === ErrorCode.NOT_FOUND)) throw error;
    }

    const totalBytes = Object.values(languages).reduce((sum, b) => sum + b, 0);
    const languageStats = Object.entries(languages)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percent: totalBytes > 0 ? Math.round((bytes / totalBytes) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.bytes - a.bytes);

    return NextResponse.json({
      fullName: `${owner}/${repo}`,
      language: detail.language,
      description: detail.description,
      stars: detail.stargazers_count,
      forks: detail.forks_count,
      watchers: detail.watchers_count,
      openIssues: Math.max(0, detail.open_issues_count - pulls.total),
      openPulls: pulls.total,
      license: detail.license?.spdx_id ?? null,
      pushedAt: detail.pushed_at,
      defaultBranch: detail.default_branch,
      commits90d: recentCommits.total,
      languageStats,
      contributors: contributors.map((c) => ({
        login: c.login,
        avatarUrl: c.avatar_url,
        contributions: c.contributions,
      })),
      latestRelease: latestRelease
        ? { tag: latestRelease.tag_name, publishedAt: latestRelease.published_at }
        : null,
    });
  },
);
