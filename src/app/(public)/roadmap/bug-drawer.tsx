"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { OsPriorityBadge, OsStatusBadge, OsSeverityBadge } from "@/components/admin/os/os-badge";
import { OS_STATUS_META } from "@/lib/os-labels";
import { fmtDate } from "@/lib/os-utils";
import { cn } from "@/lib/utils";
import { Bug, Calendar, User, Zap, Target, Clock, Save, Copy, Loader2 } from "lucide-react";
import type { OsBug, BugDuplicate } from "./types";

const BUG_STATUSES = ["NEW", "TRIAGED", "IN_PROGRESS", "FIXED", "VERIFIED", "CLOSED", "WONTFIX"];
const SEVERITIES = ["TRIVIAL", "MINOR", "MAJOR", "CRITICAL", "BLOCKER"];

export function BugDrawer({
  bug,
  open,
  onOpenChange,
}: {
  bug: OsBug;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const duplicatesQuery = useQuery({
    queryKey: ["roadmap-duplicates", bug.id],
    queryFn: async () => {
      const res = await fetch(`/api/roadmap/bugs/duplicates?bugId=${bug.id}`);
      if (!res.ok) throw new Error("duplicates");
      return res.json() as Promise<{ duplicates: BugDuplicate[] }>;
    },
    enabled: open,
    staleTime: 60_000,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/admin/os/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bug.id, ...data }),
      });
      if (!res.ok) throw new Error("Échec");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Bug mis à jour");
      queryClient.invalidateQueries({ queryKey: ["roadmap-stats"] });
    },
    onError: () => toast.error("Échec de la mise à jour"),
  });

  const project = bug.project;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-rose-500" />
              <DialogTitle className="text-[17px]">{bug.title}</DialogTitle>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <OsSeverityBadge severity={bug.severity} />
              <OsPriorityBadge priority={bug.priority} />
              <OsStatusBadge status={bug.status} />
            </div>
          </div>
          <DialogDescription className="mt-1 line-clamp-2 text-[12px]">
            {bug.description ?? "Aucune description détaillée"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 px-6 pb-4">
          <div className="space-y-5">
            {/* Metadonnees */}
            <div className="grid grid-cols-2 gap-4 text-[12px]">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: project?.color }}
                />
                <span className="text-muted-foreground">Projet :</span>
                <span className="truncate">{project?.name ?? "—"}</span>
              </div>
              {bug.feature && (
                <div className="flex items-center gap-2">
                  <Zap className="text-muted-foreground h-3.5 w-3.5" />
                  <span className="text-muted-foreground">Feature :</span>
                  <span className="truncate">{bug.feature.title}</span>
                </div>
              )}
              {bug.assignee && (
                <div className="flex items-center gap-2">
                  <User className="text-muted-foreground h-3.5 w-3.5" />
                  <span className="text-muted-foreground">Assigné :</span>
                  <span>{bug.assignee.name ?? "—"}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Target className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">Impact :</span>
                <span
                  className={cn(
                    "font-semibold",
                    bug.impact >= 70
                      ? "text-rose-500"
                      : bug.impact >= 40
                        ? "text-amber-500"
                        : "text-gray-400",
                  )}
                >
                  {bug.impact}%
                </span>
              </div>
            </div>

            {/* Doublons potentiels (IA) */}
            <div>
              <p className="text-muted-foreground mb-2 flex items-center gap-1.5 text-[11px] font-medium">
                <Copy className="h-3.5 w-3.5" /> Doublons potentiels
                {duplicatesQuery.isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              </p>
              {duplicatesQuery.isSuccess &&
                (duplicatesQuery.data.duplicates.length === 0 ? (
                  <p className="text-[11px] text-gray-400">Aucun doublon détecté.</p>
                ) : (
                  <div className="space-y-1.5">
                    {duplicatesQuery.data.duplicates.map((d) => (
                      <div
                        key={d.bug.id}
                        className="dark:border-border flex items-center justify-between gap-2 rounded-md border border-gray-100 p-2"
                      >
                        <div className="min-w-0">
                          <p className="text-[12px] break-all">{d.bug.title}</p>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <OsSeverityBadge severity={d.bug.severity} />
                            <span className="text-[10px] text-gray-400">
                              {d.sharedTokens.slice(0, 4).join(", ")}
                            </span>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                            d.similarity >= 0.8
                              ? "bg-rose-500/10 text-rose-500"
                              : "bg-amber-500/10 text-amber-500",
                          )}
                        >
                          {Math.round(d.similarity * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
            </div>

            {/* Champs éditables */}
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-[11px]">Statut</Label>
                <Select
                  value={bug.status}
                  onValueChange={(v) => updateMutation.mutate({ status: v })}
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger className="mt-1 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUG_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {OS_STATUS_META[s]?.label ?? s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-[11px]">Sévérité</Label>
                  <Select
                    value={bug.severity}
                    onValueChange={(v) => updateMutation.mutate({ severity: v })}
                    disabled={updateMutation.isPending}
                  >
                    <SelectTrigger className="mt-1 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEVERITIES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {OS_STATUS_META[s]?.label ?? s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-muted-foreground text-[11px]">Priorité</Label>
                  <Select
                    value={bug.priority}
                    onValueChange={(v) => updateMutation.mutate({ priority: v })}
                    disabled={updateMutation.isPending}
                  >
                    <SelectTrigger className="mt-1 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                        <SelectItem key={p} value={p}>
                          {OS_STATUS_META[p]?.label ?? p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Reproduction / Solution */}
            {bug.reproduce && (
              <div>
                <Label className="text-muted-foreground text-[11px]">Reproduction</Label>
                <div className="dark:border-border mt-1 rounded-md border border-gray-100 p-2">
                  <p className="text-sm break-all whitespace-pre-wrap">{bug.reproduce}</p>
                </div>
              </div>
            )}

            {bug.expected && (
              <div>
                <Label className="text-muted-foreground text-[11px]">Comportement attendu</Label>
                <div className="dark:border-border mt-1 rounded-md border border-gray-100 p-2">
                  <p className="text-sm break-all whitespace-pre-wrap">{bug.expected}</p>
                </div>
              </div>
            )}

            {bug.actual && (
              <div>
                <Label className="text-muted-foreground text-[11px]">Comportement observé</Label>
                <div className="dark:border-border mt-1 rounded-md border border-gray-100 p-2">
                  <p className="text-sm break-all whitespace-pre-wrap">{bug.actual}</p>
                </div>
              </div>
            )}

            {bug.fix && (
              <div>
                <Label className="text-muted-foreground text-[11px]">Solution</Label>
                <div className="dark:border-border mt-1 rounded-md border border-gray-100 p-2">
                  <p className="text-sm break-all whitespace-pre-wrap">{bug.fix}</p>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="text-muted-foreground flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Créé : {fmtDate(bug.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Modifié : {fmtDate(bug.updatedAt)}</span>
              </div>
              {bug.resolvedAt && (
                <div className="flex items-center gap-1 text-emerald-500">
                  <Save className="h-3.5 w-3.5" />
                  <span>Résolu : {fmtDate(bug.resolvedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="border-border flex-shrink-0 justify-end border-t p-4">
          <DialogClose asChild>
            <Button variant="ghost" size="sm">
              Fermer
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
