"use client";

import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RoadmapDashboard } from "./roadmap-dashboard";
import { RoadmapKanban } from "./roadmap-kanban";
import { RoadmapModules } from "./roadmap-modules";
import { RoadmapTimeline } from "./roadmap-timeline";
import { RoadmapBugs } from "./roadmap-bugs";
import { RoadmapHistory } from "./roadmap-history";
import { RoadmapCharts } from "./roadmap-charts";
import { FeatureDrawer } from "./feature-drawer";
import { BugDrawer } from "./bug-drawer";
import { useRoadmapEvents } from "@/lib/hooks/use-roadmap-events";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KanbanSquare, Blocks, CalendarDays, Bug, Search, X, History, Loader2 } from "lucide-react";
import type {
  OsProject,
  OsModule,
  OsFeature,
  OsBug,
  OsRoadmapItem,
  RoadmapStats,
  ViewMode,
  FilterStatus,
  FilterPriority,
  BugSeverity,
} from "./types";

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "Tous les statuts" },
  { value: "BACKLOG", label: "Backlog" },
  { value: "PLANNED", label: "Planifiée" },
  { value: "READY", label: "Prête" },
  { value: "DEVELOPMENT", label: "En dev" },
  { value: "REVIEW", label: "Revue" },
  { value: "TESTING", label: "Tests" },
  { value: "VALIDATION", label: "Validation" },
  { value: "DONE", label: "Terminée" },
  { value: "RELEASED", label: "Publiée" },
];

const PRIORITY_OPTIONS: { value: FilterPriority; label: string }[] = [
  { value: "all", label: "Toutes priorités" },
  { value: "URGENT", label: "Critique" },
  { value: "HIGH", label: "Haute" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "LOW", label: "Basse" },
];

const SEVERITY_OPTIONS: { value: BugSeverity; label: string }[] = [
  { value: "all", label: "Toutes sévérités" },
  { value: "BLOCKER", label: "Bloquant" },
  { value: "CRITICAL", label: "Critique" },
  { value: "MAJOR", label: "Majeure" },
  { value: "MINOR", label: "Mineure" },
  { value: "TRIVIAL", label: "Triviale" },
];

interface RoadmapData {
  projects: OsProject[];
  stats: RoadmapStats;
  modules: OsModule[];
  features: OsFeature[];
  bugs: OsBug[];
  roadmapItems: OsRoadmapItem[];
}

