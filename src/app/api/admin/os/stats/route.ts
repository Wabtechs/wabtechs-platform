import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const [
      projects,
      featureGroups,
      bugGroups,
      bugSevGroups,
      sprintGroups,
      objectiveGroups,
      releases,
      milestones,
      notifications,
      healthAgg,
      mrrAgg,
      roadmapItems,
      growth,
    ] = await Promise.all([
      db.osProject.findMany({
        orderBy: { name: "asc" },
        include: {
          owner: { select: { id: true, name: true, email: true } },
          _count: { select: { features: true, bugs: true, objectives: true, modules: true, sprints: true } },
        },
      }),
      db.feature.groupBy({ by: ["status"], _count: { _all: true } }),
      db.bug.groupBy({ by: ["status"], _count: { _all: true } }),
      db.bug.groupBy({ by: ["severity"], _count: { _all: true } }),
      db.sprint.groupBy({ by: ["status"], _count: { _all: true } }),
      db.objective.groupBy({ by: ["status"], _count: { _all: true } }),
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
        where: { userId: session.user.id as string, read: false },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      db.osProject.aggregate({ _avg: { healthScore: true } }),
      db.osProject.aggregate({ _sum: { mrr: true } }),
      db.roadmapItem.findMany({ orderBy: { endDate: "asc" }, take: 8 }),
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
        activeProjects: projects.filter((p) => p.status === "ACTIVE").length,
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
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
