import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { RoadmapApp } from "./roadmap-app";
import { OsProject, OsModule, OsFeature, OsBug, OsRoadmapItem, RoadmapStats } from "./types";

export const metadata: Metadata = {
  title: "Roadmap — Wabtechs Platform",
  description:
    "Feuille de route interactive du projet Wabtechs Platform. Suivez en temps réel l'avancement des fonctionnalités, modules et bugs.",
};

export const dynamic = "force-dynamic";

const PROJECT_STATUSES = ["ACTIVE", "PLANNING", "PAUSED", "MAINTENANCE"] as const;
const DONE_STATUSES = new Set(["DONE", "RELEASED"]);

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

export default async function RoadmapPage() {
  const projects = await db.osProject.findMany({
    where: { status: { in: [...PROJECT_STATUSES] } },
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

  const projectIds = projects.map((p) => p.id);
  const idSet = { in: projectIds };

  const [modules, features, bugs, roadmapItems] = await Promise.all([
    db.module.findMany({
      where: { projectId: idSet },
      orderBy: [{ project: { name: "asc" } }, { name: "asc" }],
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
    }),
    db.feature.findMany({
      where: { projectId: idSet },
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
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
        bugs: { select: { id: true, title: true, severity: true, status: true } },
        _count: { select: { bugs: true } },
      },
    }),
    db.bug.findMany({
      where: { projectId: idSet },
      orderBy: [{ severity: "asc" }, { createdAt: "desc" }],
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
        assignee: { select: { id: true, name: true, avatar: true } },
      },
    }),
    db.roadmapItem.findMany({
      where: { projectId: idSet },
      orderBy: [{ endDate: "asc" }, { priority: "asc" }],
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
    }),
  ]);

  const featuresWithProgress: OsFeature[] = features.map((f) => {
    const total = f.subtasks.length;
    const done = f.subtasks.filter((s) => s.done).length;
    const progress = total > 0 ? Math.round((done / total) * 100) : statusProgress(f.status);
    return {
      ...f,
      progress,
      subtaskTotal: total,
      subtaskDone: done,
      bugs: f.bugs.map((b) => ({
        id: b.id,
        title: b.title ?? b.id,
        severity: b.severity,
        status: b.status,
      })),
      bugCount: f._count.bugs,
    } as unknown as OsFeature;
  });

  const modulesOut: OsModule[] = modules.map((m) => ({
    ...m,
    featureCount: m._count.features,
    featureProgress: m.progress,
  })) as unknown as OsModule[];

  const featureCounts: Record<string, number> = {};
  for (const f of features) featureCounts[f.status] = (featureCounts[f.status] ?? 0) + 1;
  const bugSeverityCounts: Record<string, number> = {};
  const bugCounts: Record<string, number> = {};
  for (const b of bugs) {
    bugSeverityCounts[b.severity] = (bugSeverityCounts[b.severity] ?? 0) + 1;
    bugCounts[b.status] = (bugCounts[b.status] ?? 0) + 1;
  }

  const featureTotal = features.length;
  const featureDone = (featureCounts.DONE ?? 0) + (featureCounts.RELEASED ?? 0);
  const featureInProgress =
    (featureCounts.DEVELOPMENT ?? 0) +
    (featureCounts.REVIEW ?? 0) +
    (featureCounts.TESTING ?? 0) +
    (featureCounts.VALIDATION ?? 0);
  const featurePlanned = (featureCounts.PLANNED ?? 0) + (featureCounts.READY ?? 0);
  const featureBacklog = featureCounts.BACKLOG ?? 0;

  const bugOpen =
    (bugCounts.NEW ?? 0) +
    (bugCounts.TRIAGED ?? 0) +
    (bugCounts.IN_PROGRESS ?? 0) +
    (bugCounts.FIXED ?? 0) +
    (bugCounts.VERIFIED ?? 0);
  const bugCritical = (bugSeverityCounts.CRITICAL ?? 0) + (bugSeverityCounts.BLOCKER ?? 0);

  const moduleCount = modules.length;
  const moduleDone = modules.filter((m) => DONE_STATUSES.has(m.status)).length;

  const projectProgress =
    featuresWithProgress.length > 0
      ? Math.round(
          featuresWithProgress.reduce((a, f) => a + f.progress, 0) / featuresWithProgress.length,
        )
      : 0;

  const stats: RoadmapStats = {
    projectProgress,
    featureTotal,
    featureDone,
    featureInProgress,
    featurePlanned,
    featureBacklog,
    bugOpen,
    bugCritical,
    bugSeverityCounts,
    moduleCount,
    moduleDone,
    roadmapCount: roadmapItems.length,
    featureCounts,
  };

  return (
    <RoadmapApp
      initialStats={stats}
      initialProjects={projects as unknown as OsProject[]}
      initialModules={modulesOut}
      initialFeatures={featuresWithProgress}
      initialBugs={bugs as unknown as OsBug[]}
      initialRoadmapItems={roadmapItems as unknown as OsRoadmapItem[]}
    />
  );
}
