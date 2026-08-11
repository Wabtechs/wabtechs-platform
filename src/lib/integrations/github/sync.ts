import { db } from "@/lib/prisma";
import type { GitHubClient } from "./client";
import { splitRepoIdentifier, getOrCreateRepository } from "./mappers";
import { listRepositoryIssues, mapIssue } from "./issues";
import { listRepositoryPullRequests, mapPullRequest } from "./pull-requests";
import { listRepositoryCommits, mapCommit } from "./commits";
import { listRepositoryReleases, mapRelease } from "./releases";
import { listRepositoryWorkflowRuns, mapWorkflowRun, summarizeCiStatus } from "./actions";

export interface SyncResult {
  repositoryId: string;
  fullName: string;
  counts: {
    issues: number;
    pullRequests: number;
    commits: number;
    releases: number;
    workflowRuns: number;
  };
  ciStatus: string;
  lastSyncAt: Date;
}

export interface GlobalSyncResult {
  summary: {
    repositories: number;
    issues: number;
    pullRequests: number;
    commits: number;
    releases: number;
    workflowRuns: number;
    ciStatus: string;
  };
  lastSyncAt: Date;
  synced: number;
  errors: string[];
}

export async function syncRepository(
  client: GitHubClient,
  identifier: string,
): Promise<SyncResult> {
  const { owner, name } = splitRepoIdentifier(identifier);

  const repoInfo = await client.fetch<
    { full_name: string; default_branch: string; visibility: string } & Record<string, unknown>
  >(`/repos/${owner}/${name}`);

  const repo = await getOrCreateRepository({
    githubId: repoInfo.id as number,
    owner,
    name,
    fullName: repoInfo.full_name,
    url: repoInfo.html_url as string,
    defaultBranch: repoInfo.default_branch,
    visibility: repoInfo.visibility,
    language: (repoInfo.language as string) ?? null,
    description: (repoInfo.description as string) ?? null,
    stars: (repoInfo.stargazers_count as number) ?? 0,
    forks: (repoInfo.forks_count as number) ?? 0,
    openIssues: (repoInfo.open_issues_count as number) ?? 0,
    archived: (repoInfo.archived as boolean) ?? false,
    updatedAt: repoInfo.updated_at as string,
    projectId: undefined,
  });

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [issues, pulls, releases, commits, runs] = await Promise.all([
    listRepositoryIssues(client, owner, name, "all").catch(() => []),
    listRepositoryPullRequests(client, owner, name, "all").catch(() => []),
    listRepositoryReleases(client, owner, name).catch(() => []),
    listRepositoryCommits(client, owner, name, repoInfo.default_branch, since).catch(() => []),
    listRepositoryWorkflowRuns(client, owner, name).catch(() => []),
  ]);

  let issueCount = 0;
  for (const gh of issues) {
    await upsertIssue(client, repo.id, gh);
    issueCount++;
  }
  let prCount = 0;
  for (const gh of pulls) {
    await upsertPullRequest(client, repo.id, gh);
    prCount++;
  }
  let releaseCount = 0;
  for (const gh of releases) {
    await upsertRelease(client, repo.id, gh);
    releaseCount++;
  }
  let commitCount = 0;
  const existingCommits = await db.gitHubCommit.findMany({
    where: { repositoryId: repo.id },
    select: { sha: true },
  });
  const existingShas = new Set(existingCommits.map((c) => c.sha));
  for (const gh of commits) {
    if (existingShas.has(gh.sha)) continue;
    await db.gitHubCommit.create({
      data: mapCommit(gh, repo.id, repo.projectId ?? null),
    });
    commitCount++;
  }
  let runCount = 0;
  for (const gh of runs) {
    await upsertWorkflowRun(client, repo.id, gh);
    runCount++;
  }

  const ciStatus = summarizeCiStatus(runs);

  await db.gitHubRepository.update({
    where: { id: repo.id },
    data: { status: "SYNCED", lastSyncAt: new Date() },
  });

  return {
    repositoryId: repo.id,
    fullName: repo.fullName,
    counts: {
      issues: issueCount,
      pullRequests: prCount,
      commits: commitCount,
      releases: releaseCount,
      workflowRuns: runCount,
    },
    ciStatus,
    lastSyncAt: new Date(),
  };
}

async function upsertIssue(
  _client: GitHubClient,
  repositoryId: string,
  gh: import("./types").GitHubIssue,
) {
  const data = mapIssue(gh, repositoryId, undefined, undefined, undefined);
  await db.gitHubIssue.upsert({
    where: { repositoryId_githubId: { repositoryId, githubId: BigInt(gh.id) } },
    create: data,
    update: data,
  });
}

async function upsertPullRequest(
  _client: GitHubClient,
  repositoryId: string,
  gh: import("./types").GitHubPullRequest,
) {
  const data = mapPullRequest(gh, repositoryId, undefined);
  await db.gitHubPullRequest.upsert({
    where: { repositoryId_githubId: { repositoryId, githubId: BigInt(gh.id) } },
    create: data,
    update: data,
  });
}

async function upsertRelease(
  _client: GitHubClient,
  repositoryId: string,
  gh: import("./types").GitHubRelease,
) {
  const data = mapRelease(gh, repositoryId, undefined);
  await db.gitHubRelease.upsert({
    where: { repositoryId_githubId: { repositoryId, githubId: BigInt(gh.id) } },
    create: data,
    update: data,
  });
}

async function upsertWorkflowRun(
  _client: GitHubClient,
  repositoryId: string,
  gh: import("./types").GitHubWorkflowRun,
) {
  const data = mapWorkflowRun(gh, repositoryId, undefined);
  await db.gitHubWorkflowRun.upsert({
    where: { repositoryId_githubId: { repositoryId, githubId: BigInt(gh.id) } },
    create: data,
    update: data,
  });
}

export async function syncAll(client: GitHubClient): Promise<GlobalSyncResult> {
  const repos = await db.gitHubRepository.findMany();
  const errors: string[] = [];
  const summed = { issues: 0, pullRequests: 0, commits: 0, releases: 0, workflowRuns: 0 };
  let ciStatus = "idle";

  for (const repo of repos) {
    try {
      const result = await syncRepository(client, `${repo.owner}/${repo.name}`);
      summed.issues += result.counts.issues;
      summed.pullRequests += result.counts.pullRequests;
      summed.commits += result.counts.commits;
      summed.releases += result.counts.releases;
      summed.workflowRuns += result.counts.workflowRuns;
      if (result.ciStatus !== "idle" && result.ciStatus !== "success") ciStatus = result.ciStatus;
      if (result.ciStatus === "success" && ciStatus === "idle") ciStatus = result.ciStatus;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${repo.fullName}: ${msg}`);
    }
  }

  return {
    summary: {
      repositories: repos.length,
      ...summed,
      ciStatus,
    },
    lastSyncAt: new Date(),
    synced: repos.length,
    errors,
  };
}
