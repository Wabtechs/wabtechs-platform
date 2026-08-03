"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OsPriorityBadge, OsSeverityBadge } from "@/components/admin/os/os-badge";
import { getPriorityMeta, getSeverityMeta, OS_STATUS_META } from "@/lib/os-labels";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface OsProject {
  id: string;
  slug: string;
  name: string;
  color: string;
}

interface OsBug {
  id: string;
  title: string;
  severity: string;
  priority: string;
  status: string;
  impact: number;
  fixHours: number;
  version: string | null;
  project: { id: string; name: string; color: string } | null;
  assignee: { id: string; name: string | null } | null;
}

const BUG_STATUSES = ["NEW", "TRIAGED", "IN_PROGRESS", "FIXED", "VERIFIED", "CLOSED", "WONTFIX"];

export function BugsTable({ projects }: { projects: OsProject[] }) {
  const queryClient = useQueryClient();
  const [projectId, setProjectId] = useState("all");
  const [status, setStatus] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);

  const bugsQuery = useQuery<OsBug[]>({
    queryKey: ["os-bugs", projectId, status, severity],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (projectId !== "all") params.set("projectId", projectId);
      if (status !== "all") params.set("status", status);
      if (severity !== "all") params.set("severity", severity);
      const res = await fetch(`/api/admin/os/bugs?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["os-bugs"] });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const res = await fetch("/api/admin/os/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      toast.success("Bug mis à jour");
      invalidate();
    },
    onError: () => toast.error("Échec de la mise à jour"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/admin/os/bugs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      toast.success("Bug supprimé");
      invalidate();
    },
  });

  const bugs = bugsQuery.data ?? [];
  const loading = bugsQuery.isLoading;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="w-[200px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les projets</SelectItem>
              {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[150px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {BUG_STATUSES.map((s) => <SelectItem key={s} value={s}>{OS_STATUS_META[s]?.label ?? s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="w-[150px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes sévérités</SelectItem>
                  {["BLOCKER", "CRITICAL", "MAJOR", "MINOR", "TRIVIAL"].map((s) => <SelectItem key={s} value={s}>{getSeverityMeta(s).label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" className="h-8 bg-primary text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4]" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Nouveau bug
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px]">Bug</TableHead>
              <TableHead className="text-[11px]">Sévérité</TableHead>
              <TableHead className="text-[11px]">Priorité</TableHead>
              <TableHead className="text-[11px]">Statut</TableHead>
              <TableHead className="hidden text-right text-[11px] md:table-cell">Impact</TableHead>
              <TableHead className="hidden text-right text-[11px] md:table-cell">Fix (h)</TableHead>
              <TableHead className="hidden text-[11px] lg:table-cell">Assigné à</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-gray-300" />
                </TableCell>
              </TableRow>
            )}
            {!loading && bugs.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-[12px] text-gray-400">Aucun bug</TableCell>
              </TableRow>
            )}
            {bugs.map((b) => (
              <TableRow key={b.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-2">
                    {b.project && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: b.project.color }} />}
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium">{b.title}</p>
                      <p className="text-[10px] text-gray-400">
                        {b.project?.name}
                        {b.version && <> · v{b.version}</>}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><OsSeverityBadge severity={b.severity} /></TableCell>
                <TableCell><OsPriorityBadge priority={b.priority} /></TableCell>
                <TableCell>
                  <Select value={b.status} onValueChange={(v) => updateMutation.mutate({ id: b.id, data: { status: v } })}>
                    <SelectTrigger className="h-7 w-[130px] text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BUG_STATUSES.map((s) => <SelectItem key={s} value={s}>{OS_STATUS_META[s]?.label ?? s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="hidden text-right text-[12px] md:table-cell">
                  <span className={`font-semibold ${b.impact >= 70 ? "text-rose-500" : b.impact >= 40 ? "text-amber-500" : "text-gray-400"}`}>{b.impact}%</span>
                </TableCell>
                <TableCell className="hidden text-right text-[12px] md:table-cell">{b.fixHours}</TableCell>
                <TableCell className="hidden text-[12px] text-gray-400 lg:table-cell">{b.assignee?.name ?? "—"}</TableCell>
                <TableCell>
                  <button
                    onClick={() => deleteMutation.mutate(b.id)}
                    className="rounded-md p-1 text-gray-300 opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100 dark:hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateBugDialog open={createOpen} onOpenChange={setCreateOpen} projects={projects} onCreated={invalidate} />
    </div>
  );
}

function CreateBugDialog({
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
    projectId: "",
    severity: "MAJOR",
    priority: "MEDIUM",
    status: "NEW",
    impact: "40",
    fixHours: "4",
    version: "",
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
      const res = await fetch("/api/admin/os/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          projectId: form.projectId,
          severity: form.severity,
          priority: form.priority,
          status: form.status,
          impact: Number(form.impact) || 0,
          fixHours: Number(form.fixHours) || 0,
          version: form.version || null,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Bug créé");
      setForm({ title: "", projectId: "", severity: "MAJOR", priority: "MEDIUM", status: "NEW", impact: "40", fixHours: "4", version: "" });
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["os-bugs"] });
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
          <DialogTitle>Nouveau bug</DialogTitle>
          <DialogDescription>Reportez un bug pour un projet.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Titre</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex. Prerender échoue sans connexion DB" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Projet</Label>
              <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v })}>
                <SelectTrigger className="text-xs"><SelectValue placeholder="Choisir" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Sévérité</Label>
              <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
                <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["BLOCKER", "CRITICAL", "MAJOR", "MINOR", "TRIVIAL"].map((s) => <SelectItem key={s} value={s}>{getSeverityMeta(s).label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priorité</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["URGENT", "HIGH", "MEDIUM", "LOW"].map((p) => <SelectItem key={p} value={p}>{getPriorityMeta(p).label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Statut</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BUG_STATUSES.map((s) => <SelectItem key={s} value={s}>{OS_STATUS_META[s]?.label ?? s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Impact (%)</Label>
              <Input type="number" min={0} max={100} value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Heures de fix</Label>
              <Input type="number" min={0} value={form.fixHours} onChange={(e) => setForm({ ...form, fixHours: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Version</Label>
              <Input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="1.2.0" />
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
