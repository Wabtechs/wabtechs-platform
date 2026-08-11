import { db } from "@/lib/prisma";
import type { GitHubClient } from "./client";
import { githubListAll } from "./client";
import type { GitHubPullRequest } from "./types";

export async function listRepositoryPullRequests(
  client: GitHubClient,
  owner: string,
  name: string,
  state: "open" | "closed" | "all" = "all",
) {
  return githubListAll<GitHubPullRequest>(
    client,
    `/repos/${owner}/${name}/pulls?state=${state}&per_page=100&sort=updated`,
  );
}

export async function listProjectPullRequests(projectId: string) {
  return db.gitHubPullRequest.findMany({
    where: { projectId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function linkPullRequest(
  featureId: string,
  pr: { id: string; bugId?: string | null; releaseId?: string | null },
) {
  void featureId;
  return db.gitHubPullRequest.update({
    where: { id: pr.id },
    data: { bugId: pr.bugId ?? null, releaseId: pr.releaseId ?? null },
  });
}

export function mapPullRequest(
  gh: GitHubPullRequest,
  repositoryId: string,
  projectId?: string | null,
) {
  return {
    githubId: BigInt(gh.id),
    repositoryId,
    number: gh.number,
    title: gh.title,
    body: gh.body,
    state: gh.state,
    htmlUrl: gh.html_url,
    author: gh.user?.login ?? null,
    headBranch: gh.head?.ref ?? null,
    baseBranch: gh.base?.ref ?? null,
    merged: gh.merged,
    mergeCommitSha: gh.merge_commit_sha,
    ciStatus: null,
    projectId: projectId ?? null,
    createdAt: gh.created_at ? new Date(gh.created_at) : new Date(),
    updatedAt: gh.updated_at ? new Date(gh.updated_at) : new Date(),
    mergedAt: gh.merged_at ? new Date(gh.merged_at) : null,
    closedAt: gh.closed_at ? new Date(gh.closed_at) : null,
  };
}
