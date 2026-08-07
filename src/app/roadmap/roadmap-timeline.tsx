"use client";

import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { progressColor } from "@/lib/os-labels";
import { pct, fmtDate, daysUntil } from "@/lib/os-utils";
import type { OsRoadmapItem } from "./types";
import { Calendar, AlertTriangle } from "lucide-react";

const MONTH_LABELS = [
  "Janv.",
  "Févr.",
  "Mars",
  "Avr.",
  "Mai",
  "Juin",
  "Juil.",
  "Août",
  "Sept.",
  "Oct.",
  "Nov.",
  "Déc.",
];

export function RoadmapTimeline({ roadmapItems }: { roadmapItems: OsRoadmapItem[] }) {
  if (!roadmapItems || roadmapItems.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-sm">Aucun item de roadmap.</p>
      </div>
    );
  }

  const grouped = new Map<string, OsRoadmapItem[]>();
  for (const item of roadmapItems) {
    if (!item.endDate) continue;
    const d = new Date(item.endDate);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    const arr = grouped.get(key) ?? [];
    arr.push(item);
    grouped.set(key, arr);
  }

  const sortedKeys = Array.from(grouped.keys()).sort((a, b) => {
    const pa = a.split("-").map(Number);
    const pb = b.split("-").map(Number);
    const ya = pa[0] ?? 0;
    const ma = pa[1] ?? 0;
    const yb = pb[0] ?? 0;
    const mb = pb[1] ?? 0;
    return ya === yb ? ma - mb : ya - yb;
  });

  const overdueCount = roadmapItems.filter(
    (i) =>
      i.endDate && daysUntil(i.endDate) !== null && daysUntil(i.endDate)! < 0 && i.progress < 100,
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Échéances par mois</h3>
        {overdueCount > 0 && (
          <span className="text-xs text-rose-500">⚠ {overdueCount} en retard</span>
        )}
      </div>

      {sortedKeys.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucun item avec une date de fin.</p>
      ) : (
        <div className="border-muted relative ml-4 space-y-8 border-l-2 pl-6">
          {sortedKeys.map((key) => {
            const parts = key.split("-").map(Number);
            const year = parts[0] ?? 0;
            const month = parts[1] ?? 0;
            const items = grouped.get(key) ?? [];
            const monthProgress = Math.round(
              (items.reduce((a, i) => a + i.progress, 0) / items.length / 100) * 100,
            );

            return (
              <div key={key}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                  <h4 className="text-base font-semibold">
                    {MONTH_LABELS[month] ?? "???"} {year}
                  </h4>
                  <div className="flex-1" />
                  <span className="text-muted-foreground text-xs">{pct(monthProgress)}</span>
                </div>

                <div className="space-y-3 pl-1">
                  {items.map((item) => {
                    const d = item.endDate ? daysUntil(item.endDate) : null;
                    const over = d !== null && d < 0 && item.progress < 100;
                    const project = item.project;

                    return (
                      <Card key={item.id} className="border-border bg-card/50">
                        <CardContent className="p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{ background: project?.color }}
                                />
                                <CardTitle className="text-[13px]">{item.title}</CardTitle>
                              </div>
                              <CardDescription className="mt-1 line-clamp-2 text-[11px]">
                                {item.description ?? "Pas de description"}
                              </CardDescription>
                              {item.dependencies && (
                                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                                  <AlertTriangle className="h-3 w-3" />
                                  Dépend de : {item.dependencies}
                                </div>
                              )}
                              {item.endDate && (
                                <p className="text-muted-foreground mt-1 text-[10px]">
                                  Échéance : {fmtDate(item.endDate)}
                                  {over && (
                                    <span className="ml-1 font-medium text-rose-500">
                                      (en retard de {-d} j)
                                    </span>
                                  )}
                                </p>
                              )}
                            </div>

                            <div className="flex shrink-0 items-center gap-2 text-right">
                              <span className="text-muted-foreground text-[11px]">
                                {fmtDate(item.startDate)} → {fmtDate(item.endDate)}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="flex w-12 items-center justify-end">
                                  <div
                                    className={`h-2 w-8 rounded-full ${progressColor(item.progress)}`}
                                  ></div>
                                </div>
                                <span className="text-[11px] font-semibold">{item.progress}%</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                              <div
                                className={`h-full rounded-full ${progressColor(item.progress)}`}
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="mt-3 h-1.5 w-32 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${progressColor(Math.round(monthProgress))}`}
                    style={{ width: `${monthProgress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
