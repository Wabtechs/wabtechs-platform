import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatusBadge } from "@/components/admin/os/os-badge";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { healthColor, progressColor } from "@/lib/os-labels";
import { pct } from "@/lib/os-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HeartPulse } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Santé" };
export const dynamic = "force-dynamic";

function Score({ value, invert = false }: { value: number; invert?: boolean }) {
  const color = invert
    ? value >= 20 ? "text-rose-500" : value >= 10 ? "text-amber-500" : "text-emerald-500"
    : value >= 80 ? "text-emerald-500" : value >= 60 ? "text-amber-500" : "text-rose-500";
  return <span className={`font-semibold ${color}`}>{pct(value)}</span>;
}

export default async function OsHealthPage() {
  const projects = await db.osProject.findMany({
    orderBy: { name: "asc" },
    include: {
      modules: { select: { id: true, name: true, status: true, progress: true, testCoverage: true, security: true, performance: true, seo: true, accessibility: true, maintainability: true, technicalDebt: true, qualityScore: true } },
      _count: { select: { bugs: true, features: true } },
    },
  });

  const avgAll = projects.length ? Math.round(projects.reduce((a, p) => a + p.healthScore, 0) / projects.length) : 0;
  const healthy = projects.filter((p) => p.healthScore >= 80).length;
  const atRisk = projects.filter((p) => p.healthScore < 60).length;

  return (
    <div className="min-h-screen">
      <OsPageHeader
        title="Santé"
        description={`${projects.length} projets · santé moyenne ${pct(avgAll)} · ${healthy} sains · ${atRisk} à risque`}
        icon={<HeartPulse className="h-5 w-5" />}
      />

      {projects.length === 0 ? (
        <OsEmpty title="Aucun projet" />
      ) : (
        <div className="space-y-8">
          {projects.map((p) => {
            const avg = (arr: number[]) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);
            const metrics = {
              quality: avg(p.modules.map((m) => m.qualityScore)),
              coverage: avg(p.modules.map((m) => m.testCoverage)),
              security: avg(p.modules.map((m) => m.security)),
              performance: avg(p.modules.map((m) => m.performance)),
              seo: avg(p.modules.map((m) => m.seo)),
              accessibility: avg(p.modules.map((m) => m.accessibility)),
              maintainability: avg(p.modules.map((m) => m.maintainability)),
              debt: avg(p.modules.map((m) => m.technicalDebt)),
            };

            return (
              <Card key={p.id} className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl text-[15px] font-bold text-white" style={{ background: p.color }}>
                        {p.name.charAt(0)}
                      </span>
                      <div>
                        <CardTitle className="text-sm">{p.name}</CardTitle>
                        <CardDescription>
                          {p._count.features} features · {p._count.bugs} bugs
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <OsStatusBadge status={p.status} />
                      <div className="text-right">
                        <p className={`text-xl font-bold ${healthColor(p.healthScore)}`}>{p.healthScore}</p>
                        <p className="text-[10px] text-gray-400">santé</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                    <div className={`h-full rounded-full ${progressColor(p.healthScore)}`} style={{ width: `${p.healthScore}%` }} />
                  </div>
                </CardHeader>
                <CardContent>
                  {p.modules.length === 0 ? (
                    <p className="text-[12px] text-gray-400">Aucun module suivi.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-[11px]">Module</TableHead>
                          <TableHead className="text-[11px]">Qualité</TableHead>
                          <TableHead className="text-[11px]">Couverture</TableHead>
                          <TableHead className="text-[11px]">Sécurité</TableHead>
                          <TableHead className="text-[11px]">Perf.</TableHead>
                          <TableHead className="text-[11px]">SEO</TableHead>
                          <TableHead className="text-[11px]">Access.</TableHead>
                          <TableHead className="text-[11px]">Maintenab.</TableHead>
                          <TableHead className="text-[11px]">Dette</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {p.modules.map((m) => (
                          <TableRow key={m.id}>
                            <TableCell className="text-[12px] font-medium">{m.name}</TableCell>
                            <TableCell><Score value={m.qualityScore} /></TableCell>
                            <TableCell><Score value={m.testCoverage} /></TableCell>
                            <TableCell><Score value={m.security} /></TableCell>
                            <TableCell><Score value={m.performance} /></TableCell>
                            <TableCell><Score value={m.seo} /></TableCell>
                            <TableCell><Score value={m.accessibility} /></TableCell>
                            <TableCell><Score value={m.maintainability} /></TableCell>
                            <TableCell><Score value={m.technicalDebt} invert /></TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-gray-50/70 dark:bg-white/[0.03]">
                          <TableCell className="text-[12px] font-semibold">Moyenne</TableCell>
                          <TableCell><Score value={metrics.quality} /></TableCell>
                          <TableCell><Score value={metrics.coverage} /></TableCell>
                          <TableCell><Score value={metrics.security} /></TableCell>
                          <TableCell><Score value={metrics.performance} /></TableCell>
                          <TableCell><Score value={metrics.seo} /></TableCell>
                          <TableCell><Score value={metrics.accessibility} /></TableCell>
                          <TableCell><Score value={metrics.maintainability} /></TableCell>
                          <TableCell><Score value={metrics.debt} invert /></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
