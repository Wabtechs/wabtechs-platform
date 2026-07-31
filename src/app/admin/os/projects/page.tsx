import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatusBadge, OsTypeBadge } from "@/components/admin/os/os-badge";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { healthColor } from "@/lib/os-labels";
import { fmtEur, fmtNum } from "@/lib/os-utils";
import { Layers, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Projets" };
export const dynamic = "force-dynamic";

export default async function OsProjectsPage() {
  const projects = await db.osProject.findMany({
    orderBy: { name: "asc" },
    include: {
      owner: { select: { name: true, email: true } },
      _count: { select: { features: true, bugs: true, objectives: true, modules: true, sprints: true, members: true } },
    },
  });

  const totalMrr = projects.reduce((acc, p) => acc + Number(p.mrr), 0);

  return (
    <div className="min-h-screen">
      <OsPageHeader
        title="Projets"
        description={`${projects.length} projets · ${fmtEur(totalMrr)} MRR cumulé`}
        icon={<Layers className="h-5 w-5" />}
      />

      {projects.length === 0 ? (
        <OsEmpty title="Aucun projet" hint="Créez votre premier projet pour piloter son développement." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/admin/os/projects/${p.slug}`}
              className="group flex flex-col rounded-xl border border-gray-200/80 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-border dark:bg-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-bold text-white" style={{ background: p.color }}>
                    {p.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold">{p.name}</p>
                    <p className="text-[11px] text-gray-400">v{p.version} · {p.environment}</p>
                  </div>
                </div>
                <OsStatusBadge status={p.status} />
              </div>

              <p className="mt-3 line-clamp-2 text-[12px] text-gray-500 dark:text-gray-400">{p.description}</p>

              <div className="mt-4 grid grid-cols-4 gap-2 rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                <div>
                  <p className="text-sm font-semibold">{fmtNum(p._count.features)}</p>
                  <p className="text-[10px] text-gray-400">Features</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">{fmtNum(p._count.bugs)}</p>
                  <p className="text-[10px] text-gray-400">Bugs</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">{fmtNum(p._count.objectives)}</p>
                  <p className="text-[10px] text-gray-400">Objectifs</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">{fmtNum(p._count.sprints)}</p>
                  <p className="text-[10px] text-gray-400">Sprints</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-border">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <OsTypeBadge type={p.type} />
                  <span>·</span>
                  <span>{fmtEur(p.mrr)} MRR</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[12px] font-semibold ${healthColor(p.healthScore)}`}>{p.healthScore}% santé</span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
