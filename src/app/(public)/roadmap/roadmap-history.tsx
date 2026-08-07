"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fmtDate } from "@/lib/os-utils";
import {
  History,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Activity,
  FileText,
  Bug,
  GitBranch,
} from "lucide-react";
import type { OsHistoryPage } from "./types";
const ENTITY_OPTIONS = ["Feature", "Bug", "Module", "Subtask", "RoadmapItem"];

function humanizeAction(action: string): string {
  const map: Record<string, string> = {
    "feature.created": "Feature créée",
    "feature.updated": "Feature mise à jour",
    "feature.deleted": "Feature supprimée",
    "bug.created": "Bug créé",
    "bug.updated": "Bug mis à jour",
    "bug.deleted": "Bug supprimé",
    "module.updated": "Module mis à jour",
    "subtask.updated": "Sous-tâche mise à jour",
    "roadmap.updated": "Roadmap mise à jour",
    CREATE: "Création",
    UPDATE: "Mise à jour",
    DELETE: "Suppression",
  };
  return map[action] ?? action.replace(/\./g, " ");
}

function entityIcon(entity: string) {
  const lower = entity.toLowerCase();
  if (lower.includes("bug")) return <Bug className="h-3.5 w-3.5" />;
  if (lower.includes("feature") || lower.includes("module"))
    return <FileText className="h-3.5 w-3.5" />;
  return <GitBranch className="h-3.5 w-3.5" />;
}

export function RoadmapHistory() {
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [appliedSearch, setAppliedSearch] = useState("");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["roadmap-history", entityFilter, appliedSearch, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (entityFilter !== "all") params.set("entity", entityFilter);
      if (appliedSearch) params.set("search", appliedSearch);
      params.set("page", String(page));
      params.set("limit", "30");
      const res = await fetch(`/api/roadmap/history?${params.toString()}`);
      if (!res.ok) throw new Error("history");
      return res.json() as Promise<OsHistoryPage>;
    },
    placeholderData: (prev) => prev,
  });

  const items = data?.items ?? [];

  function applySearch() {
    setPage(1);
    setAppliedSearch(search.trim());
  }

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:max-w-xs">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applySearch()}
                placeholder="Rechercher dans l'historique..."
                className="h-9 text-sm"
              />
            </div>
            <Select
              value={entityFilter}
              onValueChange={(v) => {
                setEntityFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-[170px] text-xs">
                <SelectValue placeholder="Entité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les entités</SelectItem>
                {ENTITY_OPTIONS.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={applySearch} className="h-9 text-xs">
              Filtrer
            </Button>
            {isFetching && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
          </div>
          <p className="text-muted-foreground mt-3 flex items-center gap-1.5 text-[11px]">
            <History className="h-3.5 w-3.5" />
            {data?.total ?? 0} évènements tracés — historique de développement de A à Z
          </p>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center">
          <Activity className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">Aucun évènement pour ces filtres.</p>
        </div>
      ) : (
        <>
          <div className="border-muted relative ml-4 space-y-5 border-l-2 pl-6">
            {items.map((entry) => (
              <div key={entry.id} className="relative">
                <div className="bg-primary absolute top-1.5 -left-[35px] flex h-5 w-5 items-center justify-center rounded-full text-white">
                  {entityIcon(entry.entity)}
                </div>
                <Card className="border-border bg-card/60">
                  <CardContent className="p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {humanizeAction(entry.action)}
                      </Badge>
                      <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                        {entry.entity} {entry.entityId ? `· ${entry.entityId.slice(0, 8)}…` : ""}
                      </span>
                      <div className="flex-1" />
                      {entry.userName && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <User className="h-3 w-3" /> {entry.userName}
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400">{fmtDate(entry.createdAt)}</span>
                    </div>
                    {entry.details && (
                      <pre className="text-muted-foreground mt-2 max-h-24 overflow-auto rounded-md bg-gray-50 p-2 text-[10px] break-all whitespace-pre-wrap dark:bg-white/[0.04]">
                        {entry.details}
                      </pre>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" /> Précédent
            </Button>
            <span className="text-[11px] text-gray-400">
              Page {data?.page ?? 1} / {data?.totalPages ?? 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={(data?.page ?? 1) >= (data?.totalPages ?? 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
