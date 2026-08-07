"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OsPriorityBadge, OsStatusBadge } from "@/components/admin/os/os-badge";
import { progressColor } from "@/lib/os-labels";
import { GripVertical, Bug, User } from "lucide-react";
import type { OsFeature } from "./types";

export const KANBAN_COLUMNS = [
  { key: "BACKLOG", title: "Backlog", color: "#94a3b8" },
  { key: "PLANNED,READY", title: "Planifiée", color: "#0ea5e9" },
  { key: "DEVELOPMENT", title: "En dev", color: "#3b82f6" },
  { key: "REVIEW,TESTING,VALIDATION", title: "En revue", color: "#8b5cf6" },
  { key: "DONE,RELEASED", title: "Terminée", color: "#10b981" },
] as const;

export function getColumnStatus(col: (typeof KANBAN_COLUMNS)[number]["key"]): string[] {
  return col.split(",");
}

export function RoadmapKanban({
  features,
  onViewFeature,
}: {
  features: OsFeature[];
  onViewFeature: (f: OsFeature) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[780px] gap-4 pb-4">
        {KANBAN_COLUMNS.map((col) => {
          const statuses = getColumnStatus(col.key);
          const items = features.filter((f) => statuses.includes(f.status));
          const points = items.reduce((a, f) => a + f.points, 0);
          return (
            <div key={col.key} className="flex min-w-[150px] flex-1 flex-col">
              <div
                className="mb-2 flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold"
                style={{ backgroundColor: `${col.color}10`, color: col.color }}
              >
                <span>{col.title}</span>
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {items.length}
                </Badge>
              </div>

              <div className="flex-1 space-y-2 rounded-lg border-2 border-dashed border-transparent bg-gray-50/60 p-2 dark:bg-white/[0.02]">
                {items.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground text-[11px]">Aucune feature</p>
                  </div>
                ) : (
                  items.map((f) => <FeatureCard key={f.id} feature={f} onView={onViewFeature} />)
                )}
                {items.length > 0 && (
                  <div className="text-muted-foreground mt-1 text-[10px] font-medium">
                    {points} pts
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeatureCard({ feature, onView }: { feature: OsFeature; onView: (f: OsFeature) => void }) {
  const done = feature.subtaskDone;
  const total = feature.subtaskTotal;
  const pct = total > 0 ? Math.round((done / total) * 100) : feature.progress;
  const project = feature.project;

  return (
    <Card
      className="group border-border bg-card cursor-pointer py-3 shadow-sm transition-shadow hover:shadow-md"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", feature.id);
      }}
      onClick={() => onView(feature)}
    >
      <CardContent className="px-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300 dark:text-gray-600" />
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: project?.color }}
            />
            <p className="min-w-0 flex-1 text-[13px] font-medium break-all">{feature.title}</p>
          </div>
          <OsPriorityBadge priority={feature.priority} />
        </div>

        {feature.module && (
          <p className="mt-1 truncate text-[11px] text-gray-500 dark:text-gray-400">
            {feature.module.name}
          </p>
        )}

        <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400">
          {feature.assignee && (
            <>
              <User className="h-3 w-3" />
              <span className="truncate">{feature.assignee.name ?? "—"}</span>
            </>
          )}
          <span className="truncate">• {feature.points} pts</span>
          <span className="flex items-center gap-1">
            <Bug className="h-3 w-3" />
            {feature.bugCount ?? 0}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
            <div
              className={`h-full rounded-full transition-all ${progressColor(pct)}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="w-8 text-right text-[11px] font-semibold">{pct}%</span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <OsStatusBadge status={feature.status} />
          {total > 0 && (
            <span className="text-[10px] text-gray-400">
              {done}/{total} tâches
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
