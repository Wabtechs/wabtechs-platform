"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  PlayCircle,
  Clock,
  PauseCircle,
  Bug,
  CalendarCheck,
  BarChart3,
} from "lucide-react";
import type { RoadmapStats } from "./types";

const DONE_COLOR = "text-emerald-500";
const INPROGRESS_COLOR = "text-blue-500";
const PLANNED_COLOR = "text-sky-500";
const BACKLOG_COLOR = "text-slate-500";
const BUG_COLOR = "text-rose-500";

export function RoadmapDashboard({ stats }: { stats: RoadmapStats }) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tableau de bord</h2>
        <Badge variant="outline" className="text-xs">
          {stats.featureDone}/{stats.featureTotal} features livrées
        </Badge>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Progression globale du projet</span>
          <span className="font-semibold">{stats.projectProgress}%</span>
        </div>
        <div className="relative h-6 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${stats.projectProgress}%`,
              background: `linear-gradient(90, #10b981 0%, #3b82f6 50%, #842ae3 100%)`,
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Terminées"
          value={stats.featureDone}
          icon={<CheckCircle className="h-4 w-4" />}
          accent={DONE_COLOR}
          hint={`${stats.featureTotal} au total`}
        />
        <StatCard
          label="En cours"
          value={stats.featureInProgress}
          icon={<PlayCircle className="h-4 w-4" />}
          accent={INPROGRESS_COLOR}
          hint="Développement, review, tests"
        />
        <StatCard
          label="Planifiées"
          value={stats.featurePlanned}
          icon={<Clock className="h-4 w-4" />}
          accent={PLANNED_COLOR}
        />
        <StatCard
          label="Backlog"
          value={stats.featureBacklog}
          icon={<PauseCircle className="h-4 w-4" />}
          accent={BACKLOG_COLOR}
        />
        <StatCard
          label="Bugs ouverts"
          value={stats.bugOpen}
          icon={<Bug className="h-4 w-4" />}
          accent={BUG_COLOR}
          hint={`${stats.bugCritical} critiques`}
        />
        <StatCard
          label="Modules livrés"
          value={`${stats.moduleDone}/${stats.moduleCount}`}
          icon={<BarChart3 className="h-4 w-4" />}
          accent="text-primary"
        />
        <StatCard
          label="Bugs critiques"
          value={stats.bugCritical}
          icon={<Bug className="h-4 w-4" />}
          accent="text-rose-600"
        />
        <StatCard
          label="Items roadmap"
          value={stats.roadmapCount}
          icon={<CalendarCheck className="h-4 w-4" />}
          accent="text-fuchsia-500"
        />
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex items-start justify-between p-4">
        <div className="min-w-0">
          <p className="text-muted-foreground text-[12px] font-medium">{label}</p>
          <p className={cn("mt-1 truncate text-2xl font-semibold tracking-tight", accent)}>
            {value}
          </p>
          {hint && <p className="text-muted-foreground mt-1 text-[11px]">{hint}</p>}
        </div>
        <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
