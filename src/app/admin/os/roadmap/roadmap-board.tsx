"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { OsStatusBadge, OsPriorityBadge, OsTypeBadge } from "@/components/admin/os/os-badge";
import { OS_STATUS_META, OS_PRIORITY_META, OS_TYPE_META, progressColor } from "@/lib/os-labels";
import { fmtDate, daysUntil, pct } from "@/lib/os-utils";
import {
  Plus,
  Loader2,
  MoreHorizontal,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Edit3,
  Trash2,
  CheckSquare,
  CalendarIcon,
} from "lucide-react";

const ROADMAP_STATUSES = Object.keys(OS_STATUS_META).filter((s) =>
  [
    "PLANNED",
    "READY",
    "DEVELOPMENT",
    "REVIEW",
    "TESTING",
    "VALIDATION",
    "DONE",
    "RELEASED",
  ].includes(s),
);
const PRIORITY_KEYS = Object.keys(OS_PRIORITY_META);
const TYPE_KEYS = Object.keys(OS_TYPE_META);

interface OsProject {
  id: string;
  slug: string;
  name: string;
  color: string;
}

interface OsRoadmapItem {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  priority: string;
  progress: number;
  startDate: Date | null;
  endDate: Date | null;
  estimatedHours: number;
  actualHours: number;
  roi: number;
  impact: number;
  dependencies: string | null;
  risks: string | null;
  createdAt: Date;
  updatedAt: Date;
  project: { id: string; slug: string; name: string; color: string };
}

