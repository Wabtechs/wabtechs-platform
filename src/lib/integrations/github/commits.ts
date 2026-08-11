import { db } from "@/lib/prisma";
import type { GitHubClient } from "./client";
import { githubListAll } from "./client";
import type { GitHubCommit } from "./types";

export async function listRepositoryCommits(
  client: GitHubClient,
  owner: string,
  name: string,
  branch?: string,
  since?: string,
) {
  const params = new URLSearchParams();
  params.set("per_page", "100");
  params.set("sha", branch ?? "");
  if (since) params.set("since", since);
  const path = `/repos/${owner}/${name}/commits?${params.toString()}`;
  const commits = await githubListAll<GitHubCommit>(client, path);
  return commits;
}

export async function listProjectCommits(projectId: string, take = 50) {
  return db.gitHubCommit.findMany({
    where: projectId ? { projectId } : undefined,
    orderBy: { committedAt: "desc" },
    take,
    include: { feature: { select: { id: true, title: true } } },
  });
}

export function mapCommit(
  gh: GitHubCommit,
  repositoryId: string,
  projectId?: string | null,
  featureId?: string | null,
) {
  const message = gh.commit?.message ?? "";
  return {
    sha: gh.sha,
    repositoryId,
    message,
    authorName: gh.commit?.author?.name ?? null,
    authorEmail: gh.commit?.author?.email ?? null,
    authorLogin: gh.author?.login ?? gh.committer?.login ?? null,
    url: gh.html_url,
    committedAt: gh.commit?.author?.date ? new Date(gh.commit.author.date) : new Date(),
    projectId: projectId ?? null,
    featureId: featureId ?? null,
    syncedAt: new Date(),
  };
}

export function parseCommitMessage(message: string | null): { summary: string } {
  if (!message) return { summary: "" };
  const first = message.split("\n")[0];
  return { summary: first ?? "" };
}
