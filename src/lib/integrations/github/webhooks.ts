import { createHmac, timingSafeEqual } from "crypto";

export const GITHUB_EVENT_TYPES = [
  "push",
  "issues",
  "pull_request",
  "release",
  "workflow_run",
  "repository",
] as const;

export type GitHubEventType = (typeof GITHUB_EVENT_TYPES)[number];

export function verifyGitHubSignature(
  payload: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature || !secret) return false;
  const expected = signature.replace(/^sha256=/, "");
  const hmac = createHmac("sha256", secret);
  hmac.update(payload, "utf8");
  const digest = hmac.digest("hex");
  const a = Buffer.from(digest, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || a.length === 0) return false;
  return timingSafeEqual(a, b);
}

export function githubEventSignature(event: unknown): event is GitHubEventType {
  return typeof event === "string" && (GITHUB_EVENT_TYPES as readonly string[]).includes(event);
}

export interface ProcessedWebhook {
  event: GitHubEventType;
  action?: string;
  repositoryId?: number;
  repositoryFullName?: string;
  owner?: string;
  name?: string;
  number?: number;
  ref?: string;
  after?: string;
}

export interface GitHubWebhookPayload {
  action?: string;
  repository?: {
    id: number;
    name: string;
    full_name: string;
    owner: { login: string };
    default_branch: string;
  };
  number?: number;
  ref?: string;
  after?: string;
  [key: string]: unknown;
}

export function parseWebhookEvent(event: string, payload: GitHubWebhookPayload): ProcessedWebhook {
  const base: ProcessedWebhook = {
    event: event as GitHubEventType,
    action: payload?.action,
    repositoryId: payload?.repository?.id,
    repositoryFullName: payload?.repository?.full_name,
    owner: payload?.repository?.owner?.login,
    name: payload?.repository?.name,
  };
  if (event === "issues" || event === "pull_request") {
    base.number = payload?.number;
  }
  if (event === "push") {
    base.ref = payload?.ref;
    base.after = payload?.after;
  }
  return base;
}
