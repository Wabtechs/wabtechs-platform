import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsPriorityBadge } from "@/components/admin/os/os-badge";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { fmtDate, daysUntil } from "@/lib/os-utils";
import { Map, TrendingUp, AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Roadmap" };
export const dynamic = "force-dynamic";

export default async function OsRoadmapPage() {
  const items = await db.roadmapItem.findMany({
    orderBy: [{ endDate: "asc" }, { priority: "asc" }],
    include: { project: { select: { slug: true, name: true, color: true } } },
  });

  const totalHours = items.reduce((a, i) => a + i.estimatedHours, 0);
  const actualHours = items.reduce((a, i) => a + i.actualHours, 0);

  return (
    <div>
      <OsPageHeader
        title="Roadmap"
        description={`${items.length} items · ${totalHours}h estimées · ${actualHours}h consommées`}
        icon={<Map className="h-5 w-5" />}
      />

      {items.length === 0 ? (
        <OsEmpty title="Roadmap vide" hint="Ajoutez des items roadmap pour visualiser la trajectoire produit." />
      ) : (
        <div className="space-y-3">
          {items.map((r) => {
            const d = daysUntil(r.endDate);
            const over = r.estimatedHours > 0 && r.actualHours > r.estimatedHours;
            return (
              <div key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: r.project.color }} />
                      <p className="text-[14px] font-medium">{r.title}</p>
                      <OsPriorityBadge priority={r.priority} />
                      <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">{r.type}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-400">
                      {r.project.name} · {fmtDate(r.startDate)} → {fmtDate(r.endDate)}
                      {d !== null && d >= 0 ? <span className="ml-1 text-amber-500">· dans {d} j</span> : null}
                      {d !== null && d < 0 && r.progress < 100 ? <span className="ml-1 text-rose-500">· en retard de {-d} j</span> : null}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" /> ROI {r.roi}% · Impact {r.impact}%
                    </span>
                    <span className={over ? "font-semibold text-rose-500" : ""}>
                      {r.actualHours}/{r.estimatedHours}h
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${r.progress}%` }} />
                  </div>
                  <span className="text-[12px] font-semibold">{r.progress}%</span>
                </div>
                {(r.dependencies || r.risks) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.dependencies && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <AlertTriangle className="h-3 w-3" /> Dépend : {r.dependencies}
                      </span>
                    )}
                    {r.risks && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-[10px] font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                        <AlertTriangle className="h-3 w-3" /> Risque : {r.risks}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
