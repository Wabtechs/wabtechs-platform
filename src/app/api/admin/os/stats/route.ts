import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { summarizeCiRuns, repoHealthScore, commitsPerDay } from "@/lib/os-github";

export const GET = safeHandler(async () => {
  const user = await requireAdmin();

  const [
    repos,
    issueGroups,
    prGroups,
    releases,
    notifications,
    commits,
    runs,
    openIssues,
    openPrs,
  ] = await Promise.all([
    db.gitHubRepository.findMany({
      orderBy: { fullName: "asc" },
      include: { _count: { select: { issues: true, pullRequests: true } } },
    }),
    db.gitHubIssue.groupBy({
      by: ["repositoryId", "state"],
      where: { isPr: false },
      _count: { _all: true },
    }),
    db.gitHubPullRequest.groupBy({
      by: ["repositoryId", "state", "merged"],
      _count: { _all: true },
    }),
    db.gitHubRelease.findMany({
      orderBy: { publishedAt: "desc" },
      take: 6,
      include: { repository: { select: { id: true, fullName: true } } },
    }),
    db.notification.findMany({
      where: { userId: user.id as string, read: false },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.gitHubCommit.findMany({ select: { committedAt: true } }),
    db.gitHubWorkflowRun.findMany({
      select: { repositoryId: true, conclusion: true },
      orderBy: { createdAt: "desc" },
      take: 300,
    }),
    db.gitHubIssue.findMany({
      where: { isPr: false, state: "open" },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
    db.gitHubPullRequest.findMany({
      where: { state: "open", merged: false },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
  ]);

  const issueCount = new Map<string, { open: number; closed: number }>();
  for (const g of issueGroups) {
    const entry = issueCount.get(g.repositoryId) ?? { open: 0, closed: 0 };
    if (g.state === "open") entry.open += g._count._all;
    else entry.closed += g._count._all;
    issueCount.set(g.repositoryId, entry);
  }

  const prCount = new Map<
    string,
    { merged: number; total: number; open: number; closed: number }
  >();
  for (const g of prGroups) {
    const entry = prCount.get(g.repositoryId) ?? { merged: 0, total: 0, open: 0, closed: 0 };
    entry.total += g._count._all;
    if (g.merged) entry.merged += g._count._all;
    if (g.state === "open") entry.open += g._count._all;
    if (g.state === "closed" && !g.merged) entry.closed += g._count._all;
    prCount.set(g.repositoryId, entry);
  }

  const ciByRepo = new Map<string, ReturnType<typeof summarizeCiRuns>>();
  for (const repo of repos) {
    const repoRuns = runs.filter((r) => r.repositoryId === repo.id);
    ciByRepo.set(repo.id, summarizeCiRuns(repoRuns));
  }

  const projects = repos.map((repo) => {
    const issues = issueCount.get(repo.id) ?? { open: 0, closed: 0 };
    const prs = prCount.get(repo.id) ?? { merged: 0, total: 0, open: 0, closed: 0 };
    const ci = ciByRepo.get(repo.id) ?? summarizeCiRuns([]);
    return {
      id: repo.id,
      slug: repo.id,
      name: repo.fullName,
      color: "#842ae3",
      healthScore: repoHealthScore({
        ciPass: ci.passRate,
        ciTotal: ci.total,
        closedIssues: issues.closed,
        totalIssues: issues.open + issues.closed,
        mergedPrs: prs.merged,
        totalPrs: prs.total,
      }),
      mrr: 0,
      status: "ACTIVE",
      _count: {
        features: prs.total,
        bugs: issues.open + issues.closed,
        objectives: 0,
      },
    };
  });

  const featureCounts: Record<string, number> = {};
  for (const g of prGroups) {
    const key = g.merged ? "MERGED" : g.state.toUpperCase();
    featureCounts[key] = (featureCounts[key] ?? 0) + g._count._all;
  }

  const bugCounts: Record<string, number> = {};
  for (const g of issueGroups) {
    const key = g.state.toUpperCase();
    bugCounts[key] = (bugCounts[key] ?? 0) + g._count._all;
  }

  const featureTotal = Object.values(featureCounts).reduce((a, b) => a + b, 0);
  const featureDone = featureCounts.MERGED ?? 0;
  const bugOpen = bugCounts.OPEN ?? 0;

  const roadmapItems = [
    ...openIssues.map((i) => ({
      id: i.id,
      title: i.title,
      priority: "MEDIUM",
      progress: 0,
      endDate: null,
    })),
    ...openPrs.map((p) => ({
      id: p.id,
      title: p.title,
      priority: "MEDIUM",
      progress: 0,
      endDate: null,
    })),
  ];

  return NextResponse.json({
    projects,
    totals: {
      projects: projects.length,
      activeProjects: projects.length,
      totalMrr: 0,
      avgHealth: projects.length
        ? Math.round((projects.reduce((a, p) => a + p.healthScore, 0) / projects.length) * 10) / 10
        : 0,
      featureTotal,
      featureDone,
      featureProgress: featureTotal ? Math.round((featureDone / featureTotal) * 100) : 0,
      bugOpen,
      bugCritical: 0,
      activeSprints: 0,
      objectivesAtRisk: 0,
      roadmapItems: roadmapItems.length,
    },
    featureCounts,
    bugCounts,
    bugSeverityCounts: {},
    sprintCounts: {},
    objectiveCounts: {},
    releases: releases.map((r) => ({
      id: r.id,
      name: r.tagName,
      project: { slug: r.repository.id, name: r.repository.fullName },
    })),
    milestones: [],
    notifications: notifications.map((n) => ({ id: n.id, title: n.title, content: n.content })),
    roadmapItems,
    growth: commitsPerDay(commits, 30).map((p) => ({
      date: "",
      metric: "commits",
      value: p.commits,
    })),
  });
});
