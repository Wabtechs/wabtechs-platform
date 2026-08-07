import { db } from "@/lib/prisma";
import { renderCounters } from "@/lib/metrics";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const QUALITY_METRICS = [
  "testCoverage",
  "security",
  "performance",
  "seo",
  "accessibility",
  "maintainability",
] as const;

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
  };
  return map[status] ?? 0;
}

function escapeLabel(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "");
}

export async function GET() {
  const [
    featureGroups,
    bugGroups,
    bugSeverityGroups,
    moduleGroups,
    moduleQuality,
    projectGroups,
    projectHealth,
    roadmapGroups,
    featuresProgress,
    openBugs,
  ] = await Promise.all([
    db.feature.groupBy({ by: ["status"], _count: { _all: true } }),
    db.bug.groupBy({ by: ["status"], _count: { _all: true } }),
    db.bug.groupBy({ by: ["severity"], _count: { _all: true } }),
    db.module.groupBy({ by: ["status"], _count: { _all: true } }),
    db.module.findMany({
      select: {
        id: true,
        name: true,
        project: { select: { name: true } },
        ...Object.fromEntries(QUALITY_METRICS.map((m) => [m, true])),
      },
    }),
    db.osProject.groupBy({ by: ["status"], _count: { _all: true } }),
    db.osProject.findMany({ select: { slug: true, name: true, healthScore: true } }),
    db.roadmapItem.groupBy({ by: ["type"], _count: { _all: true } }),
    db.feature.findMany({ select: { status: true, subtasks: { select: { done: true } } } }),
    db.bug.findMany({
      where: { status: { in: ["NEW", "TRIAGED", "IN_PROGRESS"] } },
      select: { id: true },
    }),
  ]);

  let out = "";

  out += "# HELP wabtechs_roadmap_up Etat du service (1 = up).\n";
  out += "# TYPE wabtechs_roadmap_up gauge\n";
  out += "wabtechs_roadmap_up 1\n";

  out += "# HELP wabtechs_roadmap_features_total Nombre de features par statut.\n";
  out += "# TYPE wabtechs_roadmap_features_total gauge\n";
  for (const g of featureGroups) {
    out += `wabtechs_roadmap_features_total{status="${g.status}"} ${g._count._all}\n`;
  }

  out += "# HELP wabtechs_roadmap_bugs_total Nombre de bugs par statut.\n";
  out += "# TYPE wabtechs_roadmap_bugs_total gauge\n";
  for (const g of bugGroups) {
    out += `wabtechs_roadmap_bugs_total{status="${g.status}"} ${g._count._all}\n`;
  }

  out += "# HELP wabtechs_roadmap_bugs_by_severity Nombre de bugs par sévérité.\n";
  out += "# TYPE wabtechs_roadmap_bugs_by_severity gauge\n";
  for (const g of bugSeverityGroups) {
    out += `wabtechs_roadmap_bugs_by_severity{severity="${g.severity}"} ${g._count._all}\n`;
  }

  out += "# HELP wabtechs_roadmap_bugs_open Bugs non résolus.\n";
  out += "# TYPE wabtechs_roadmap_bugs_open gauge\n";
  out += `wabtechs_roadmap_bugs_open ${openBugs.length}\n`;

  out += "# HELP wabtechs_roadmap_modules_total Nombre de modules par statut.\n";
  out += "# TYPE wabtechs_roadmap_modules_total gauge\n";
  for (const g of moduleGroups) {
    out += `wabtechs_roadmap_modules_total{status="${g.status}"} ${g._count._all}\n`;
  }

  out += "# HELP wabtechs_roadmap_projects_total Nombre de projets par statut.\n";
  out += "# TYPE wabtechs_roadmap_projects_total gauge\n";
  for (const g of projectGroups) {
    out += `wabtechs_roadmap_projects_total{status="${g.status}"} ${g._count._all}\n`;
  }

  out += "# HELP wabtechs_project_health Score de santé par projet.\n";
  out += "# TYPE wabtechs_project_health gauge\n";
  for (const p of projectHealth) {
    out += `wabtechs_project_health{project="${escapeLabel(p.name)}"} ${p.healthScore}\n`;
  }

  out += "# HELP wabtechs_module_quality Score qualité par module et métrique.\n";
  out += "# TYPE wabtechs_module_quality gauge\n";
  for (const m of moduleQuality) {
    const quality = m as unknown as Record<string, number | undefined>;
    for (const metric of QUALITY_METRICS) {
      const value = quality[metric];
      out += `wabtechs_module_quality{project="${escapeLabel(m.project.name)}",module="${escapeLabel(m.name)}",metric="${metric}"} ${value ?? 0}\n`;
    }
  }

  out += "# HELP wabtechs_roadmap_items_total Items de roadmap par type.\n";
  out += "# TYPE wabtechs_roadmap_items_total gauge\n";
  for (const g of roadmapGroups) {
    out += `wabtechs_roadmap_items_total{type="${g.type}"} ${g._count._all}\n`;
  }

  const projectProgress =
    featuresProgress.length > 0
      ? Math.round(
          featuresProgress.reduce((acc, f) => {
            const total = f.subtasks.length;
            const done = f.subtasks.filter((s) => s.done).length;
            const prog = total > 0 ? (done / total) * 100 : statusProgress(f.status);
            return acc + prog;
          }, 0) / featuresProgress.length,
        )
      : 0;

  out += "# HELP wabtechs_roadmap_progress_percent Progression globale (0-100).\n";
  out += "# TYPE wabtechs_roadmap_progress_percent gauge\n";
  out += `wabtechs_roadmap_progress_percent ${projectProgress}\n`;

  out += renderCounters();

  return new Response(out, {
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
