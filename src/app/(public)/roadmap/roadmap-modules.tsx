"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OsStatusBadge } from "@/components/admin/os/os-badge";
import { progressColor } from "@/lib/os-labels";
import { pct } from "@/lib/os-utils";
import type { OsModule, OsFeature } from "./types";

export function RoadmapModules({
  modules,
  features,
}: {
  modules: OsModule[];
  features: OsFeature[];
}) {
  if (modules.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-sm">Aucun module à afficher.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {modules.map((m) => {
        const moduleFeatures = features.filter(
          (f) => f.module?.name === m.name && f.project?.id === m.project.id,
        );
        const totalPoints = moduleFeatures.reduce((a, f) => a + f.points, 0);
        const donePoints = moduleFeatures
          .filter((f) => f.status === "DONE" || f.status === "RELEASED")
          .reduce((a, f) => a + f.points, 0);
        const progress =
          totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : m.progress;

        return (
          <Card key={m.id} className="border-border bg-card shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="text-[14px]">{m.name}</CardTitle>
                  <CardDescription className="line-clamp-2 text-[11px]">
                    {m.description ?? "Aucune description"}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <OsStatusBadge status={m.status} />
                  <Badge variant="outline" className="text-[10px]">
                    v{m.version}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">
                  {moduleFeatures.length} features · {pct(progress)}
                </span>
                <span className="font-semibold">{pct(progress)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${progressColor(progress)}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground text-[10px]">Couverture tests</p>
                  <p className="font-semibold">{m.testCoverage}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px]">Sécurité</p>
                  <p className="font-semibold">{m.security}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px]">Performance</p>
                  <p className="font-semibold">{m.performance}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px]">Dette tech</p>
                  <p className="font-semibold text-amber-500">{m.technicalDebt}%</p>
                </div>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-[11px]">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: m.project.color }}
                />
                <span className="truncate">{m.project.name}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