export function RoadmapApp({
  initialStats,
  initialProjects,
  initialModules,
  initialFeatures,
  initialBugs,
  initialRoadmapItems,
}: {
  initialStats: RoadmapStats;
  initialProjects: OsProject[];
  initialModules: OsModule[];
  initialFeatures: OsFeature[];
  initialBugs: OsBug[];
  initialRoadmapItems: OsRoadmapItem[];
}) {
  const queryClient = useQueryClient();
  const [view, setView] = useState<ViewMode>("kanban");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>("all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<BugSeverity>("all");
  const [selectedFeature, setSelectedFeature] = useState<OsFeature | null>(null);
  const [selectedBug, setSelectedBug] = useState<OsBug | null>(null);

  useRoadmapEvents();

  const { data: liveData, isFetching } = useQuery<RoadmapData>({
    queryKey: ["roadmap-data"],
    queryFn: async () => {
      const res = await fetch("/api/roadmap");
      if (!res.ok) throw new Error("roadmap");
      return res.json();
    },
    initialData: {
      stats: initialStats,
      projects: initialProjects,
      modules: initialModules,
      features: initialFeatures,
      bugs: initialBugs,
      roadmapItems: initialRoadmapItems,
    },
    refetchInterval: 30_000,
    staleTime: 20_000,
  });

  const { data: liveStats } = useQuery({
    queryKey: ["roadmap-stats"],
    queryFn: async () => {
      const res = await fetch("/api/roadmap/stats");
      if (!res.ok) throw new Error("stats");
      return res.json() as Promise<RoadmapStats>;
    },
    initialData: initialStats,
    refetchInterval: 15_000,
    staleTime: 10_000,
  });

  const moveFeatureMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/roadmap/features?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(err?.error ?? "Échec");
      }
      return res.json();
    },
    onMutate: ({ id, status }) => {
      const prev = queryClient.getQueryData<RoadmapData>(["roadmap-data"]);
      if (prev) {
        queryClient.setQueryData<RoadmapData>(["roadmap-data"], {
          ...prev,
          features: prev.features.map((f) => (f.id === id ? { ...f, status } : f)),
        });
      }
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(["roadmap-data"], context.prev);
      toast.error("Échec du déplacement de la feature");
    },
    onSuccess: () => {
      toast.success("Feature déplacée");
      queryClient.invalidateQueries({ queryKey: ["roadmap-stats"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-history"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap-data"] });
    },
  });

  const features = liveData?.features ?? initialFeatures;
  const bugs = liveData?.bugs ?? initialBugs;
  const modules = liveData?.modules ?? initialModules;
  const projects = liveData?.projects ?? initialProjects;
  const roadmapItems = liveData?.roadmapItems ?? initialRoadmapItems;

  const filteredFeatures = useMemo(() => {
    return features.filter((f) => {
      if (
        search &&
        !(
          f.title.toLowerCase().includes(search.toLowerCase()) ||
          (f.description?.toLowerCase() ?? "").includes(search.toLowerCase())
        )
      )
        return false;
      if (statusFilter !== "all" && f.status !== statusFilter) return false;
      if (priorityFilter !== "all" && f.priority !== priorityFilter) return false;
      if (moduleFilter !== "all" && f.module?.name !== moduleFilter) return false;
      if (projectFilter !== "all" && f.project?.slug !== projectFilter) return false;
      return true;
    });
  }, [features, search, statusFilter, priorityFilter, moduleFilter, projectFilter]);

  const filteredBugs = useMemo(() => {
    return bugs.filter((b) => {
      if (
        search &&
        !(
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          (b.description?.toLowerCase() ?? "").includes(search.toLowerCase())
        )
      )
        return false;
      if (severityFilter !== "all" && b.severity !== severityFilter) return false;
      if (projectFilter !== "all" && b.project?.slug !== projectFilter) return false;
      return true;
    });
  }, [bugs, search, severityFilter, projectFilter]);

  const modulesForFilter = useMemo(() => {
    const set = new Set<string>();
    for (const f of features) {
      if (f.module?.name) set.add(f.module.name);
    }
    return Array.from(set).sort();
  }, [features]);

  const activeFilters = [
    statusFilter,
    priorityFilter,
    moduleFilter,
    projectFilter,
    severityFilter,
    search,
  ].filter((v) => v !== "all" && v !== "").length;

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setModuleFilter("all");
    setProjectFilter("all");
    setSeverityFilter("all");
  }

  const showSeverity = view === "bugs";

  return (
    <div className="bg-background min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Roadmap</h1>
            {isFetching && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            Feuille de route interactive du projet Wabtechs Platform — suivez l&apos;avancement des
            fonctionnalités, modules et bugs en temps réel (SSE).
          </p>
        </header>

        <RoadmapDashboard stats={liveStats ?? initialStats} />
        <RoadmapCharts modules={modules} features={features} stats={liveStats ?? initialStats} />

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as ViewMode)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid h-9 w-full grid-cols-5 gap-1 sm:w-auto">
              <TabsTrigger value="kanban" className="text-xs">
                <KanbanSquare className="mr-1.5 h-3.5 w-3.5" /> Kanban
              </TabsTrigger>
              <TabsTrigger value="modules" className="text-xs">
                <Blocks className="mr-1.5 h-3.5 w-3.5" /> Modules
              </TabsTrigger>
              <TabsTrigger value="timeline" className="text-xs">
                <CalendarDays className="mr-1.5 h-3.5 w-3.5" /> Timeline
              </TabsTrigger>
              <TabsTrigger value="bugs" className="text-xs">
                <Bug className="mr-1.5 h-3.5 w-3.5" /> Bugs
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs">
                <History className="mr-1.5 h-3.5 w-3.5" /> Historique
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {view !== "history" && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher une fonctionnalité..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 pl-8 text-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="h-9 w-[160px] text-xs">
                  <SelectValue placeholder="Projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les projets</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.slug}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as FilterStatus)}
              >
                <SelectTrigger className="h-9 w-[160px] text-xs">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={priorityFilter}
                onValueChange={(v) => setPriorityFilter(v as FilterPriority)}
              >
                <SelectTrigger className="h-9 w-[150px] text-xs">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {!showSeverity && (
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger className="h-9 w-[150px] text-xs">
                    <SelectValue placeholder="Module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les modules</SelectItem>
                    {modulesForFilter.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {showSeverity && (
                <Select
                  value={severityFilter}
                  onValueChange={(v) => setSeverityFilter(v as BugSeverity)}
                >
                  <SelectTrigger className="h-9 w-[160px] text-xs">
                    <SelectValue placeholder="Sévérité" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITY_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="rounded-md px-2 py-1 text-[11px] text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  Effacer ({activeFilters})
                </button>
              )}
            </div>
          )}
        </div>

        {/* View content */}
        <Tabs value={view}>
          <TabsContent value="kanban" className="mt-0">
            <RoadmapKanban
              features={filteredFeatures}
              onViewFeature={setSelectedFeature}
              onMoveFeature={(id, status) => moveFeatureMutation.mutate({ id, status })}
            />
          </TabsContent>

          <TabsContent value="modules" className="mt-0">
            <RoadmapModules modules={modules} features={filteredFeatures} />
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            <RoadmapTimeline roadmapItems={roadmapItems} />
          </TabsContent>

          <TabsContent value="bugs" className="mt-0">
            <RoadmapBugs bugs={filteredBugs} onViewBug={setSelectedBug} />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <RoadmapHistory />
          </TabsContent>
        </Tabs>
      </div>

      {selectedFeature && (
        <FeatureDrawer
          feature={selectedFeature}
          open={true}
          onOpenChange={(o) => !o && setSelectedFeature(null)}
        />
      )}
      {selectedBug && (
        <BugDrawer bug={selectedBug} open={true} onOpenChange={(o) => !o && setSelectedBug(null)} />
      )}
    </div>
  );
}
