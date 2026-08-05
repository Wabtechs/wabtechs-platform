import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  const user = await requireAdmin();

  const [projects, releases, milestones, notifications, healthAgg, mrrAgg, roadmapItems] =
    await Promise.all([
      db.osProject.findMany({
        orderBy: { name: "asc" },
        include: {
          owner: { select: { id: true, name: true, email: true } },
          _count: {
            select: { features: true, bugs: true, objectives: true, modules: true, sprints: true },
          },
        },
      }),
      db.release.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { project: { select: { id: true, slug: true, name: true, color: true } } },
      }),
      db.milestone.findMany({
        orderBy: { date: "asc" },
        take: 6,
        include: { project: { select: { id: true, slug: true, name: true, color: true } } },
      }),
      db.notification.findMany({
        where: { userId: user.id as string, read: false },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      db.osProject.aggregate({ _avg: { healthScore: true } }),
      db.osProject.aggregate({ _sum: { mrr: true } }),
      db.roadmapItem.findMany({ orderBy: { endDate: "asc" }, take: 8 }),
    ]);

  const [featureGroups, bugGroups, bugSevGroups, sprintGroups, objectiveGroups, growth] =
    await Promise.all([
      db.feature.groupBy({ by: ["status"], _count: { _all: true } }),
      db.bug.groupBy({ by: ["status"], _count: { _all: true } }),
      db.bug.groupBy({ by: ["severity"], _count: { _all: true } }),
      db.sprint.groupBy({ by: ["status"], _count: { _all: true } }),
      db.objective.groupBy({ by: ["status"], _count: { _all: true } }),
      db.metricSnapshot.findMany({ orderBy: { date: "asc" } }),
    ]);

  const featureCounts: Record<string, number> = {};
  for (const g of featureGroups) featureCounts[g.status] = g._count._all;
  const bugCounts: Record<string, number> = {};
  for (const g of bugGroups) bugCounts[g.status] = g._count._all;
  const bugSeverityCounts: Record<string, number> = {};
  for (const g of bugSevGroups) bugSeverityCounts[g.severity] = g._count._all;
  const sprintCounts: Record<string, number> = {};
  for (const g of sprintGroups) sprintCounts[g.status] = g._count._all;
  const objectiveCounts: Record<string, number> = {};
  for (const g of objectiveGroups) objectiveCounts[g.status] = g._count._all;

  const featureTotal = Object.values(featureCounts).reduce((a, b) => a + b, 0);
  const featureDone = (featureCounts.DONE ?? 0) + (featureCounts.RELEASED ?? 0);
  const bugOpen = (bugCounts.NEW ?? 0) + (bugCounts.TRIAGED ?? 0) + (bugCounts.IN_PROGRESS ?? 0);

  return NextResponse.json({
    projects,
    totals: {
      projects: projects.length,
      activeProjects: projects.filter((p: { status: string }) => p.status === "ACTIVE").length,
      totalMrr: mrrAgg._sum.mrr ?? 0,
      avgHealth: Math.round((healthAgg._avg.healthScore ?? 0) * 10) / 10,
      featureTotal,
      featureDone,
      featureProgress: featureTotal ? Math.round((featureDone / featureTotal) * 100) : 0,
      bugOpen,
      bugCritical: (bugSeverityCounts.CRITICAL ?? 0) + (bugSeverityCounts.BLOCKER ?? 0),
      activeSprints: sprintCounts.ACTIVE ?? 0,
      objectivesAtRisk: (objectiveCounts.AT_RISK ?? 0) + (objectiveCounts.DELAYED ?? 0),
      roadmapItems: roadmapItems.length,
    },
    featureCounts,
    bugCounts,
    bugSeverityCounts,
    sprintCounts,
    objectiveCounts,
    releases,
    milestones,
    notifications,
    roadmapItems,
    growth,
  });
});
