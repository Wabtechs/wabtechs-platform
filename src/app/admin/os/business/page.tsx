import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatCard } from "@/components/admin/os/os-stat-card";
import { OsProjectFilter } from "@/components/admin/os/os-project-filter";
import { OsLineChart } from "@/components/admin/os/os-charts";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { buildGrowthSeries, METRIC_SNAPSHOT_LIMIT } from "@/lib/os-growth";
import { fmtEur, fmtNum } from "@/lib/os-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet, Euro, TrendingUp, Star } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Business" };
export const dynamic = "force-dynamic";

export default async function OsBusinessPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project } = await searchParams;
  const projects = await db.osProject.findMany({
    select: { id: true, slug: true, name: true, color: true },
    orderBy: { name: "asc" },
  });
  const selected = projects.find((p) => p.slug === project);
  const whereProject = selected ? { projectId: selected.id } : {};
  const whereOsProject = selected ? { slug: selected.slug } : {};

  const [allProjects, mrrAgg, snapshots, starsAgg] = await Promise.all([
    db.osProject.findMany({
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true, color: true, mrr: true, githubStars: true },
    }),
    db.osProject.aggregate({ where: whereOsProject, _sum: { mrr: true } }),
    db.metricSnapshot.findMany({
      where: whereProject,
      orderBy: { date: "asc" },
      take: -METRIC_SNAPSHOT_LIMIT,
    }),
    db.osProject.aggregate({ where: whereOsProject, _sum: { githubStars: true } }),
  ]);

  const growth = buildGrowthSeries(snapshots);
  const revenueProjects = allProjects
    .filter((p) => Number(p.mrr) > 0)
    .sort((a, b) => Number(b.mrr) - Number(a.mrr));
  const totalMrr = Number(mrrAgg._sum?.mrr ?? 0);
  const totalStars = Number(starsAgg._sum?.githubStars ?? 0);

  return (
    <div>
      <OsPageHeader
        title="Business"
        description={
          selected
            ? `Métriques business — ${selected.name}`
            : "Métriques business sur l'ensemble du portfolio"
        }
        icon={<Wallet className="h-5 w-5" />}
      >
        <OsProjectFilter
          projects={projects}
          value={selected?.slug ?? "all"}
          basePath="/admin/os/business"
        />
      </OsPageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OsStatCard
          label="MRR cumulé"
          value={fmtEur(totalMrr)}
          hint="Revenu mensuel récurrent"
          icon={<Euro className="h-4 w-4" />}
          accent="text-emerald-500"
        />
        <OsStatCard
          label="Projets monétisés"
          value={`${revenueProjects.length}/${allProjects.length}`}
          hint="Générant du revenu"
          icon={<Wallet className="h-4 w-4" />}
          accent="text-blue-500"
        />
        <OsStatCard
          label="Stars cumulées"
          value={fmtNum(totalStars)}
          hint="Traction GitHub"
          icon={<Star className="h-4 w-4" />}
          accent="text-amber-500"
        />
        <OsStatCard
          label="Top projet"
          value={revenueProjects[0]?.name ?? "—"}
          hint={revenueProjects[0] ? `${fmtEur(revenueProjects[0].mrr)} MRR` : "Aucun revenu"}
          icon={<TrendingUp className="h-4 w-4" />}
          accent="text-primary"
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">MRR par projet</CardTitle>
            <CardDescription>Contribution au revenu récurrent</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueProjects.length === 0 ? (
              <OsEmpty
                title="Aucun revenu"
                hint="Aucun projet ne génère de revenu pour le moment."
              />
            ) : (
              <div className="space-y-4">
                {revenueProjects.map((p) => {
                  const max = revenueProjects[0]?.mrr;
                  const pctVal =
                    max && Number(max) > 0
                      ? Math.max(4, Math.round((Number(p.mrr) / Number(max)) * 100))
                      : 0;
                  return (
                    <div key={p.id} className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: p.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between text-[12px]">
                          <span className="truncate font-medium">{p.name}</span>
                          <span className="ml-2 font-semibold">{fmtEur(p.mrr)}</span>
                        </div>
                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pctVal}%`, background: p.color }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">MRR — évolution</CardTitle>
            <CardDescription>Croissance du revenu mensuel</CardDescription>
          </CardHeader>
          <CardContent>
            {growth.length ? (
              <OsLineChart
                data={growth}
                xKey="label"
                height={240}
                lines={[{ key: "mrr", name: "MRR (€)", color: "#10b981" }]}
              />
            ) : (
              <OsEmpty title="Aucune donnée" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Croissance — Utilisateurs & Téléchargements</CardTitle>
          </CardHeader>
          <CardContent>
            {growth.length ? (
              <OsLineChart
                data={growth}
                xKey="label"
                height={220}
                lines={[
                  { key: "users", name: "Utilisateurs", color: "#3b82f6" },
                  { key: "downloads", name: "Téléchargements", color: "#f59e0b" },
                ]}
              />
            ) : (
              <OsEmpty title="Aucune donnée" />
            )}
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Croissance — Stars GitHub</CardTitle>
          </CardHeader>
          <CardContent>
            {growth.length ? (
              <OsLineChart
                data={growth}
                xKey="label"
                height={220}
                lines={[{ key: "stars", name: "Stars", color: "#842ae3" }]}
              />
            ) : (
              <OsEmpty title="Aucune donnée" />
            )}
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Répartition des revenus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allProjects.length === 0 && <OsEmpty title="Aucun projet" />}
            {allProjects.map((p) => {
              const share = totalMrr > 0 ? Math.round((Number(p.mrr) / totalMrr) * 100) : 0;
              return (
                <div key={p.id} className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                    <span className="truncate">{p.name}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="w-10 text-right font-semibold">{share}%</span>
                  </span>
                </div>
              );
            })}
            <div className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
              {allProjects.map((p) => (
                <span
                  key={p.id}
                  style={{
                    width: `${totalMrr > 0 ? (Number(p.mrr) / totalMrr) * 100 : 0}%`,
                    background: p.color,
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
