"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OsPriorityBadge, OsSeverityBadge } from "@/components/admin/os/os-badge";
import { OS_STATUS_META } from "@/lib/os-labels";
import { Bug, ExternalLink, Loader2 } from "lucide-react";
import type { OsBug } from "./types";

const BUG_STATUSES = ["NEW", "TRIAGED", "IN_PROGRESS", "FIXED", "VERIFIED", "CLOSED", "WONTFIX"];
const SEVERITY_ORDER = ["BLOCKER", "CRITICAL", "MAJOR", "MINOR", "TRIVIAL"];

export function RoadmapBugs({ bugs, onViewBug }: { bugs: OsBug[]; onViewBug: (b: OsBug) => void }) {
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch("/api/admin/os/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Échec");
    },
    onMutate: () => {
      setUpdatingId(null);
    },
    onSuccess: () => {
      toast.success("Bug mis à jour");
      queryClient.invalidateQueries({ queryKey: ["roadmap-stats"] });
    },
    onError: () => toast.error("Échec de la mise à jour"),
    onSettled: () => setUpdatingId(null),
  });

  const severityCounts = SEVERITY_ORDER.reduce<Record<string, number>>((acc, s) => {
    acc[s] = bugs.filter((b) => b.severity === s).length;
    return acc;
  }, {});

  if (bugs.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-sm">Aucun bug pour les filtres actuels.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <p className="text-muted-foreground mb-2 text-xs font-medium">Répartition par sévérité</p>
          <div className="flex flex-wrap gap-3">
            {SEVERITY_ORDER.map((s) => {
              const count = severityCounts[s] ?? 0;
              if (!count) return null;
              return (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-rose-500">{count}</span>
                  <OsSeverityBadge severity={s} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="border-border bg-card overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px]">Bug</TableHead>
              <TableHead className="text-[11px]">Sévérité</TableHead>
              <TableHead className="text-[11px]">Priorité</TableHead>
              <TableHead className="text-[11px]">Statut</TableHead>
              <TableHead className="hidden text-right text-[11px] md:table-cell">Impact</TableHead>
              <TableHead className="hidden text-[12px] lg:table-cell">Feature</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {bugs.map((b) => (
              <TableRow key={b.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Bug className="h-3.5 w-3.5 text-gray-400" />
                    <div className="min-w-0">
                      <p
                        className="hover:text-primary cursor-pointer truncate text-[13px] font-medium"
                        onClick={() => onViewBug(b)}
                      >
                        {b.title}
                      </p>
                      <p className="text-[10px] text-gray-400">{b.version}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <OsSeverityBadge severity={b.severity} />
                </TableCell>
                <TableCell>
                  <OsPriorityBadge priority={b.priority} />
                </TableCell>
                <TableCell>
                  {updatingId === b.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-300" />
                  ) : (
                    <Select
                      value={b.status}
                      onValueChange={(v) => {
                        setUpdatingId(b.id);
                        updateMutation.mutate({ id: b.id, status: v });
                      }}
                    >
                      <SelectTrigger className="h-7 w-[130px] text-[11px]">
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
                  )}
                </TableCell>
                <TableCell className="hidden text-right text-[12px] md:table-cell">
                  <span
                    className={
                      b.impact >= 70
                        ? "font-semibold text-rose-500"
                        : b.impact >= 40
                          ? "font-semibold text-amber-500"
                          : "text-gray-400"
                    }
                  >
                    {b.impact}%
                  </span>
                </TableCell>
                <TableCell className="hidden text-[12px] text-gray-400 lg:table-cell">
                  {b.feature?.title ?? "—"}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onViewBug(b)}
                    className="hover:text-primary rounded-md p-1 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
