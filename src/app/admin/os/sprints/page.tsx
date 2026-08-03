import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatusBadge } from "@/components/admin/os/os-badge";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { fmtDate, daysUntil, pct } from "@/lib/os-utils";
import { CalendarCheck } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Sprints" };
export const dynamic = "force-dynamic";

export default async function OsSprintsPage() {
  const sprints = await db.sprint.findMany({
    orderBy: [{ startDate: "desc" }],
    include: {
      project: { select: { slug: true, name: true, color: true } },
      features: { select: { points: true, status: true } },
    },
  });

  const active = sprints.filter((s) => s.status === "ACTIVE");
  const planned = sprints.filter((s) => s.status === "PLANNED");
  const completed = sprints.filter((s) => s.status === "COMPLETED");

  function sprintProgress(features: { points: number; status: string }[]) {
    const total = features.reduce((a, f) => a + f.points, 0);
    if (!total) return 0;
    const done = features.filter((f) => ["DONE", "RELEASED", "VALIDATION"].includes(f.status)).reduce((a, f) => a + f.points, 0);
    return Math.round((done / total) * 100);
  }

  function renderSprints(list: typeof sprints) {
    if (list.length === 0) return <OsEmpty title="Aucun sprint" />;
    return list.map((s) => {
      const prog = sprintProgress(s.features);
      const d = daysUntil(s.endDate);
      const totalPts = s.features.reduce((a, f) => a + f.points, 0);
      return (
        <div key={s.id} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: s.project.color }} />
                <p className="text-[14px] font-medium">{s.name}</p>
                <OsStatusBadge status={s.status} />
              </div>
              {s.goal && <p className="mt-1 text-[12px] text-gray-500 dark:text-gray-400">{s.goal}</p>}
              <p className="mt-1 text-[11px] text-gray-400">
                {s.project.name} · {fmtDate(s.startDate)} → {fmtDate(s.endDate)}
                {d !== null && s.status === "ACTIVE" && (
                  <span className={d >= 0 ? "ml-1 text-amber-500" : "ml-1 font-semibold text-rose-500"}>{d >= 0 ? `· ${d} j restants` : `· dépassé de ${-d} j`}</span>
                )}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-right">
              <div>
                <p className="text-sm font-semibold">{s.velocity}</p>
                <p className="text-[10px] text-gray-400">vélocité</p>
              </div>
              <div>
                <p className="text-sm font-semibold">{totalPts} pts</p>
                <p className="text-[10px] text-gray-400">chargé</p>
              </div>
              <div>
                <p className={`text-sm font-semibold ${prog >= 80 ? "text-emerald-500" : prog >= 50 ? "text-amber-500" : "text-rose-500"}`}>{pct(prog)}</p>
                <p className="text-[10px] text-gray-400">avancement</p>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
              <div className={`h-full rounded-full ${prog >= 80 ? "bg-emerald-500" : prog >= 50 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${prog}%` }} />
            </div>
            <span className="text-[11px] text-gray-400">{s.features.length} features</span>
          </div>
        </div>
      );
    });
  }

  return (
    <div>
      <OsPageHeader
        title="Sprints"
        description={`${sprints.length} sprints · ${active.length} actifs · ${planned.length} planifiés · ${completed.length} terminés`}
        icon={<CalendarCheck className="h-5 w-5" />}
      />

      <div className="space-y-3">{renderSprints(sprints)}</div>
    </div>
  );
}
