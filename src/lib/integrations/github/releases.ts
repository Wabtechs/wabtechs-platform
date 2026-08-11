import { db } from "@/lib/prisma";
import type { GitHubClient } from "./client";
import { githubListAll } from "./client";
import type { GitHubRelease } from "./types";

export async function listRepositoryReleases(client: GitHubClient, owner: string, name: string) {
  return githubListAll<GitHubRelease>(client, `/repos/${owner}/${name}/releases?per_page=100`);
}

export async function listProjectGitHubReleases(projectId: string) {
  return db.gitHubRelease.findMany({
    where: { projectId },
    orderBy: { publishedAt: "desc" },
  });
}

export async function linkGitHubReleaseToOsRelease(osReleaseId: string, ghRelease: { id: string }) {
  await db.gitHubRelease.update({
    where: { id: ghRelease.id },
    data: { osReleaseId: osReleaseId || null },
  });
}

export async function unlinkGitHubRelease(osReleaseId: string) {
  await db.gitHubRelease.updateMany({
    where: { osReleaseId },
    data: { osReleaseId: null },
  });
}

export function mapRelease(gh: GitHubRelease, repositoryId: string, projectId?: string | null) {
  return {
    githubId: BigInt(gh.id),
    repositoryId,
    tagName: gh.tag_name,
    name: gh.name ?? gh.tag_name,
    body: gh.body,
    htmlUrl: gh.html_url,
    publishedAt: gh.published_at ? new Date(gh.published_at) : null,
    projectId: projectId ?? null,
  };
}

export async function findGitHubRelease(repositoryId: string, githubId: number) {
  return db.gitHubRelease.findUnique({
    where: { repositoryId_githubId: { repositoryId, githubId: BigInt(githubId) } },
  });
}
