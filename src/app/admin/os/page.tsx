import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatCard } from "@/components/admin/os/os-stat-card";
import { OsStatusBadge, OsTypeBadge, OsPriorityBadge } from "@/components/admin/os/os-badge";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { OsBarChart, OsLineChart, OsPieChart } from "@/components/admin/os/os-charts";
import { OS_STATUS_META, healthColor } from "@/lib/os-labels";
import { fmtEur, fmtDate, daysUntil } from "@/lib/os-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Boxes,
  HeartPulse,
  Euro,
  Bug,
  Rocket,
  Target,
  CalendarCheck,
  Layers,
  Map as MapIcon,
  Bell,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Dashboard" };
export const dynamic = "force-dynamic";

const FEATURE_ORDER = ["BACKLOG", "PLANNED", "READY", "DEVELOPMENT", "REVIEW", "TESTING", "VALIDATION", "DONE", "RELEASED"];
const SEVERITY_ORDER = ["BLOCKER", "CRITICAL", "MAJOR", "MINOR", "TRIVIAL"];

export default async function OsDashboardPage() {
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
      include: { project: { select: { slug: true, name: true, color: true } } },
    }),
    db.milestone.findMany({ orderBy: { date: "asc" }, take: 6, include: { project: { select: { slug: true, name: true, color: true } } } }),
    db.notification.findMany({ where: { read: false }, orderBy: { createdAt: "desc" }, take: 8, include: { user: { select: { name: true } } } }),
    db.osProject.aggregate({ _avg: { healthScore: true } }),
    db.osProject.aggregate({ _sum: { mrr: true } }),
    db.roadmapItem.findMany({ orderBy: { endDate: "asc" }, take: 8, include: { project: { select: { slug: true, name: true, color: true } } } }),
    db.metricSnapshot.findMany({ orderBy: { date: "asc" } }),
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
  const bugCritical = (bsc.CRITICAL ?? 0) + (bsc.BLOCKER ?? 0);
  const avgHealth = Math.round((healthAgg._avg.healthScore ?? 0) * 10) / 10;
  const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;

  const featureData = FEATURE_ORDER.map((s) => ({ name: OS_STATUS_META[s]?.label ?? s, value: fc[s] ?? 0 })).filter((d) => d.value > 0);
  const severityData = SEVERITY_ORDER.map((s) => ({ name: OS_STATUS_META[s]?.label ?? s, value: bsc[s] ?? 0 })).filter((d) => d.value > 0);

  const byDate = new Map<string, { label: string; stars: number; users: number; mrr: number; downloads: number }>();
  for (const s of growth) {
    const key = s.date.toISOString().slice(0, 10);
    const entry = byDate.get(key) ?? { label: fmtDate(s.date), stars: 0, users: 0, mrr: 0, downloads: 0 };
    if (s.metric === "stars") entry.stars += s.value;
    if (s.metric === "users") entry.users += s.value;
    if (s.metric === "mrr") entry.mrr += s.value;
    if (s.metric === "downloads") entry.downloads += s.value;
    byDate.set(key, entry);
  }
  const growthData = [...byDate.values()].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="min-h-screen">
      <OsPageHeader
        title="Project OS"
        description="Centre de contrôle des projets Wabtechs — vue d'ensemble"
        icon={<Boxes className="h-5 w-5" />}
      >
        <div className="rounded-lg bg-primary/[0.06] px-3 py-1.5 text-[12px] font-medium text-primary">
          {new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(new Date())}
        </div>
      </OsPageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OsStatCard label="Projets actifs" value={`${activeProjects}/${projects.length}`} hint="Sur l'ensemble du portfolio" icon={<Layers className="h-4 w-4" />} accent="text-primary" />
        <OsStatCard label="MRR total" value={fmtEur(mrrAgg._sum.mrr ?? 0)} hint="Revenu mensuel récurrent" icon={<Euro className="h-4 w-4" />} accent="text-emerald-500" />
        <OsStatCard label="Santé moyenne" value={`${avgHealth}/100`} hint="Health score agrégé" icon={<HeartPulse className="h-4 w-4" />} accent={healthColor(avgHealth)} />
        <OsStatCard label="Bugs ouverts" value={bugOpen} hint={`${bugCritical} critiques/bloquants`} icon={<Bug className="h-4 w-4" />} accent="text-rose-500" />
        <OsStatCard label="Features livrées" value={featureTotal ? `${Math.round((featureDone / featureTotal) * 100)}%` : "0%"} hint={`${featureDone}/${featureTotal} done ou released`} icon={<Rocket className="h-4 w-4" />} accent="text-blue-500" />
        <OsStatCard label="Sprints actifs" value={sc.ACTIVE ?? 0} hint={`${sc.COMPLETED ?? 0} sprints terminés`} icon={<CalendarCheck className="h-4 w-4" />} accent="text-violet-500" />
        <OsStatCard label="Objectifs à risque" value={(oc.AT_RISK ?? 0) + (oc.DELAYED ?? 0)} hint={`${oc.ON_TRACK ?? 0} on track · ${oc.COMPLETED ?? 0} complétés`} icon={<Target className="h-4 w-4" />} accent="text-amber-500" />
        <OsStatCard label="Items roadmap" value={roadmapItems.length} hint="Prochains livrables planifiés" icon={<MapIcon className="h-4 w-4" />} accent="text-fuchsia-500" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Répartition des features</CardTitle>
            <CardDescription>Statut des fonctionnalités</CardDescription>
          </CardHeader>
          <CardContent>{featureData.length ? <OsBarChart data={featureData} height={250} /> : <OsEmpty title="Aucune feature" />}</CardContent>
        </Card>
        <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Bugs par sévérité</CardTitle>
            <CardDescription>Distribution des bugs</CardDescription>
          </CardHeader>
          <CardContent>{severityData.length ? <OsPieChart data={severityData} height={250} /> : <OsEmpty title="Aucun bug" />}</CardContent>
        </Card>
        <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Croissance du portfolio</CardTitle>
            <CardDescription>Évolution des métriques agrégées</CardDescription>
          </CardHeader>
          <CardContent>
            {growthData.length ? (
              <OsLineChart
                data={growthData}
                xKey="label"
                height={250}
                lines={[
                  { key: "stars", name: "Stars", color: "#842ae3" },
                  { key: "users", name: "Utilisateurs", color: "#3b82f6" },
                  { key: "mrr", name: "MRR (€)", color: "#10b981" },
                  { key: "downloads", name: "Téléchargements", color: "#f59e0b" },
                ]}
              />
            ) : (
              <OsEmpty title="Aucune donnée de croissance" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1 border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Prochains jalons</CardTitle>
            <CardDescription>Milestones à venir</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {milestones.length === 0 && <OsEmpty title="Aucun jalon" />}
            {milestones.map((m) => {
              const d = daysUntil(m.date);
              return (
                <div key={m.id} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 p-3 dark:border-border">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{m.title}</p>
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ background: m.project.color }} />
                      <span className="ml-1.5">{m.project.name}</span>
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] font-semibold">{m.date ? fmtDate(m.date) : "—"}</p>
                    {d !== null && d >= 0 && <p className="text-[10px] text-gray-400">dans {d} j</p>}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Roadmap prioritaire</CardTitle>
            <CardDescription>Prochains livrables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {roadmapItems.length === 0 && <OsEmpty title="Roadmap vide" />}
            {roadmapItems.map((r) => {
              const d = daysUntil(r.endDate);
              return (
                <div key={r.id} className="rounded-lg border border-gray-100 p-3 dark:border-border">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-[13px] font-medium">{r.title}</p>
                    <OsPriorityBadge priority={r.priority} className="shrink-0" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                    <span>
                      <span className="inline-block h-2 w-2 rounded-full" style={{ background: r.project.color }} />
                      <span className="ml-1.5">{r.project.name}</span>
                    </span>
                    {d !== null && d >= 0 ? <span>livraison dans {d} j</span> : <span>{r.progress}% fait</span>}
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${r.progress}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Releases récentes</CardTitle>
            <CardDescription>Dernières versions publiées</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {releases.length === 0 && <OsEmpty title="Aucune release" />}
            {releases.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3 dark:border-border">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">{r.name}</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: r.project.color }} />
                    <span className="ml-1.5">{r.project.name}</span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] font-semibold text-emerald-500">{r.releasedAt ? fmtDate(r.releasedAt) : r.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Projets</h2>
            <Link href="/admin/os/projects" className="flex items-center gap-1 text-[12px] font-medium text-primary hover:underline">
              Tout voir <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/admin/os/projects/${p.slug}`}
              className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white px-5 py-4 transition-all hover:shadow-md dark:border-border dark:bg-card"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
                  <p className="truncate text-[14px] font-medium">{p.name}</p>
                  <OsTypeBadge type={p.type} className="hidden sm:inline-flex" />
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                  <span>v{p.version}</span>
                  <span>·</span>
                  <span>{p._count.features} features</span>
                  <span>·</span>
                  <span>{p._count.bugs} bugs</span>
                  <span>·</span>
                  <span>{p._count.objectives} objectifs</span>
                  <span>·</span>
                  <span>{fmtEur(p.mrr)} MRR</span>
                </div>
              </div>
              <div className="ml-4 flex shrink-0 items-center gap-3">
                <div className="text-right">
                  <p className={`text-sm font-semibold ${healthColor(p.healthScore)}`}>{p.healthScore}</p>
                  <p className="text-[10px] text-gray-400">santé</p>
                </div>
                <OsStatusBadge status={p.status} />
              </div>
            </Link>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Notifications</h2>
            <Link href="/admin/os/notifications" className="flex items-center gap-1 text-[12px] font-medium text-primary hover:underline">
              Tout voir <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
            <CardContent className="space-y-2 p-4">
              {notifications.length === 0 && <OsEmpty title="Aucune notification" />}
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 dark:border-border">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/[0.06]">
                    <Bell className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{n.title}</p>
                    {n.content && <p className="mt-0.5 line-clamp-2 text-[11px] text-gray-400">{n.content}</p>}
                    <p className="mt-1 text-[10px] text-gray-400">{fmtDate(n.createdAt)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
