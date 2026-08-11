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
  visibility: "public" | "private" | string;
  updated_at: string;
  owner: { login: string; avatar_url: string };
}

export interface GitHubLabel {
  id: number;
  name: string;
  color: string | null;
  default: boolean;
}

export interface GitHubAssignee {
  id: number;
  login: string;
  avatar_url: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  html_url: string;
  labels: GitHubLabel[];
  assignees: GitHubAssignee[];
  user: { login: string; avatar_url: string } | null;
  pull_request?: { url: string; html_url: string };
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  html_url: string;
  user: { login: string } | null;
  head: { ref: string; sha: string };
  base: { ref: string; sha: string };
  merged: boolean;
  merge_commit_sha: string | null;
  merged_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; email: string; date: string };
    committer: { name: string; email: string; date: string };
  };
  author: { login: string } | null;
  committer: { login: string } | null;
  html_url: string;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string | null;
  body: string | null;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  created_at: string;
  author: { login: string } | null;
  assets: Array<{ name: string; browser_download_url: string; size: number }>;
}

export interface GitHubWorkflowRun {
  id: number;
  run_number: number;
  name: string | null;
  workflow_id: number;
  head_branch: string | null;
  head_sha: string;
  status: "queued" | "in_progress" | "completed";
  conclusion:
    "success" | "failure" | "neutral" | "cancelled" | "skipped" | "action_required" | null;
  html_url: string;
  created_at: string;
  updated_at: string | null;
}

export interface GitHubBranch {
  name: string;
  commit: { sha: string; url: string };
}

export type WebhookEvent =
  "push" | "issues" | "pull_request" | "release" | "workflow_run" | "repository";

export interface GitHubWebhookPayload {
  action?: string;
  repository?: {
    id: number;
    name: string;
    full_name: string;
    owner: { login: string };
    default_branch: string;
  };
  [key: string]: unknown;
}

export interface GitHubSyncSummary {
  repositories: number;
  issues: number;
  pullRequests: number;
  commits: number;
  releases: number;
  workflowRuns: number;
  lastSyncAt: Date;
  status: "synced" | "error";
}
