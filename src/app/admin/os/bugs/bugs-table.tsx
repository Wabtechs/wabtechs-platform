"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OsStatusBadge } from "@/components/admin/os/os-badge";
import { fmtDateTime } from "@/lib/os-utils";
import { ExternalLink, Loader2 } from "lucide-react";

interface GitHubRepository {
  id: string;
  fullName: string;
  name: string;
  owner: string;
}

interface GitHubIssue {
  id: string;
  number: number;
  title: string;
  state: "open" | "closed";
  htmlUrl: string;
  labels: { id: number; name: string; color?: string | null }[] | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  repository: GitHubRepository;
}

export function BugsTable({ repositories }: { repositories: GitHubRepository[] }) {
  const [repositoryId, setRepositoryId] = useState("all");
  const [state, setState] = useState("open");

  const issuesQuery = useQuery<GitHubIssue[]>({
    queryKey: ["os-github-issues", repositoryId, state],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("isPr", "false");
      if (repositoryId !== "all") params.set("repositoryId", repositoryId);
      if (state !== "all") params.set("state", state);
      const res = await fetch(`/api/admin/os/github/issues?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur");
      const data = await res.json();
      return data.issues ?? [];
    },
  });

  const issues = issuesQuery.data ?? [];
  const loading = issuesQuery.isLoading;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={repositoryId} onValueChange={setRepositoryId}>
            <SelectTrigger className="w-[220px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les dépôts</SelectItem>
              {repositories.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="w-[150px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Ouvertes</SelectItem>
              <SelectItem value="closed">Fermées</SelectItem>
              <SelectItem value="all">Toutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-[11px] text-gray-400">
          Issues GitHub (hors pull requests) — gestion sur GitHub
        </p>
      </div>

      <div className="border-border bg-card rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px]">Issue</TableHead>
              <TableHead className="hidden text-[11px] md:table-cell">Dépôt</TableHead>
              <TableHead className="hidden text-[11px] lg:table-cell">Labels</TableHead>
              <TableHead className="hidden text-[11px] lg:table-cell">Créée le</TableHead>
              <TableHead className="hidden text-[11px] xl:table-cell">Dernière activité</TableHead>
              <TableHead className="text-[11px]">État</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-gray-300" />
                </TableCell>
              </TableRow>
            )}
            {!loading && issues.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-[12px] text-gray-400">
                  Aucune issue
                </TableCell>
              </TableRow>
            )}
            {issues.map((i) => (
              <TableRow key={i.id} className="group">
                <TableCell>
                  <a
                    href={i.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-w-0 items-center gap-2"
                  >
                    <div className="min-w-0">
                      <p className="hover:text-primary truncate text-[13px] font-medium">
                        <span className="text-gray-400">#{i.number}</span> {i.title}
                      </p>
                      <p className="text-[10px] text-gray-400">{i.repository.fullName}</p>
                    </div>
                    <ExternalLink className="h-3 w-3 shrink-0 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </TableCell>
                <TableCell className="hidden text-[12px] text-gray-400 md:table-cell">
                  {i.repository.fullName}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex max-w-[220px] flex-wrap gap-1">
                    {Array.isArray(i.labels) &&
                      i.labels.slice(0, 3).map((l) => (
                        <span
                          key={l.id}
                          className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                          style={{
                            background: l.color ? `#${l.color}26` : undefined,
                            color: l.color ? `#${l.color}` : undefined,
                          }}
                        >
                          {l.name}
                        </span>
                      ))}
                  </div>
                </TableCell>
                <TableCell className="hidden text-[12px] text-gray-400 lg:table-cell">
                  {fmtDateTime(i.createdAt)}
                </TableCell>
                <TableCell className="hidden text-[12px] text-gray-400 xl:table-cell">
                  {fmtDateTime(i.updatedAt)}
                </TableCell>
                <TableCell>
                  <OsStatusBadge status={i.state.toUpperCase()} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
