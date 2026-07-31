import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatusBadge } from "@/components/admin/os/os-badge";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { progressColor } from "@/lib/os-labels";
import { pct } from "@/lib/os-utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Blocks } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Modules" };
export const dynamic = "force-dynamic";

function Score({ value, invert = false }: { value: number; invert?: boolean }) {
  const color = invert
    ? value >= 20 ? "text-rose-500" : value >= 10 ? "text-amber-500" : "text-emerald-500"
    : value >= 80 ? "text-emerald-500" : value >= 60 ? "text-amber-500" : "text-rose-500";
  return <span className={`font-semibold ${color}`}>{pct(value)}</span>;
}

export default async function OsModulesPage() {
  const modules = await db.module.findMany({
    orderBy: [{ project: { name: "asc" } }, { name: "asc" }],
    include: {
      project: { select: { slug: true, name: true, color: true } },
      _count: { select: { features: true } },
    },
  });

  const avgCoverage = modules.length ? Math.round(modules.reduce((a, m) => a + m.testCoverage, 0) / modules.length) : 0;
  const avgDebt = modules.length ? Math.round(modules.reduce((a, m) => a + m.technicalDebt, 0) / modules.length) : 0;

  return (
    <div className="min-h-screen">
      <OsPageHeader
        title="Modules"
        description={`${modules.length} modules · couverture moyenne ${pct(avgCoverage)} · dette moyenne ${pct(avgDebt)}`}
        icon={<Blocks className="h-5 w-5" />}
      />

      {modules.length === 0 ? (
        <OsEmpty title="Aucun module" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px]">Module</TableHead>
                <TableHead className="text-[11px]">Statut</TableHead>
                <TableHead className="hidden text-[11px] sm:table-cell">Progression</TableHead>
                <TableHead className="hidden text-[11px] lg:table-cell">Couverture</TableHead>
                <TableHead className="hidden text-[11px] lg:table-cell">Sécurité</TableHead>
                <TableHead className="hidden text-[11px] lg:table-cell">Perf.</TableHead>
                <TableHead className="hidden text-[11px] lg:table-cell">Access.</TableHead>
                <TableHead className="hidden text-[11px] lg:table-cell">Maintenab.</TableHead>
                <TableHead className="hidden text-[11px] sm:table-cell">Dette</TableHead>
                <TableHead className="hidden text-right text-[11px] md:table-cell">Features</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: m.project.color }} />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium">{m.name}</p>
                        <p className="text-[10px] text-gray-400">{m.project.name} · v{m.version} · {m.complexity}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><OsStatusBadge status={m.status} /></TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex w-28 items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                        <div className={`h-full rounded-full ${progressColor(m.progress)}`} style={{ width: `${m.progress}%` }} />
                      </div>
                      <span className="w-8 text-right text-[11px] font-semibold">{m.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-[12px] lg:table-cell"><Score value={m.testCoverage} /></TableCell>
                  <TableCell className="hidden text-[12px] lg:table-cell"><Score value={m.security} /></TableCell>
                  <TableCell className="hidden text-[12px] lg:table-cell"><Score value={m.performance} /></TableCell>
                  <TableCell className="hidden text-[12px] lg:table-cell"><Score value={m.accessibility} /></TableCell>
                  <TableCell className="hidden text-[12px] lg:table-cell"><Score value={m.maintainability} /></TableCell>
                  <TableCell className="hidden text-[12px] sm:table-cell"><Score value={m.technicalDebt} invert /></TableCell>
                  <TableCell className="hidden text-right text-[12px] md:table-cell">{m._count.features}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
