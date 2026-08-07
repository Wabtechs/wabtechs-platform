"use client";

import { Fragment, useMemo } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { OsModule, OsFeature, RoadmapStats } from "./types";

const RADAR_METRICS = [
  { key: "security", label: "Sécurité" },
  { key: "performance", label: "Performance" },
  { key: "seo", label: "SEO" },
  { key: "accessibility", label: "Accessibilité" },
  { key: "maintainability", label: "Maintenabilité" },
  { key: "testCoverage", label: "Tests" },
] as const;

const STATUS_ORDER = [
  "BACKLOG",
  "PLANNED",
  "READY",
  "DEVELOPMENT",
  "REVIEW",
  "TESTING",
  "VALIDATION",
  "DONE",
  "RELEASED",
];

const STATUS_LABELS: Record<string, string> = {
  BACKLOG: "Backlog",
  PLANNED: "Planifiée",
  READY: "Prête",
  DEVELOPMENT: "En dev",
  REVIEW: "Revue",
  TESTING: "Tests",
  VALIDATION: "Validation",
  DONE: "Terminée",
  RELEASED: "Publiée",
};

function heatColor(value: number, max: number): string {
  if (value === 0) return "hsl(var(--muted))";
  const ratio = value / Math.max(1, max);
  if (ratio >= 0.75) return "#ef4444";
  if (ratio >= 0.5) return "#f59e0b";
  if (ratio >= 0.25) return "#3b82f6";
  return "#10b981";
}

export function RoadmapCharts({
  modules,
  features,
  stats,
}: {
  modules: OsModule[];
  features: OsFeature[];
  stats: RoadmapStats;
}) {
  const radarData = useMemo(() => {
    if (modules.length === 0) return [];
    return RADAR_METRICS.map((m) => {
      const avg = modules.reduce((acc, mod) => acc + (mod[m.key] as number), 0) / modules.length;
      return { metric: m.label, value: Math.round(avg) };
    });
  }, [modules]);

  const statusData = useMemo(() => {
    return STATUS_ORDER.map((s) => ({
      status: STATUS_LABELS[s] ?? s,
      value: stats.featureCounts?.[s] ?? 0,
    })).filter((d) => d.value > 0);
  }, [stats.featureCounts]);

  const heatmapData = useMemo(() => {
    const moduleNames = Array.from(
      new Set(features.map((f) => f.module?.name).filter((m): m is string => Boolean(m))),
    ).slice(0, 8);
    const grid = moduleNames.map((name) => {
      const counts: Record<string, number> = {};
      for (const s of STATUS_ORDER) counts[s] = 0;
      for (const f of features) {
        if (f.module?.name === name && f.status) counts[f.status] = (counts[f.status] ?? 0) + 1;
      }
      return { module: name, counts };
    });
    return { moduleNames, grid };
  }, [features]);

  const maxHeat = useMemo(() => {
    let max = 0;
    for (const row of heatmapData.grid) {
      for (const s of STATUS_ORDER) max = Math.max(max, row.counts[s] ?? 0);
    }
    return max;
  }, [heatmapData.grid]);

  if (radarData.length === 0 && statusData.length === 0) return null;

  return (
    <div className="mb-8 grid gap-4 lg:grid-cols-2">
      {radarData.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Qualité des modules (radar)</CardTitle>
            <CardDescription className="text-[11px]">
              Moyenne réelle sur {modules.length} modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData} outerRadius={80}>
                <PolarGrid stroke="currentColor" className="text-border/50" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke="#842ae3" fill="#842ae3" fillOpacity={0.35} />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Score"]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    fontSize: 12,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {statusData.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Features par statut</CardTitle>
            <CardDescription className="text-[11px]">Données réelles de la base</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={statusData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  className="text-border/60"
                />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 9 }}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" name="Features" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {statusData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        [
                          "#94a3b8",
                          "#0ea5e9",
                          "#14b8a6",
                          "#3b82f6",
                          "#8b5cf6",
                          "#d946ef",
                          "#f59e0b",
                          "#10b981",
                          "#16a34a",
                        ][i] ?? "#842ae3"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {heatmapData.moduleNames.length > 0 && (
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Heatmap — features par module × statut</CardTitle>
            <CardDescription className="text-[11px]">
              Intensité du travail par module et statut
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `160px repeat(${STATUS_ORDER.length}, minmax(40px, 1fr))`,
                }}
              >
                <div />
                {STATUS_ORDER.map((s) => (
                  <div key={s} className="text-muted-foreground text-center text-[9px] font-medium">
                    {STATUS_LABELS[s]}
                  </div>
                ))}
                {heatmapData.grid.map((row) => (
                  <Fragment key={String(row.module)}>
                    <div className="truncate pr-2 text-right text-[10px] text-gray-500">
                      {row.module}
                    </div>
                    {STATUS_ORDER.map((s) => {
                      const value = row.counts[s] ?? 0;
                      return (
                        <div
                          key={`${row.module}-${s}`}
                          title={`${row.module} · ${STATUS_LABELS[s]} : ${value}`}
                          className="flex h-6 items-center justify-center rounded text-[10px] font-semibold"
                          style={{
                            backgroundColor: heatColor(value, maxHeat),
                            color:
                              value > 0 && value >= maxHeat * 0.5
                                ? "white"
                                : "hsl(var(--foreground))",
                          }}
                        >
                          {value > 0 ? value : ""}
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
