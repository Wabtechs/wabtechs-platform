import { db } from "@/lib/prisma";
import type { GitHubClient } from "./client";
import type { GitHubIssue } from "./types";

export interface IssueRow {
  id: string;
  githubId: number;
  number: number;
  title: string;
  state: string;
  htmlUrl: string;
  isPr: boolean;
  labels: string[];
  assignees: string[];
  author: string | null;
  bugId: string | null;
  featureId: string | null;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
}

export async function listRepositoryIssues(
  client: GitHubClient,
  owner: string,
  name: string,
  state: "open" | "closed" | "all" = "open",
) {
  return client.fetch<GitHubIssue[]>(
    `/repos/${owner}/${name}/issues?state=${state}&per_page=100&sort=updated`,
  );
}

export async function listProjectIssues(projectId: string) {
  return db.gitHubIssue.findMany({
    where: { projectId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      githubId: true,
      number: true,
      title: true,
      state: true,
      htmlUrl: true,
      isPr: true,
      labels: true,
      assignees: true,
      bugId: true,
      featureId: true,
      createdAt: true,
      updatedAt: true,
      closedAt: true,
    },
  });
}

export async function linkIssueToBug(issueId: string, bugId: string | null) {
  if (bugId) {
    const existing = await db.gitHubIssue.findFirst({ where: { bugId } });
    if (existing && existing.id !== issueId) {
      throw new Error("Cette issue est déjà liée à un autre bug.");
    }
  }
  return db.gitHubIssue.update({ where: { id: issueId }, data: { bugId } });
}

export async function linkIssueToFeature(issueId: string, featureId: string | null) {
  if (featureId) {
    const existing = await db.gitHubIssue.findFirst({ where: { featureId } });
    if (existing && existing.id !== issueId) {
      throw new Error("Cette issue est déjà liée à une autre feature.");
    }
  }
  return db.gitHubIssue.update({ where: { id: issueId }, data: { featureId } });
}

export function mapIssue(
  gh: GitHubIssue,
  repositoryId: string,
  projectId?: string | null,
  bugId?: string | null,
  featureId?: string | null,
) {
  return {
    githubId: BigInt(gh.id),
    repositoryId,
    number: gh.number,
    title: gh.title,
    body: gh.body,
    state: gh.state,
    htmlUrl: gh.html_url,
    labels: gh.labels.map((l) => ({ id: l.id, name: l.name, color: l.color })),
    assignees: gh.assignees.map((a) => ({ id: a.id, login: a.login, avatarUrl: a.avatar_url })),
    isPr: Boolean(gh.pull_request),
    projectId: projectId ?? null,
    bugId: bugId ?? null,
    featureId: featureId ?? null,
    createdAt: gh.created_at ? new Date(gh.created_at) : new Date(),
    updatedAt: gh.updated_at ? new Date(gh.updated_at) : new Date(),
    closedAt: gh.closed_at ? new Date(gh.closed_at) : null,
  };
}
