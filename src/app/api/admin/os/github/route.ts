import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  const user = await requireAdmin();

  const connection = await db.githubConnection.findUnique({
    where: { userId: user.id as string },
    select: { login: true, name: true, avatarUrl: true, scope: true, lastSyncAt: true },
  });

  if (!connection) {
    return NextResponse.json({ connected: false, linkedRepos: [], stats: emptyStats });
  }

  const linkedRepos = await db.gitHubRepository.findMany({
    orderBy: { updatedAt: "desc" },
    include: { project: { select: { id: true, slug: true, name: true, color: true } } },
  });

  const [issues, pullRequests, commits, releases, workflowRuns] = await Promise.all([
    db.gitHubIssue.count({ where: { repository: { projectId: { not: null } } } }).catch(() => 0),
    db.gitHubPullRequest
      .count({ where: { repository: { projectId: { not: null } } } })
      .catch(() => 0),
    db.gitHubCommit.count({ where: { repository: { projectId: { not: null } } } }).catch(() => 0),
    db.gitHubRelease.count({ where: { repository: { projectId: { not: null } } } }).catch(() => 0),
    db.gitHubWorkflowRun
      .count({ where: { repository: { projectId: { not: null } } } })
      .catch(() => 0),
  ]);

  return NextResponse.json({
    connected: true,
    connection: {
      login: connection.login,
      name: connection.name,
      avatarUrl: connection.avatarUrl,
      scope: connection.scope,
      lastSyncAt: connection.lastSyncAt,
    },
    linkedRepos: linkedRepos.map((r) => ({
      id: r.id,
      githubId: r.githubId,
      owner: r.owner,
      name: r.name,
      fullName: r.fullName,
      url: r.url,
      defaultBranch: r.defaultBranch,
      visibility: r.visibility,
      language: r.language,
      description: r.description,
      stars: r.stars,
      forks: r.forks,
      openIssues: r.openIssues,
      archived: r.archived,
      status: r.status,
      lastSyncAt: r.lastSyncAt,
      project: r.project,
    })),
    stats: {
      repositories: linkedRepos.length,
      issues,
      pullRequests,
      commits,
      releases,
      workflowRuns,
    },
  });
});

const emptyStats = {
  repositories: 0,
  issues: 0,
  pullRequests: 0,
  commits: 0,
  releases: 0,
  workflowRuns: 0,
};
