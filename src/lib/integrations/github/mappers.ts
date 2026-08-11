import { db } from "@/lib/prisma";
import type { GitHubRepo } from "./types";
import { AppError, ErrorCode } from "@/lib/errors";

export interface MappedRepository {
  githubId: number;
  owner: string;
  name: string;
  fullName: string;
  url: string;
  defaultBranch: string;
  visibility: string;
  language: string | null;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  archived: boolean;
  updatedAt: string;
}

export function mapGitHubRepo(gh: GitHubRepo): MappedRepository {
  return {
    githubId: gh.id,
    owner: gh.owner.login,
    name: gh.name,
    fullName: gh.full_name,
    url: gh.html_url,
    defaultBranch: gh.default_branch,
    visibility: gh.visibility,
    language: gh.language,
    description: gh.description,
    stars: gh.stargazers_count,
    forks: gh.forks_count,
    openIssues: gh.open_issues_count,
    archived: gh.archived,
    updatedAt: gh.updated_at,
  };
}

export function splitRepoIdentifier(identifier: string): { owner: string; name: string } {
  const [owner, name] = identifier.split("/");
  if (!owner || !name) {
    throw new AppError(
      "Identifiant de dépôt invalide. Utilisez le format owner/name.",
      400,
      ErrorCode.BAD_REQUEST,
    );
  }
  return { owner, name };
}

export async function getOrCreateRepository(input: {
  githubId: number;
  owner: string;
  name: string;
  fullName: string;
  url: string;
  defaultBranch: string;
  visibility: string;
  language: string | null;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  archived: boolean;
  updatedAt: string;
  projectId?: string | null;
}) {
  const { githubId, owner, name, projectId, ...rest } = input;
  const project = projectId ? { connect: { id: projectId } } : undefined;
  return db.gitHubRepository.upsert({
    where: { githubId: BigInt(githubId) },
    create: {
      githubId: BigInt(githubId),
      ...rest,
      owner,
      name,
      project,
    },
    update: {
      ...rest,
      owner,
      name,
      project,
      lastSyncAt: new Date(),
    },
  });
}