export function RoadmapBoard({ projects }: { projects: OsProject[] }) {
  const queryClient = useQueryClient();
  const [projectId, setProjectId] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<OsRoadmapItem | null>(null);

  const itemsQuery = useQuery<OsRoadmapItem[]>({
    queryKey: ["os-roadmap", projectId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (projectId !== "all") params.set("projectId", projectId);
      const res = await fetch(`/api/admin/os/roadmap?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["os-roadmap"] });
    queryClient.invalidateQueries({ queryKey: ["roadmap-stats"] });
  };

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/admin/os/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Échec de l'enregistrement");
    },
    onSuccess: () => {
      toast.success("Roadmap item enregistré");
      invalidate();
      setCreateOpen(false);
      setEditing(null);
    },
    onError: () => toast.error("Échec de l'enregistrement"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/admin/os/roadmap", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Échec de la suppression");
    },
    onSuccess: () => {
      toast.success("Roadmap item supprimé");
      invalidate();
    },
    onError: () => toast.error("Échec de la suppression"),
  });

  const items = itemsQuery.data ?? [];
  const loading = itemsQuery.isLoading;
  const totalHours = items.reduce((a, i) => a + i.estimatedHours, 0);
  const actualHours = items.reduce((a, i) => a + i.actualHours, 0);

  function handleSubmit(data: Record<string, unknown>, isNew: boolean) {
    const base = {
      projectId: data.projectId,
      title: data.title,
      description: data.description || null,
      type: data.type,
      status: data.status,
      priority: data.priority,
      progress: Number(data.progress ?? 0),
      startDate: data.startDate ? new Date(data.startDate as string) : null,
      endDate: data.endDate ? new Date(data.endDate as string) : null,
      estimatedHours: Number(data.estimatedHours ?? 0),
      actualHours: Number(data.actualHours ?? 0),
      roi: Number(data.roi ?? 0),
      impact: Number(data.impact ?? 0),
      dependencies: data.dependencies || null,
      risks: data.risks || null,
    };
    saveMutation.mutate(isNew ? base : { ...base, id: data.id });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger className="w-[220px] text-xs">
            <SelectValue placeholder="Tous les projets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les projets</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          className="text-xs"
          onClick={() => setCreateOpen(true)}
          disabled={saveMutation.isPending}
        >
          <Plus className="h-3.5 w-3.5" />
          Nouvel item
        </Button>
      </div>

      <p className="text-[13px] text-gray-500">
        {items.length} items · {totalHours}h estimées · {actualHours}h consommées
      </p>

      {loading ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" /> Chargement…
        </div>
      ) : items.length === 0 ? (
        <OsEmpty
          title="Roadmap vide"
          hint="Ajoutez des items roadmap pour planifier la trajectoire produit."
        />
      ) : (
        <div className="space-y-3">
          {items.map((r) => {
            const d = daysUntil(r.endDate);
            const over = r.estimatedHours > 0 && r.actualHours > r.estimatedHours;
            return (
              <Card key={r.id} className="border-border bg-card shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ background: r.project.color }}
                        />
                        <p className="text-[14px] font-medium">{r.title}</p>
                        <OsStatusBadge status={r.status} />
                        <OsPriorityBadge priority={r.priority} />
                        <OsTypeBadge type={r.type} />
                      </div>
                      <p className="mt-1 text-[11px] text-gray-400">
                        {r.project.name} · {fmtDate(r.startDate)} → {fmtDate(r.endDate)}
                        {d !== null && d >= 0 ? (
                          <span className="ml-1 text-amber-500">· dans {d} j</span>
                        ) : null}
                        {d !== null && d < 0 && r.progress < 100 ? (
                          <span className="ml-1 text-rose-500">· en retard de {-d} j</span>
                        ) : null}
                      </p>
                      {r.dependencies && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                          <AlertTriangle className="h-3 w-3" /> Dépend : {r.dependencies}
                        </span>
                      )}
                      {r.risks && (
                        <span className="mt-1 ml-2 inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                          <AlertTriangle className="h-3 w-3" /> Risque : {r.risks}
                        </span>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-gray-600"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setEditing(r)}>
                          <Edit3 className="mr-2 h-3.5 w-3.5" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-rose-600"
                          onClick={() => deleteMutation.mutate(r.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                      <div
                        className={`h-full rounded-full ${progressColor(r.progress)}`}
                        style={{ width: `${r.progress}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold">{pct(r.progress)}</span>
                  </div>

                  <div className="mt-2 flex items-center gap-4 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" /> ROI {r.roi}% · Impact {r.impact}%
                    </span>
                    <span className={over ? "font-semibold text-rose-500" : ""}>
                      {r.actualHours}/{r.estimatedHours}h
                    </span>
                    {r.status === "DONE" || r.status === "RELEASED" ? (
                      <span className="flex items-center gap-1 text-emerald-500">
                        <CheckSquare className="h-3.5 w-3.5" /> Livré
                      </span>
                    ) : null}
                  </div>

                  {r.startDate && r.endDate ? (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-gray-400">
                      <CalendarIcon className="h-3 w-3" />
                      {fmtDate(r.startDate)} → {fmtDate(r.endDate)}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ItemDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Nouvel item roadmap"
        projects={projects}
        onSubmit={(data) => handleSubmit(data, true)}
        submitting={saveMutation.isPending}
      />
      <ItemDialog
        open={!!editing}
        onOpenChange={(open) => (!open ? setEditing(null) : null)}
        title="Modifier l'item"
        projects={projects}
        initial={editing ?? undefined}
        onSubmit={(data) => handleSubmit(data, false)}
        submitting={saveMutation.isPending}
      />
    </div>
  );
}

function ItemDialog({
  open,
  onOpenChange,
  title,
  projects,
  initial,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  projects: OsProject[];
  initial?: OsRoadmapItem;
  onSubmit: (data: Record<string, unknown>) => void;
  submitting: boolean;
}) {
  const [form, setForm] = useState<Record<string, unknown>>({
    projectId: initial?.projectId ?? projects[0]?.id ?? "",
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    type: initial?.type ?? "FEATURE",
    status: initial?.status ?? "PLANNED",
    priority: initial?.priority ?? "MEDIUM",
    progress: initial?.progress ?? 0,
    startDate: initial?.startDate ? new Date(initial.startDate).toISOString().split("T")[0] : "",
    endDate: initial?.endDate ? new Date(initial.endDate).toISOString().split("T")[0] : "",
    estimatedHours: initial?.estimatedHours ?? 0,
    actualHours: initial?.actualHours ?? 0,
    roi: initial?.roi ?? 0,
    impact: initial?.impact ?? 0,
    dependencies: initial?.dependencies ?? "",
    risks: initial?.risks ?? "",
  });

  const handleChange = (key: string, value: unknown) => setForm((p) => ({ ...p, [key]: value }));

  function handleSubmit() {
    if (!form.title) {
      toast.error("Le titre est requis");
      return;
    }
    onSubmit({ ...form, id: initial?.id });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Complétez les informations du roadmap item.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2 text-sm">
          <div className="grid gap-1.5">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              className="text-xs"
              value={(form.title as string) ?? ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Nom de la fonctionnalité"
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Projet</Label>
            <Select
              value={form.projectId as string}
              onValueChange={(v) => handleChange("projectId", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                      {p.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select value={form.type as string} onValueChange={(v) => handleChange("type", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_KEYS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {OS_TYPE_META[t]?.label ?? t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Priorité</Label>
              <Select
                value={form.priority as string}
                onValueChange={(v) => handleChange("priority", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_KEYS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {OS_PRIORITY_META[p]?.label ?? p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Statut</Label>
              <Select
                value={form.status as string}
                onValueChange={(v) => handleChange("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROADMAP_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {OS_STATUS_META[s]?.label ?? s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="progress">Progression (%)</Label>
              <Input
                id="progress"
                type="number"
                min={0}
                max={100}
                value={(form.progress as number) ?? 0}
                onChange={(e) => handleChange("progress", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={(form.startDate as string) ?? ""}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={(form.endDate as string) ?? ""}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="estimatedHours">h Estimées</Label>
              <Input
                id="estimatedHours"
                type="number"
                min={0}
                value={(form.estimatedHours as number) ?? 0}
                onChange={(e) => handleChange("estimatedHours", Number(e.target.value))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="actualHours">h Consommées</Label>
              <Input
                id="actualHours"
                type="number"
                min={0}
                value={(form.actualHours as number) ?? 0}
                onChange={(e) => handleChange("actualHours", Number(e.target.value))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="roi">ROI (%)</Label>
              <Input
                id="roi"
                type="number"
                min={0}
                value={(form.roi as number) ?? 0}
                onChange={(e) => handleChange("roi", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="impact">Impact (%)</Label>
              <Input
                id="impact"
                type="number"
                min={0}
                max={100}
                value={(form.impact as number) ?? 0}
                onChange={(e) => handleChange("impact", Number(e.target.value))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="type-legacy" />
              <MapPin className="h-4 w-4 text-gray-300" />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="dependencies">Dépendances</Label>
            <Input
              id="dependencies"
              value={(form.dependencies as string) ?? ""}
              onChange={(e) => handleChange("dependencies", e.target.value)}
              placeholder="ex: Auth v2"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="risks">Risques</Label>
            <Textarea
              id="risks"
              value={(form.risks as string) ?? ""}
              onChange={(e) => handleChange("risks", e.target.value)}
              placeholder="ex: Dépendance au provider Stripe"
              rows={2}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={(form.description as string) ?? ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="text-xs"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Annuler
          </Button>
          <Button className="text-xs" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
