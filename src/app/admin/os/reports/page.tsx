import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatusBadge, OsTypeBadge } from "@/components/admin/os/os-badge";
import { healthColor } from "@/lib/os-labels";
import { fmtEur, fmtNum, fmtDate, pct } from "@/lib/os-utils";
import { Card, CardContent } from "@/components/ui/card";
import { PrintButton } from "./print-button";
import { FileBarChart } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Rapports" };
export const dynamic = "force-dynamic";

export default async function OsReportsPage() {
  const projects = await db.osProject.findMany({
    orderBy: { name: "asc" },
    include: {
      modules: true,
      sprints: true,
      releases: { orderBy: { createdAt: "desc" } },
      features: { select: { points: true, status: true } },
      bugs: { select: { severity: true, status: true } },
      objectives: true,
      _count: { select: { roadmapItems: true, milestones: true } },
    },
  });

  return (
    <div className="min-h-screen">
      <OsPageHeader
        title="Rapports"
        description="Synthèse par projet — prête à imprimer ou exporter en PDF"
        icon={<FileBarChart className="h-5 w-5" />}
      >
        <PrintButton />
      </OsPageHeader>

      <div className="space-y-6 print:space-y-8">
        {projects.map((p) => {
          const totalPts = p.features.reduce((a, f) => a + f.points, 0);
          const donePts = p.features.filter((f) => ["DONE", "RELEASED"].includes(f.status)).reduce((a, f) => a + f.points, 0);
          const openBugs = p.bugs.filter((b) => ["NEW", "TRIAGED", "IN_PROGRESS"].includes(b.status)).length;
          const criticalBugs = p.bugs.filter((b) => ["CRITICAL", "BLOCKER"].includes(b.severity) && !["CLOSED", "WONTFIX"].includes(b.status)).length;
          const activeSprint = p.sprints.find((s) => s.status === "ACTIVE");
          const completedObjectives = p.objectives.filter((o) => o.status === "COMPLETED").length;
          const progress = totalPts ? Math.round((donePts / totalPts) * 100) : 0;

          return (
            <Card key={p.id} className="print:break-inside-avoid border-gray-200/80 bg-white dark:border-border dark:bg-card">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 dark:border-border print:border-0 print:pb-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white" style={{ background: p.color }}>
                      {p.name.charAt(0)}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold">{p.name}</h2>
                        <OsTypeBadge type={p.type} />
                        <OsStatusBadge status={p.status} />
                      </div>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        v{p.version} · {p.environment} · Rapport du {fmtDate(new Date())}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${healthColor(p.healthScore)}`}>{p.healthScore}/100</p>
                    <p className="text-[10px] text-gray-400">Health score</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className="text-lg font-semibold">{fmtNum(p._count.roadmapItems)}</p>
                    <p className="text-[10px] text-gray-400">Roadmap items</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className="text-lg font-semibold">{p._count.milestones}</p>
                    <p className="text-[10px] text-gray-400">Milestones</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className="text-lg font-semibold">{pct(progress)}</p>
                    <p className="text-[10px] text-gray-400">Features livrées</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className={`text-lg font-semibold ${openBugs ? "text-rose-500" : "text-emerald-500"}`}>{openBugs}</p>
                    <p className="text-[10px] text-gray-400">Bugs ouverts</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className={`text-lg font-semibold ${criticalBugs ? "text-rose-500" : "text-gray-900 dark:text-gray-200"}`}>{criticalBugs}</p>
                    <p className="text-[10px] text-gray-400">Bugs critiques</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className="text-lg font-semibold">{fmtEur(p.mrr)}</p>
                    <p className="text-[10px] text-gray-400">MRR</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Modules</p>
                    <div className="space-y-2">
                      {p.modules.map((m) => (
                        <div key={m.id} className="flex items-center gap-2 text-[12px]">
                          <span className="w-32 truncate font-medium">{m.name}</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${m.progress}%` }} />
                          </div>
                          <span className="w-9 text-right text-gray-400">{m.progress}%</span>
                        </div>
                      ))}
                      {p.modules.length === 0 && <p className="text-[12px] text-gray-400">Aucun module</p>}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Indicateurs</p>
                    <div className="space-y-1.5 text-[12px]">
                      <div className="flex justify-between"><span className="text-gray-400">Sprint actif</span><span className="font-medium">{activeSprint?.name ?? "—"}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Vélocité sprint actif</span><span className="font-medium">{activeSprint?.velocity ?? "—"}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Objectifs complétés</span><span className="font-medium">{completedObjectives}/{p.objectives.length}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Sprints terminés</span><span className="font-medium">{p.sprints.filter((s) => s.status === "COMPLETED").length}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Stars GitHub</span><span className="font-medium">{fmtNum(p.githubStars)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Issues GitHub</span><span className="font-medium">{fmtNum(p.githubIssues)}</span></div>
                    </div>
                  </div>
                </div>

                {p.releases.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Dernières releases</p>
                    <div className="flex flex-wrap gap-2">
                      {p.releases.slice(0, 4).map((r) => (
                        <span key={r.id} className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium dark:bg-white/5">
                          {r.name} · {r.status}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
