"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { OsPriorityBadge, OsStatusBadge, OsSeverityBadge } from "@/components/admin/os/os-badge";
import { progressColor } from "@/lib/os-labels";
import { fmtDate } from "@/lib/os-utils";
import { cn } from "@/lib/utils";
import { Check, Plus, Trash2, Loader2, Calendar, User, Tag, BarChart3, Bug } from "lucide-react";
import type { OsFeature } from "./types";

const FEATURE_STATUSES = [
  "BACKLOG",
  "PLANNED",
  "READY",
  "DEVELOPMENT",
  "REVIEW",
  "TESTING",
  "VALIDATION",
  "DONE",
  "RELEASED",
  "ARCHIVED",
];

export function FeatureDrawer({
  feature,
  open,
  onOpenChange,
}: {
  feature: OsFeature;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const toggleSubtaskMutation = useMutation({
    mutationFn: async ({ id, done }: { id: string; done: boolean }) => {
      const res = await fetch("/api/roadmap/subtasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, done }),
      });
      if (!res.ok) throw new Error("Échec");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Tâche mise à jour");
      queryClient.invalidateQueries({ queryKey: ["roadmap-stats"] });
    },
    onError: () => toast.error("Échec de la mise à jour"),
  });

  const createSubtaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch("/api/roadmap/subtasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId: feature.id, title }),
      });
      if (!res.ok) throw new Error("Échec");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Sous-tâche ajoutée");
      setNewSubtaskTitle("");
      queryClient.invalidateQueries({ queryKey: ["roadmap-stats"] });
    },
    onError: () => toast.error("Échec de la création"),
  });

  const deleteSubtaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/roadmap/subtasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Échec");
    },
    onSuccess: () => {
      toast.success("Sous-tâche supprimée");
      queryClient.invalidateQueries({ queryKey: ["roadmap-stats"] });
    },
    onError: () => toast.error("Échec de la suppression"),
  });

  const updateFeatureMutation = useMutation({
    mutationFn: async (data: { status?: string; priority?: string; points?: number }) => {
      const res = await fetch("/api/admin/os/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: feature.id, ...data }),
      });
      if (!res.ok) throw new Error("Échec");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Feature mise à jour");
      queryClient.invalidateQueries({ queryKey: ["roadmap-stats"] });
    },
    onError: () => toast.error("Échec de la mise à jour"),
  });

  const total = feature.subtasks.length;
  const done = feature.subtasks.filter((s) => s.done).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : feature.progress;

  function toggleSubtask(subtask: { id: string; done: boolean }) {
    toggleSubtaskMutation.mutate({ id: subtask.id, done: !subtask.done });
  }

  function handleAddSubtask(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    createSubtaskMutation.mutate(newSubtaskTitle.trim());
  }

  function handleDeleteSubtask(id: string) {
    deleteSubtaskMutation.mutate(id);
  }

  const project = feature.project;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle className="text-[17px]">{feature.title}</DialogTitle>
              <DialogDescription className="mt-1 line-clamp-2 text-[12px]">
                {feature.description ?? "Aucune description"}
              </DialogDescription>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <OsPriorityBadge priority={feature.priority} />
              <OsStatusBadge status={feature.status} />
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 px-6 pb-4">
          <div className="space-y-5">
            {/* Progression */}
            <div>
              <div className="mb-2 flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" /> Progression
                </span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-[11px]">
                <span>
                  {done}/{total} sous-tâches terminées
                </span>
                {total > 0 && <span>• {Math.round((done / total) * 100)}% des tâches</span>}
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                <div
                  className={`h-full rounded-full transition-all ${progressColor(progress)}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Metadonnes */}
            <div className="grid grid-cols-2 gap-4 text-[12px]">
              <div className="text-muted-foreground flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: project?.color }}
                />
                <span>{project?.name ?? "—"}</span>
              </div>
              {feature.module && (
                <div className="text-muted-foreground flex items-center gap-2">
                  <span>Module :</span>
                  <span>{feature.module.name}</span>
                </div>
              )}
              {feature.assignee && (
                <div className="text-muted-foreground flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  <span>Assigné :</span>
                  <span>{feature.assignee.name ?? "—"}</span>
                </div>
              )}
              <div className="text-muted-foreground flex items-center gap-2">
                <span>Story points :</span>
                <span>{feature.points}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Créée : {fmtDate(feature.createdAt)}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Mise à jour : {fmtDate(feature.updatedAt)}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2">
                <Bug className="h-3.5 w-3.5" />
                <span>{feature.bugCount ?? 0} bugs liés</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">{feature.points} pts</span>
              </div>
            </div>

            {/* Bugs liés */}
            {feature.bugs && feature.bugs.length > 0 && (
              <div>
                <p className="text-muted-foreground mb-2 text-[11px] font-medium">Bugs liés</p>
                <div className="space-y-1">
                  {feature.bugs.map((b) => (
                    <div
                      key={b.id}
                      className="dark:border-border flex items-center gap-2 rounded-md border border-gray-100 p-2"
                    >
                      <OsSeverityBadge severity={b.severity} />
                      <span className="text-[12px] break-all">{b.title || b.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checklist des sous-tâches */}
            <div>
              <p className="text-muted-foreground mb-2 text-[11px] font-medium">
                Checklist ({done}/{total})
              </p>
              <div className="space-y-1.5">
                {feature.subtasks.map((s) => (
                  <div
                    key={s.id}
                    className="dark:border-border flex items-center gap-2 rounded-md border border-gray-100 px-2 py-1.5"
                  >
                    <button
                      onClick={() => toggleSubtask(s)}
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-gray-400 text-xs"
                      disabled={toggleSubtaskMutation.isPending}
                    >
                      {s.done && <Check className="h-3 w-3 text-emerald-500" />}
                    </button>
                    <span
                      className={cn(
                        "flex-1 text-[13px] break-all",
                        s.done && "text-muted-foreground line-through",
                      )}
                    >
                      {s.title}
                    </span>
                    <button
                      onClick={() => handleDeleteSubtask(s.id)}
                      className="shrink-0 rounded-md p-1 text-gray-300 opacity-0 transition-colors group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                      disabled={deleteSubtaskMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddSubtask} className="mt-3 flex gap-2">
                <Input
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Nouvelle sous-tâche..."
                  className="h-8 text-sm"
                  disabled={createSubtaskMutation.isPending}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary hover:bg-primary/90 h-8 text-black"
                  disabled={createSubtaskMutation.isPending || !newSubtaskTitle.trim()}
                >
                  {createSubtaskMutation.isPending && (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  )}
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>

            {/* Statut / Priorité rapide */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-[11px]">Statut</Label>
                <Select
                  value={feature.status}
                  onValueChange={(v) => updateFeatureMutation.mutate({ status: v })}
                  disabled={updateFeatureMutation.isPending}
                >
                  <SelectTrigger className="mt-1 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FEATURE_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-[11px]">Priorité</Label>
                <Select
                  value={feature.priority}
                  onValueChange={(v) => updateFeatureMutation.mutate({ priority: v })}
                  disabled={updateFeatureMutation.isPending}
                >
                  <SelectTrigger className="mt-1 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["URGENT", "HIGH", "MEDIUM", "LOW"].map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
