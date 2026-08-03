"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OsPriorityBadge } from "@/components/admin/os/os-badge";
import { OS_STATUS_META, getPriorityMeta } from "@/lib/os-labels";
import { Plus, Loader2, MoreHorizontal, GripVertical } from "lucide-react";

interface OsProject {
  id: string;
  slug: string;
  name: string;
  color: string;
}

interface OsFeature {
  id: string;
  title: string;
  status: string;
  priority: string;
  points: number;
  description: string | null;
  project: { id: string; slug: string; name: string; color: string } | null;
  module: { id: string; name: string } | null;
  epic: { id: string; name: string } | null;
  assignee: { id: string; name: string | null } | null;
}

const COLUMNS = [
  { title: "Backlog", statuses: ["BACKLOG"], color: "#94a3b8" },
  { title: "Planifiées", statuses: ["PLANNED", "READY"], color: "#0ea5e9" },
  { title: "En développement", statuses: ["DEVELOPMENT"], color: "#3b82f6" },
  { title: "En revue", statuses: ["REVIEW", "TESTING", "VALIDATION"], color: "#8b5cf6" },
  { title: "Livrées", statuses: ["DONE", "RELEASED"], color: "#10b981" },
];

const ALL_STATUSES = Object.keys(OS_STATUS_META).filter((s) =>
  ["BACKLOG", "PLANNED", "READY", "DEVELOPMENT", "REVIEW", "TESTING", "VALIDATION", "DONE", "RELEASED"].includes(s),
);

export function FeaturesBoard({ projects }: { projects: OsProject[] }) {
  const queryClient = useQueryClient();
  const [projectId, setProjectId] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);

  const featuresQuery = useQuery<OsFeature[]>({
    queryKey: ["os-features", projectId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (projectId !== "all") params.set("projectId", projectId);
      const res = await fetch(`/api/admin/os/features?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["os-features"] });

  const moveMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch("/api/admin/os/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      toast.success("Feature déplacée");
      invalidate();
    },
    onError: () => toast.error("Échec du déplacement"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/admin/os/features", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      toast.success("Feature supprimée");
      invalidate();
    },
  });

  const features = featuresQuery.data ?? [];
  const loading = featuresQuery.isLoading;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="w-[220px] text-xs">
              <SelectValue placeholder="Tous les projets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les projets</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" className="h-8 bg-primary text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4]" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Nouvelle feature
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {COLUMNS.map((col) => {
          const items = features.filter((f) => col.statuses.includes(f.status));
          const points = items.reduce((a, f) => a + f.points, 0);
          return (
            <div key={col.title} className="flex min-h-[300px] flex-col rounded-xl border border-gray-200/80 bg-gray-50/60 dark:border-border dark:bg-white/[0.03]">
              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: col.color }} />
                  <p className="text-[12px] font-semibold text-gray-600 dark:text-gray-300">{col.title}</p>
                </div>
                <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 shadow-sm dark:bg-white/10">
                  {items.length} · {points} pts
                </span>
              </div>
              <div className="flex-1 space-y-2 px-2 pb-2">
                {loading && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
                  </div>
                )}
                {!loading && items.length === 0 && <p className="px-1 py-4 text-center text-[11px] text-gray-400">Aucune feature</p>}
                {items.map((f) => (
                  <div key={f.id} className="group rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between gap-2">
                      <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-200 dark:text-gray-600" />
                      <p className="min-w-0 flex-1 text-[13px] font-medium leading-snug">{f.title}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="shrink-0 rounded-md p-1 text-gray-300 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100 dark:hover:bg-white/10 dark:hover:text-gray-300">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuLabel>Déplacer vers</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {ALL_STATUSES.map((s) => (
                            <DropdownMenuItem key={s} disabled={f.status === s} onClick={() => moveMutation.mutate({ id: f.id, status: s })}>
                              <span className="flex w-full items-center justify-between">
                                {OS_STATUS_META[s]?.label ?? s}
                                {f.status === s && <span className="text-[10px] text-gray-400">actuel</span>}
                              </span>
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-rose-500 focus:text-rose-500" onClick={() => deleteMutation.mutate(f.id)}>
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <OsPriorityBadge priority={f.priority} />
                      <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-white/5 dark:text-gray-400">
                        {f.points} pts
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-400">
                      {f.project && (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: f.project.color }} />
                          <span className="truncate">{f.project.name}</span>
                        </>
                      )}
                      {f.module && (
                        <>
                          <span>·</span>
                          <span className="truncate">{f.module.name}</span>
                        </>
                      )}
                      {f.assignee && (
                        <>
                          <span>·</span>
                          <span className="truncate">{f.assignee.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <CreateFeatureDialog open={createOpen} onOpenChange={setCreateOpen} projects={projects} onCreated={invalidate} />
    </div>
  );
}

function CreateFeatureDialog({
  open,
  onOpenChange,
  projects,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: OsProject[];
  onCreated: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    status: "BACKLOG",
    priority: "MEDIUM",
    points: "3",
  });
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.projectId) {
      toast.error("Titre et projet sont requis");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/admin/os/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description || null,
          projectId: form.projectId,
          status: form.status,
          priority: form.priority,
          points: Number(form.points) || 1,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Feature créée");
      setForm({ title: "", description: "", projectId: "", status: "BACKLOG", priority: "MEDIUM", points: "3" });
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["os-features"] });
      onCreated();
    } catch {
      toast.error("Échec de la création");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle feature</DialogTitle>
          <DialogDescription>Créez une fonctionnalité pour un projet.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Titre</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex. Paiement Stripe" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Projet</Label>
              <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v })}>
                <SelectTrigger className="text-xs"><SelectValue placeholder="Choisir" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Statut</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{OS_STATUS_META[s]?.label ?? s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priorité</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["URGENT", "HIGH", "MEDIUM", "LOW"].map((p) => (
                    <SelectItem key={p} value={p}>{getPriorityMeta(p).label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Points (story points)</Label>
              <Input type="number" min={1} value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" size="sm" disabled={pending} className="bg-primary text-white hover:bg-[#7323c4]">
              {pending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}Créer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
