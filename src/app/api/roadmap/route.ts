import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { cacheGet, cacheSet } from "@/lib/cache";
import { incrementCounter } from "@/lib/metrics";

export const dynamic = "force-dynamic";

const PROJECT_STATUSES = ["ACTIVE", "PLANNING", "PAUSED", "MAINTENANCE"] as const;

function statusProgress(status: string): number {
  const map: Record<string, number> = {
    BACKLOG: 5,
    PLANNED: 10,
    READY: 25,
    DEVELOPMENT: 55,
    REVIEW: 75,
    TESTING: 85,
    VALIDATION: 90,
    DONE: 100,
    RELEASED: 100,
    ARCHIVED: 100,
  };
  return map[status] ?? 0;
}

export async function GET(req: Request) {
  incrementCounter("/api/roadmap");

  const url = new URL(req.url);
  const projectSlug = url.searchParams.get("project");

  const cacheKey = `aggregate:${projectSlug ?? "all"}`;
  const cached = await cacheGet<unknown>(cacheKey);
  if (cached) return NextResponse.json(cached);

  const projectWhere: Prisma.OsProjectWhereInput = projectSlug
    ? { OR: [{ slug: projectSlug }, { id: projectSlug }] }
    : { status: { in: [...PROJECT_STATUSES] } };

  const projects = await db.osProject.findMany({
    where: projectWhere,
    select: {
      id: true,
      slug: true,
      name: true,
      color: true,
      description: true,
      status: true,
      type: true,
      version: true,
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });

  if (projects.length === 0) {
    return NextResponse.json({
      projects: [],
      stats: emptyStats(),
      modules: [],
      features: [],
      bugs: [],
      roadmapItems: [],
      activity: [],
    });
  }

  const projectIds = projects.map((p) => p.id);
  const idSet = { in: projectIds };

  const [modules, features, bugs, roadmapItems, activity] = await Promise.all([
    db.module.findMany({
      where: { projectId: idSet },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        version: true,
        priority: true,
        complexity: true,
        progress: true,
        testCoverage: true,
        security: true,
        performance: true,
        seo: true,
        accessibility: true,
        maintainability: true,
        technicalDebt: true,
        createdAt: true,
        updatedAt: true,
        project: { select: { id: true, slug: true, name: true, color: true } },
        _count: { select: { features: true } },
      },
      orderBy: [{ project: { name: "asc" } }, { name: "asc" }],
    }),
    db.feature.findMany({
      where: { projectId: idSet },
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        status: true,
        points: true,
        createdAt: true,
        updatedAt: true,
        projectId: true,
        moduleId: true,
        epicId: true,
        sprintId: true,
        assigneeId: true,
        project: { select: { id: true, slug: true, name: true, color: true } },
        module: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, avatar: true } },
        subtasks: { select: { id: true, title: true, done: true } },
        _count: { select: { bugs: true } },
      },
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
    }),
    db.bug.findMany({
      where: { projectId: idSet },
      select: {
        id: true,
        title: true,
        description: true,
        severity: true,
        priority: true,
        status: true,
        impact: true,
        fixHours: true,
        version: true,
        reproduce: true,
        expected: true,
        actual: true,
        fix: true,
        resolvedAt: true,
        createdAt: true,
        updatedAt: true,
        projectId: true,
        featureId: true,
        assigneeId: true,
        project: { select: { id: true, slug: true, name: true, color: true } },
        feature: { select: { id: true, title: true } },
        assignee: { select: { id: true, name: true } },
      },
      orderBy: [{ severity: "asc" }, { createdAt: "desc" }],
    }),
    db.roadmapItem.findMany({
      where: { projectId: idSet },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        priority: true,
        progress: true,
        startDate: true,
        endDate: true,
        estimatedHours: true,
        actualHours: true,
        roi: true,
        impact: true,
        dependencies: true,
        risks: true,
        createdAt: true,
        updatedAt: true,
        project: { select: { id: true, slug: true, name: true, color: true } },
      },
      orderBy: [{ endDate: "asc" }, { priority: "asc" }],
    }),
    db.auditLog.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        details: true,
        createdAt: true,
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  const featuresWithProgress = features.map((f) => {
    const total = f.subtasks.length;
    const done = f.subtasks.filter((s) => s.done).length;
    const progress = total > 0 ? Math.round((done / total) * 100) : statusProgress(f.status);
    return { ...f, progress, subtaskTotal: total, subtaskDone: done };
  });

  const modulesOut = modules.map((m) => ({
    ...m,
    featureCount: m._count.features,
    featureProgress: m.progress,
  }));

  const stats = computeStats(featuresWithProgress, bugs, modules);

  const payload = {
    projects,
    stats,
    modules: modulesOut,
    features: featuresWithProgress,
    bugs,
    roadmapItems,
    activity: activity.map((a) => ({
      ...a,
      userName: a.user?.name ?? null,
    })),
  };

  await cacheSet(cacheKey, payload, 15);
  return NextResponse.json(payload);
}

function emptyStats() {
  return {
    projectProgress: 0,
    featureTotal: 0,
    featureDone: 0,
    featureInProgress: 0,
    featurePlanned: 0,
    featureBacklog: 0,
    bugOpen: 0,
    bugCritical: 0,
    bugClosed: 0,
    moduleCount: 0,
    moduleDone: 0,
    featureCounts: {},
    bugCounts: {},
    bugSeverityCounts: {},
  };
}

function computeStats(
  features: { status: string; progress: number }[],
  bugs: { status: string; severity: string }[],
  modules: { status: string }[],
) {
  const featureCounts: Record<string, number> = {};
  const bugCounts: Record<string, number> = {};
  const bugSeverityCounts: Record<string, number> = {};

  for (const f of features) {
    featureCounts[f.status] = (featureCounts[f.status] ?? 0) + 1;
  }
  for (const b of bugs) {
    bugCounts[b.status] = (bugCounts[b.status] ?? 0) + 1;
    bugSeverityCounts[b.severity] = (bugSeverityCounts[b.severity] ?? 0) + 1;
  }

  const fc = (s: string) => featureCounts[s] ?? 0;
  const bsc = (s: string) => bugSeverityCounts[s] ?? 0;

  const featureDone = fc("DONE") + fc("RELEASED");
  const featureInProgress = fc("DEVELOPMENT") + fc("REVIEW") + fc("TESTING") + fc("VALIDATION");
  const featurePlanned = fc("PLANNED") + fc("READY");
  const featureBacklog = fc("BACKLOG");

  const bugOpen =
    (bugCounts.NEW ?? 0) +
    (bugCounts.TRIAGED ?? 0) +
    (bugCounts.IN_PROGRESS ?? 0) +
    (bugCounts.FIXED ?? 0) +
    (bugCounts.VERIFIED ?? 0);
  const bugCritical = bsc("CRITICAL") + bsc("BLOCKER");
  const bugClosed = (bugCounts.CLOSED ?? 0) + (bugCounts.WONTFIX ?? 0);

  const moduleDone = modules.filter((m) => m.status === "DONE" || m.status === "RELEASED").length;

  const projectProgress =
    features.length > 0
      ? Math.round(features.reduce((a, f) => a + f.progress, 0) / features.length)
      : 0;

  return {
    projectProgress,
    featureTotal: features.length,
    featureDone,
    featureInProgress,
    featurePlanned,
    featureBacklog,
    bugOpen,
    bugCritical,
    bugClosed,
    moduleCount: modules.length,
    moduleDone,
    featureCounts,
    bugCounts,
    bugSeverityCounts,
  };
}
