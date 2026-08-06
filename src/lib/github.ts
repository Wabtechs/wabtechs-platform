import { AppError, ErrorCode } from "@/lib/errors";

const GITHUB_API = "https://api.github.com";
const GITHUB_AUTH = "https://github.com/login/oauth";

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  email: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  archived: boolean;
  updated_at: string;
  owner: { login: string; avatar_url: string };
}

export interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  error?: string;
  error_description?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export function getGitHubOAuthConfig() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  return {
    clientId,
    clientSecret,
    redirectUri: `${baseUrl}/api/github/callback`,
  };
}

async function request(token: string, path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "wabtechs-platform",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new AppError("Ressource GitHub introuvable", 404, ErrorCode.NOT_FOUND);
    }
    if (res.status === 401) {
      throw new AppError("Accès GitHub révoqué", 401, ErrorCode.UNAUTHORIZED);
    }
    if (res.status === 403 || res.status === 429) {
      throw new AppError("Limite de l'API GitHub atteinte", 429, ErrorCode.TOO_MANY_REQUESTS);
    }
    throw new AppError(`Erreur GitHub (${res.status})`, 502, ErrorCode.INTERNAL);
  }

  return res;
}

export async function githubFetch<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const res = await request(token, path, init);
  return (await res.json()) as T;
}

export async function githubPaginate<T>(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<PaginatedResult<T>> {
  const res = await request(token, path, init);
  const items = (await res.json()) as T[];

  const link = res.headers.get("link");
  const lastMatch = link?.match(/<[^>]*[?&]page=(\d+)>;\s*rel="last"/);
  const total = lastMatch ? Number(lastMatch[1]) : items.length;

  return { items, total };
}

export async function exchangeCodeForToken(code: string): Promise<GitHubTokenResponse> {
  const config = getGitHubOAuthConfig();
  if (!config) {
    throw new AppError("GitHub OAuth non configuré", 503, ErrorCode.INTERNAL);
  }

  const res = await fetch(`${GITHUB_AUTH}/access_token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "wabtechs-platform",
    },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
    }),
  });

  const data = (await res.json()) as GitHubTokenResponse;

  if (!res.ok || !data.access_token || data.error) {
    throw new AppError(
      data.error_description ?? "Échange du code GitHub impossible",
      400,
      ErrorCode.BAD_REQUEST,
    );
  }

  return data;
}

export function getAuthorizeUrl(state: string): string {
  const config = getGitHubOAuthConfig();
  if (!config) {
    throw new AppError("GitHub OAuth non configuré", 503, ErrorCode.INTERNAL);
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: "repo,read:user,user:email",
    state,
  });

  return `${GITHUB_AUTH}/authorize?${params.toString()}`;
}
