import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatusBadge } from "@/components/admin/os/os-badge";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { fmtNum, fmtDateTime } from "@/lib/os-utils";
import { Github, ArrowRight, GitFork, Star } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Projets" };
export const dynamic = "force-dynamic";

export default async function OsProjectsPage() {
  const [repos, starAgg, forkAgg] = await Promise.all([
    db.gitHubRepository.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: {
            issues: true,
            pullRequests: true,
            commits: true,
            releases: true,
            workflowRuns: true,
          },
        },
      },
    }),
    db.gitHubRepository.aggregate({ _sum: { stars: true } }),
    db.gitHubRepository.aggregate({ _sum: { forks: true } }),
  ]);

  const totalStars = Number(starAgg._sum.stars ?? 0);
  const totalForks = Number(forkAgg._sum.forks ?? 0);

  return (
    <div>
      <OsPageHeader
        title="Projets"
        description={`${repos.length} dépôts GitHub · ${fmtNum(totalStars)} stars · ${fmtNum(totalForks)} forks cumulés`}
        icon={<Github className="h-5 w-5" />}
      />

      {repos.length === 0 ? (
        <OsEmpty
          title="Aucun dépôt lié"
          hint="Liez un repository dans l'onglet GitHub puis synchronisez pour le piloter depuis Project OS."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {repos.map((r) => (
            <Link
              key={r.id}
              href={`/admin/os/projects/${r.id}`}
              className="group border-border bg-card flex flex-col rounded-xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="bg-primary/[0.08] flex h-9 w-9 items-center justify-center rounded-lg">
                    <Github className="text-primary h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold">{r.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {r.owner} · {r.defaultBranch}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <OsStatusBadge
                    status={
                      r.archived
                        ? "ARCHIVED"
                        : r.visibility === "private"
                          ? "MAINTENANCE"
                          : "ACTIVE"
                    }
                  />
                  {r.language && (
                    <span className="text-[10px] font-medium text-gray-400">{r.language}</span>
                  )}
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-[12px] text-gray-500 dark:text-gray-400">
                {r.description ?? "Aucune description fournie sur GitHub."}
              </p>

              <div className="mt-4 flex items-center gap-3 text-[12px] font-medium text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-400" /> {fmtNum(r.stars)}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="h-3.5 w-3.5 text-sky-400" /> {fmtNum(r.forks)}
                </span>
                <span className="text-gray-400">· {r.openIssues} issues ouvertes</span>
              </div>

              <div className="mt-4 grid grid-cols-5 gap-2 rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                <div>
                  <p className="text-sm font-semibold">{r._count.issues}</p>
                  <p className="text-[10px] text-gray-400">Issues</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">{r._count.pullRequests}</p>
                  <p className="text-[10px] text-gray-400">PRs</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">{fmtNum(r._count.commits)}</p>
                  <p className="text-[10px] text-gray-400">Commits</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">{r._count.releases}</p>
                  <p className="text-[10px] text-gray-400">Releases</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">{r._count.workflowRuns}</p>
                  <p className="text-[10px] text-gray-400">Runs</p>
                </div>
              </div>

              <div className="dark:border-border mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-[11px] text-gray-400">
                  Sync : {r.lastSyncAt ? fmtDateTime(r.lastSyncAt) : "jamais"}
                </span>
                <ArrowRight className="group-hover:text-primary h-3.5 w-3.5 text-gray-300 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
