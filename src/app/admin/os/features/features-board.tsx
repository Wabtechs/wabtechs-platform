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
import { OsStatusBadge } from "@/components/admin/os/os-badge";
import { fmtDateTime } from "@/lib/os-utils";
import { ExternalLink, GitPullRequest, Loader2 } from "lucide-react";

interface GitHubRepository {
  id: string;
  fullName: string;
  name: string;
  owner: string;
}

interface GitHubPullRequest {
  id: string;
  number: number;
  title: string;
  state: "open" | "closed";
  htmlUrl: string;
  merged: boolean;
  author: string | null;
  headBranch: string | null;
  baseBranch: string | null;
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
  repository: GitHubRepository;
}

const COLUMNS = [
  { title: "Ouvertes", color: "#10b981", match: (pr: GitHubPullRequest) => pr.state === "open" },
  { title: "Fusionnées", color: "#7c3aed", match: (pr: GitHubPullRequest) => pr.merged },
  {
    title: "Fermées",
    color: "#94a3b8",
    match: (pr: GitHubPullRequest) => pr.state === "closed" && !pr.merged,
  },
];

export function FeaturesBoard({ repositories }: { repositories: GitHubRepository[] }) {
  const [repositoryId, setRepositoryId] = useState("all");

  const prsQuery = useQuery<GitHubPullRequest[]>({
    queryKey: ["os-github-pull-requests", repositoryId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (repositoryId !== "all") params.set("repositoryId", repositoryId);
      const res = await fetch(`/api/admin/os/github/pull-requests?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur");
      const data = await res.json();
      return data.pullRequests ?? [];
    },
  });

  const prs = prsQuery.data ?? [];
  const loading = prsQuery.isLoading;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
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
        <p className="text-[11px] text-gray-400">
          Pull requests GitHub — gestion des PRs sur GitHub
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = prs.filter(col.match);
          return (
            <div
              key={col.title}
              className="dark:border-border flex min-h-[300px] flex-col rounded-xl border border-gray-200/80 bg-gray-50/60 dark:bg-white/[0.03]"
            >
              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: col.color }} />
                  <p className="text-[12px] font-semibold text-gray-600 dark:text-gray-300">
                    {col.title}
                  </p>
                </div>
                <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 shadow-sm dark:bg-white/10">
                  {items.length}
                </span>
              </div>
              <div className="flex-1 space-y-2 px-2 pb-2">
                {loading && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
                  </div>
                )}
                {!loading && items.length === 0 && (
                  <p className="px-1 py-4 text-center text-[11px] text-gray-400">
                    Aucune pull request
                  </p>
                )}
                {items.map((pr) => (
                  <a
                    key={pr.id}
                    href={pr.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group border-border bg-card block rounded-lg border p-3 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="group-hover:text-primary min-w-0 flex-1 text-[13px] leading-snug font-medium">
                        <span className="text-gray-400">#{pr.number}</span> {pr.title}
                      </p>
                      <OsStatusBadge
                        status={pr.merged ? "MERGED" : pr.state.toUpperCase()}
                        className="shrink-0"
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-400">
                      <GitPullRequest className="h-3 w-3 shrink-0" />
                      <span className="truncate font-medium text-gray-500 dark:text-gray-300">
                        {pr.author ?? "inconnu"}
                      </span>
                      {pr.headBranch && pr.baseBranch && (
                        <>
                          <span className="truncate">
                            {pr.headBranch} → {pr.baseBranch}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-gray-400">
                      <span className="truncate">{pr.repository.fullName}</span>
                      <span className="shrink-0 pl-2">
                        {pr.mergedAt ? fmtDateTime(pr.mergedAt) : fmtDateTime(pr.createdAt)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-end">
                      <ExternalLink className="group-hover:text-primary h-3 w-3 text-gray-300 transition-colors" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
