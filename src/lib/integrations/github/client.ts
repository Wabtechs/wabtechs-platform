import { db } from "@/lib/prisma";
import { AppError, ErrorCode } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth-guard";
import { githubFetch, githubPaginate, type PaginatedResult } from "@/lib/github";
import type { GitHubUser } from "./types";

export class GitHubUnconfiguredError extends AppError {
  constructor() {
    super(
      "La connexion GitHub n’est pas configurée. Connectez votre compte depuis /admin/github.",
      401,
      ErrorCode.UNAUTHORIZED,
    );
  }
}

export class GitHubNotConnectedError extends AppError {
  constructor() {
    super("Connectez votre compte GitHub pour accéder à ces données.", 401, ErrorCode.UNAUTHORIZED);
  }
}

export interface GitHubClient {
  token: string;
  baseUrl: string;
  user: GitHubUser;
  fetch<T>(path: string, init?: RequestInit): Promise<T>;
  paginate<T>(path: string, init?: RequestInit): Promise<PaginatedResult<T>>;
}

export async function getGitHubClient(): Promise<GitHubClient> {
  const user = await requireAdmin();
  return getGitHubClientForUser(user.id as string);
}

export async function getGitHubClientForUser(userId: string): Promise<GitHubClient> {
  const connection = await db.githubConnection.findUnique({ where: { userId } });
  if (!connection) throw new GitHubNotConnectedError();

  if (connection.expiresAt && new Date(connection.expiresAt) < new Date(Date.now() + 60_000)) {
    throw new GitHubNotConnectedError();
  }

  const ghUser = await githubFetch<GitHubUser>(connection.accessToken, "/user");

  return {
    token: connection.accessToken,
    baseUrl: "https://api.github.com",
    user: ghUser,
    fetch: (path, init) => githubFetch(connection.accessToken, path, init),
    paginate: (path, init) => githubPaginate(connection.accessToken, path, init),
  };
}

export async function assertGitHubConnected(userId: string): Promise<void> {
  const connection = await db.githubConnection.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!connection) throw new GitHubNotConnectedError();
}

export async function getAnyGitHubClient(): Promise<GitHubClient> {
  const connection = await db.githubConnection.findFirst({
    orderBy: { updatedAt: "desc" },
  });
  if (!connection) throw new GitHubNotConnectedError();

  const ghUser = await githubFetch<GitHubUser>(connection.accessToken, "/user");

  return {
    token: connection.accessToken,
    baseUrl: "https://api.github.com",
    user: ghUser,
    fetch: (path, init) => githubFetch(connection.accessToken, path, init),
    paginate: (path, init) => githubPaginate(connection.accessToken, path, init),
  };
}

function throwForStatus(status: number): never {
  if (status === 404) {
    throw new AppError("La ressource GitHub demandée est introuvable.", 404, ErrorCode.NOT_FOUND);
  }
  if (status === 401) {
    throw new AppError(
      "Votre accès GitHub a été révoqué. Reconnectez votre compte.",
      401,
      ErrorCode.UNAUTHORIZED,
    );
  }
  if (status === 403 || status === 429) {
    throw new AppError(
      "La limite de l’API GitHub est atteinte. Réessayez plus tard.",
      429,
      ErrorCode.TOO_MANY_REQUESTS,
    );
  }
  throw new AppError("GitHub n’a pas pu répondre. Réessayez plus tard.", 502, ErrorCode.INTERNAL);
}

async function listAll<T>(token: string, path: string, maxPages = 10): Promise<T[]> {
  const items: T[] = [];
  let url: string | null = `${"https://api.github.com"}${path}`;
  let pages = 0;
  while (url && pages < maxPages) {
    const res: Response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "wabtechs-platform",
      },
    });
    if (!res.ok) throwForStatus(res.status);
    const data: T[] = (await res.json()) as T[];
    items.push(...data);
    const link: string | null = res.headers.get("link");
    const match: RegExpMatchArray | null = link ? link.match(/<([^>]+)>;\s*rel="next"/) : null;
    url = match?.[1] ?? null;
    pages++;
  }
  return items;
}

export async function githubListAll<T>(
  client: GitHubClient,
  path: string,
  maxPages = 10,
): Promise<T[]> {
  return listAll<T>(client.token, path, maxPages);
}
