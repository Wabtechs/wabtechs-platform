import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatusBadge, OsMethodBadge } from "@/components/admin/os/os-badge";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { progressColor } from "@/lib/os-labels";
import { fmtDate, daysUntil, pct } from "@/lib/os-utils";
import { Target } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Objectifs" };
export const dynamic = "force-dynamic";

export default async function OsObjectivesPage() {
  const objectives = await db.objective.findMany({
    orderBy: [{ status: "asc" }, { deadline: "asc" }],
    include: {
      project: { select: { slug: true, name: true, color: true } },
      assignee: { select: { id: true, name: true } },
      keyResults: true,
    },
  });

  const groups = [
    { title: "À risque", items: objectives.filter((o) => ["AT_RISK", "DELAYED"].includes(o.status)) },
    { title: "En cours", items: objectives.filter((o) => ["NOT_STARTED", "ON_TRACK"].includes(o.status)) },
    { title: "Terminés", items: objectives.filter((o) => ["COMPLETED", "CANCELLED"].includes(o.status)) },
  ];

  return (
    <div>
      <OsPageHeader
        title="Objectifs"
        description={`${objectives.length} objectifs · OKR & SMART sur l'ensemble des projets`}
        icon={<Target className="h-5 w-5" />}
      />

      {objectives.length === 0 ? (
        <OsEmpty title="Aucun objectif" hint="Définissez des objectifs mesurables pour piloter chaque projet." />
      ) : (
        <div className="space-y-8">
          {groups.map(
            (g) =>
              g.items.length > 0 && (
                <div key={g.title}>
                  <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {g.title} <span className="ml-1 text-[11px] font-normal text-gray-400">({g.items.length})</span>
                  </h2>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {g.items.map((o) => {
                      const d = daysUntil(o.deadline);
                      return (
                        <div key={o.id} className="rounded-xl border border-border bg-card p-5">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[14px] font-medium">{o.title}</p>
                              <p className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                                <span className="h-2 w-2 rounded-full" style={{ background: o.project.color }} />
                                {o.project.name}
                                {o.assignee && <span>· {o.assignee.name}</span>}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <OsMethodBadge method={o.method} />
                              <OsStatusBadge status={o.status} />
                            </div>
                          </div>

                          <div className="mt-4 flex items-center gap-3">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                              <div className={`h-full rounded-full ${progressColor(o.progress)}`} style={{ width: `${o.progress}%` }} />
                            </div>
                            <span className="text-[12px] font-semibold">{pct(o.progress)}</span>
                          </div>

                          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                            <span>
                              Progression : {Number(o.current)} / {Number(o.target)}
                            </span>
                            {o.deadline && (
                              <span className={o.status === "DELAYED" || o.status === "AT_RISK" ? "font-medium text-rose-500" : ""}>
                                {fmtDate(o.deadline)}
                                {d !== null && d >= 0 ? ` · ${d} j` : ""}
                              </span>
                            )}
                          </div>

                          {o.keyResults.length > 0 && (
                            <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-white/5">
                              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Key results</p>
                              <ul className="space-y-1.5">
                                {o.keyResults.map((kr) => {
                                  const krPct = Number(kr.target) ? Math.min(100, Math.round((Number(kr.current) / Number(kr.target)) * 100)) : 0;
                                  return (
                                    <li key={kr.id} className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                                      <span className="flex-1 truncate">{kr.title}</span>
                                      <span className="h-1 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                                        <span className="block h-full rounded-full bg-primary" style={{ width: `${krPct}%` }} />
                                      </span>
                                      <span className="w-14 shrink-0 text-right font-medium">{Number(kr.current)}/{Number(kr.target)}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ),
          )}
        </div>
      )}
    </div>
  );
}
