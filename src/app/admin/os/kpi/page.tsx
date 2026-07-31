import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatCard } from "@/components/admin/os/os-stat-card";
import { OsProjectFilter } from "@/components/admin/os/os-project-filter";
import { OsBarChart, OsPieChart, OsLineChart } from "@/components/admin/os/os-charts";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { OS_STATUS_META, healthColor } from "@/lib/os-labels";
import { buildGrowthSeries } from "@/lib/os-growth";
import { fmtNum } from "@/lib/os-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Rocket, Bug, Target, Gauge, Zap, CalendarCheck, Boxes, HeartPulse } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — KPI" };
export const dynamic = "force-dynamic";

const FEATURE_ORDER = ["BACKLOG", "PLANNED", "READY", "DEVELOPMENT", "REVIEW", "TESTING", "VALIDATION", "DONE", "RELEASED"];
const SEVERITY_ORDER = ["BLOCKER", "CRITICAL", "MAJOR", "MINOR", "TRIVIAL"];

export default async function OsKpiPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const { project } = await searchParams;
  const projects = await db.osProject.findMany({ select: { id: true, slug: true, name: true, color: true, healthScore: true }, orderBy: { name: "asc" } });
  const selected = projects.find((p) => p.slug === project);
  const whereProject = selected ? { projectId: selected.id } : {};

  const [featureGroups, bugGroups, bugSevGroups, sprintGroups, objectiveGroups, velocityAgg, snapshots] = await Promise.all([
    db.feature.groupBy({ by: ["status"], _count: { _all: true }, where: whereProject }),
    db.bug.groupBy({ by: ["status"], _count: { _all: true }, where: whereProject }),
    db.bug.groupBy({ by: ["severity"], _count: { _all: true }, where: whereProject }),
    db.sprint.groupBy({ by: ["status"], _count: { _all: true }, where: whereProject }),
    db.objective.groupBy({ by: ["status"], _count: { _all: true }, where: whereProject }),
    db.sprint.aggregate({ where: whereProject, _avg: { velocity: true } }),
    db.metricSnapshot.findMany({ where: whereProject, orderBy: { date: "asc" } }),
  ]);

  const fc: Record<string, number> = {};
  for (const g of featureGroups) fc[g.status] = g._count._all;
  const bc: Record<string, number> = {};
  for (const g of bugGroups) bc[g.status] = g._count._all;
  const bsc: Record<string, number> = {};
  for (const g of bugSevGroups) bsc[g.severity] = g._count._all;
  const sc: Record<string, number> = {};
  for (const g of sprintGroups) sc[g.status] = g._count._all;
  const oc: Record<string, number> = {};
  for (const g of objectiveGroups) oc[g.status] = g._count._all;

  const featureTotal = Object.values(fc).reduce((a, b) => a + b, 0);
  const featureDone = (fc.DONE ?? 0) + (fc.RELEASED ?? 0);
  const bugOpen = (bc.NEW ?? 0) + (bc.TRIAGED ?? 0) + (bc.IN_PROGRESS ?? 0);
  const featureData = FEATURE_ORDER.map((s) => ({ name: OS_STATUS_META[s]?.label ?? s, value: fc[s] ?? 0 })).filter((d) => d.value > 0);
  const severityData = SEVERITY_ORDER.map((s) => ({ name: OS_STATUS_META[s]?.label ?? s, value: bsc[s] ?? 0 })).filter((d) => d.value > 0);
  const growth = buildGrowthSeries(snapshots);

  return (
    <div className="min-h-screen">
      <OsPageHeader
        title="KPI"
        description={selected ? `Indicateurs clés — ${selected.name}` : "Indicateurs clés sur l'ensemble du portfolio"}
        icon={<TrendingUp className="h-5 w-5" />}
      >
        <OsProjectFilter projects={projects} value={selected?.slug ?? "all"} basePath="/admin/os/kpi" />
      </OsPageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OsStatCard label="Features totales" value={fmtNum(featureTotal)} hint="Sur le scope sélectionné" icon={<Boxes className="h-4 w-4" />} accent="text-blue-500" />
        <OsStatCard label="Features livrées" value={featureTotal ? `${Math.round((featureDone / featureTotal) * 100)}%` : "0%"} hint={`${featureDone}/${featureTotal} terminées`} icon={<Rocket className="h-4 w-4" />} accent="text-emerald-500" />
        <OsStatCard label="Bugs ouverts" value={fmtNum(bugOpen)} hint={`${(bsc.CRITICAL ?? 0) + (bsc.BLOCKER ?? 0)} critiques`} icon={<Bug className="h-4 w-4" />} accent="text-rose-500" />
        <OsStatCard label="Objectifs on track" value={`${(oc.ON_TRACK ?? 0)}/${Object.values(oc).reduce((a, b) => a + b, 0)}`} hint={`${(oc.AT_RISK ?? 0) + (oc.DELAYED ?? 0)} à risque`} icon={<Target className="h-4 w-4" />} accent="text-amber-500" />
        <OsStatCard label="Vélocité moyenne" value={fmtNum(Math.round((velocityAgg._avg.velocity ?? 0) * 10) / 10)} hint="Story points / sprint" icon={<Zap className="h-4 w-4" />} accent="text-violet-500" />
        <OsStatCard label="Sprints actifs" value={fmtNum(sc.ACTIVE ?? 0)} hint={`${sc.PLANNED ?? 0} planifiés`} icon={<CalendarCheck className="h-4 w-4" />} accent="text-fuchsia-500" />
        <OsStatCard label="Bugs fixes (h)" value="—" hint="Cumul des heures de fix estimées" icon={<Gauge className="h-4 w-4" />} accent="text-orange-500" />
        <OsStatCard label="Health score" value={selected ? `${selected.healthScore}/100` : "—"} hint="Santé du projet" icon={<HeartPulse className="h-4 w-4" />} accent={selected ? healthColor(selected.healthScore) : undefined} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Features par statut</CardTitle>
            <CardDescription>Distribution du pipeline</CardDescription>
          </CardHeader>
          <CardContent>{featureData.length ? <OsBarChart data={featureData} height={260} /> : <OsEmpty title="Aucune feature" />}</CardContent>
        </Card>
        <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Bugs par sévérité</CardTitle>
            <CardDescription>Qualité du code</CardDescription>
          </CardHeader>
          <CardContent>{severityData.length ? <OsPieChart data={severityData} height={260} /> : <OsEmpty title="Aucun bug" />}</CardContent>
        </Card>
        <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Croissance</CardTitle>
            <CardDescription>Évolution des métriques</CardDescription>
          </CardHeader>
          <CardContent>
            {growth.length ? (
              <OsLineChart
                data={growth}
                xKey="label"
                height={260}
                lines={[
                  { key: "stars", name: "Stars", color: "#842ae3" },
                  { key: "users", name: "Utilisateurs", color: "#3b82f6" },
                  { key: "downloads", name: "Téléchargements", color: "#f59e0b" },
                ]}
              />
            ) : (
              <OsEmpty title="Aucune donnée de croissance" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
