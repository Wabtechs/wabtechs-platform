import { db } from "@/lib/prisma";
import { AppError, ErrorCode } from "@/lib/errors";
import type { GitHubClient } from "./client";
import type { GitHubRepo } from "./types";

export interface RepositorySummary {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  archived: boolean;
  visibility: string;
  updatedAt: string;
  owner: string;
}

export async function listAvailableRepositories(
  client: GitHubClient,
): Promise<RepositorySummary[]> {
  const repos = await client.fetch<GitHubRepo[]>(
    `/user/repos?per_page=100&sort=updated&type=all`,
    {},
  );
  const seen = new Set<number>();
  const out: RepositorySummary[] = [];
  for (const r of repos) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    out.push(toSummary(r));
  }

  const orgs = await client
    .fetch<Array<{ login: string }>>("/user/memberships", {})
    .catch(() => []);
  for (const m of orgs) {
    try {
      const orgRepos = await client.fetch<GitHubRepo[]>(
        `/orgs/${m.login}/repos?per_page=100&sort=updated&type=public`,
        {},
      );
      for (const r of orgRepos) {
        if (seen.has(r.id)) continue;
        seen.add(r.id);
        out.push(toSummary(r));
      }
    } catch {
      // ignore inaccessible orgs
    }
  }

  return out;
}

function toSummary(r: GitHubRepo): RepositorySummary {
  return {
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
    visibility: r.visibility,
    updatedAt: r.updated_at,
    owner: r.owner.login,
  };
}

export async function getDefaultBranch(
  client: GitHubClient,
  owner: string,
  name: string,
): Promise<string> {
  try {
    const repo = await client.fetch<{ default_branch: string }>(`/repos/${owner}/${name}`, {});
    return repo.default_branch;
  } catch (error) {
    if (isNotFound(error)) return "main";
    throw error;
  }
}

export function isNotFound(error: unknown): boolean {
  return error instanceof AppError && error.code === ErrorCode.NOT_FOUND;
}

export async function listLinkedRepositories() {
  return db.gitHubRepository.findMany({
    orderBy: { updatedAt: "desc" },
    include: { project: { select: { id: true, slug: true, name: true, color: true } } },
  });
}

export interface LinkRepositoryInput {
  owner: string;
  name: string;
  projectId?: string | null;
}

export async function linkRepository(input: LinkRepositoryInput) {
  const { owner, name, projectId } = input;
  if (!owner || !name) {
    throw new AppError("Owner et nom du dépôt sont requis.", 400, ErrorCode.BAD_REQUEST);
  }

  const [existingByFullName, repo] = await Promise.all([
    db.gitHubRepository.findUnique({
      where: { owner_name: { owner: owner.toLowerCase(), name: name.toLowerCase() } },
    }),
    fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "wabtechs-platform",
      },
    }).then((res) => {
      if (!res.ok) {
        throw new AppError(
          "Le dépôt GitHub est introuvable ou inaccessible.",
          404,
          ErrorCode.NOT_FOUND,
        );
      }
      return res.json() as Promise<GitHubRepo>;
    }),
  ]);

  if (existingByFullName) {
    return db.gitHubRepository.update({
      where: { id: existingByFullName.id },
      data: {
        githubId: BigInt(repo.id),
        fullName: repo.full_name,
        url: repo.html_url,
        defaultBranch: repo.default_branch,
        visibility: repo.visibility,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        archived: repo.archived,
        description: repo.description,
        status: "SYNCED",
        lastSyncAt: new Date(),
        projectId: projectId ?? existingByFullName.projectId,
      },
    });
  }

  return db.gitHubRepository.create({
    data: {
      githubId: BigInt(repo.id),
      owner: repo.owner.login,
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      defaultBranch: repo.default_branch,
      visibility: repo.visibility,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      archived: repo.archived,
      description: repo.description,
      status: "SYNCED",
      lastSyncAt: new Date(),
      projectId: projectId ?? undefined,
    },
  });
}

export async function unlinkRepository(id: string) {
  const repo = await db.gitHubRepository.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!repo) {
    throw new AppError("Repository introuvable.", 404, ErrorCode.NOT_FOUND);
  }
  await db.gitHubRepository.delete({ where: { id } });
}

export async function setRepositoryProject(id: string, projectId?: string | null) {
  await db.gitHubRepository.update({
    where: { id },
    data: { projectId: projectId ?? null },
  });
}
