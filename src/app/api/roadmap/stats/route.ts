import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

export async function GET() {
  const [
    featureGroups,
    bugSevGroups,
    moduleCount,
    moduleDone,
    roadmapCount,
    featureTotal,
    featuresWithSubtasks,
  ] = await Promise.all([
    db.feature.groupBy({ by: ["status"], _count: { _all: true } }),
    db.bug.groupBy({ by: ["severity"], _count: { _all: true } }),
    db.module.count(),
    db.module.count({ where: { status: { in: ["DONE", "RELEASED"] } } }),
    db.roadmapItem.count(),
    db.feature.count(),
    db.feature.findMany({ select: { status: true, subtasks: { select: { done: true } } } }),
  ]);

  const featureCounts: Record<string, number> = {};
  for (const g of featureGroups) featureCounts[g.status] = g._count._all;

  const bugSeverityCounts: Record<string, number> = {};
  for (const g of bugSevGroups) bugSeverityCounts[g.severity] = g._count._all;

  const fc = (s: string) => featureCounts[s] ?? 0;
  const featureDone = fc("DONE") + fc("RELEASED");
  const featureInProgress = fc("DEVELOPMENT") + fc("REVIEW") + fc("TESTING") + fc("VALIDATION");
  const featurePlanned = fc("PLANNED") + fc("READY");
  const featureBacklog = fc("BACKLOG");

  const bsc = (s: string) => bugSeverityCounts[s] ?? 0;
  const bugOpen = bsc("NEW") + bsc("TRIAGED") + bsc("IN_PROGRESS") + bsc("FIXED") + bsc("VERIFIED");
  const bugCritical = bsc("CRITICAL") + bsc("BLOCKER");

  const projectProgress =
    featuresWithSubtasks.length > 0
      ? Math.round(
          featuresWithSubtasks.reduce((acc, f) => {
            const total = f.subtasks.length;
            const done = f.subtasks.filter((s) => s.done).length;
            const prog = total > 0 ? (done / total) * 100 : statusProgress(f.status);
            return acc + prog;
          }, 0) / featuresWithSubtasks.length,
        )
      : 0;

  return NextResponse.json({
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
    roadmapCount,
    featureCounts,
  });
}
