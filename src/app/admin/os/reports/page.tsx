import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatusBadge } from "@/components/admin/os/os-badge";
import { healthColor, progressColor } from "@/lib/os-labels";
import { fmtNum, fmtDate, pct } from "@/lib/os-utils";
import { summarizeCiRuns } from "@/lib/os-github";
import { Card, CardContent } from "@/components/ui/card";
import { PrintButton } from "./print-button";
import { FileBarChart, Star, GitFork } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Rapports" };
export const dynamic = "force-dynamic";

export default async function OsReportsPage() {
  const [repos, issueGroups, prMergedGroups, prOpenGroups, commits, recentReleases, recentRuns] =
    await Promise.all([
      db.gitHubRepository.findMany({
        orderBy: { fullName: "asc" },
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
      db.gitHubIssue.groupBy({
        by: ["repositoryId", "state"],
        where: { isPr: false },
        _count: { _all: true },
      }),
      db.gitHubPullRequest.groupBy({
        by: ["repositoryId"],
        where: { merged: true },
        _count: { _all: true },
      }),
      db.gitHubPullRequest.groupBy({
        by: ["repositoryId", "state"],
        where: { merged: false },
        _count: { _all: true },
      }),
      db.gitHubCommit.findMany({
        orderBy: { committedAt: "desc" },
        take: 500,
        select: { repositoryId: true, authorName: true },
      }),
      db.gitHubRelease.findMany({
        orderBy: { publishedAt: "desc" },
        take: 30,
        select: { id: true, tagName: true, publishedAt: true, repositoryId: true },
      }),
      db.gitHubWorkflowRun.findMany({
        orderBy: { createdAt: "desc" },
        take: 300,
        include: { repository: { select: { id: true } } },
      }),
    ]);

  const issueByRepo: Record<string, Record<string, number>> = {};
  for (const g of issueGroups) {
    const counts = (issueByRepo[g.repositoryId] ??= {});
    counts[g.state] = g._count._all;
  }
  const mergedByRepo: Record<string, number> = {};
  for (const g of prMergedGroups) mergedByRepo[g.repositoryId] = g._count._all;
  const openPrByRepo: Record<string, number> = {};
  for (const g of prOpenGroups) {
    openPrByRepo[g.repositoryId] = (openPrByRepo[g.repositoryId] ?? 0) + g._count._all;
  }
  const authorCountsByRepo = new Map<string, Map<string, number>>();
  for (const c of commits) {
    if (!c.authorName) continue;
    const m = authorCountsByRepo.get(c.repositoryId) ?? new Map<string, number>();
    m.set(c.authorName, (m.get(c.authorName) ?? 0) + 1);
    authorCountsByRepo.set(c.repositoryId, m);
  }
  const releasesByRepo = new Map<string, typeof recentReleases>();
  for (const r of recentReleases) {
    const list = releasesByRepo.get(r.repositoryId) ?? [];
    list.push(r);
    releasesByRepo.set(r.repositoryId, list);
  }
  const runsByRepo = new Map<string, (typeof recentRuns)[number][]>();
  for (const run of recentRuns) {
    const list = runsByRepo.get(run.repositoryId) ?? [];
    list.push(run);
    runsByRepo.set(run.repositoryId, list);
  }

  return (
    <div>
      <OsPageHeader
        title="Rapports"
        description="Synthèse par dépôt — données GitHub réelles, prête à imprimer ou exporter en PDF"
        icon={<FileBarChart className="h-5 w-5" />}
      >
        <PrintButton />
      </OsPageHeader>

      <div className="space-y-6 print:space-y-8">
        {repos.map((r) => {
          const issueCounts = issueByRepo[r.id] ?? {};
          const openIssues = issueCounts.open ?? 0;
          const closedIssues = issueCounts.closed ?? 0;
          const mergedPrs = mergedByRepo[r.id] ?? 0;
          const openPrs = openPrByRepo[r.id] ?? 0;
          const ci = summarizeCiRuns(runsByRepo.get(r.id) ?? []);
          const authors = authorCountsByRepo.get(r.id);
          const topAuthor = authors
            ? [...authors.entries()].sort((a, b) => b[1] - a[1])[0]
            : undefined;
          const releases = (releasesByRepo.get(r.id) ?? []).slice(0, 4);

          return (
            <Card key={r.id} className="border-border bg-card print:break-inside-avoid">
              <CardContent className="p-6">
                <div className="dark:border-border flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 print:border-0 print:pb-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/[0.08] flex h-11 w-11 items-center justify-center rounded-xl">
                      <FileBarChart className="text-primary h-5 w-5" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold">{r.fullName}</h2>
                        <OsStatusBadge status={r.archived ? "ARCHIVED" : "ACTIVE"} />
                        {r.language && (
                          <span className="text-[11px] font-medium text-gray-400">
                            {r.language}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        branche {r.defaultBranch} · Rapport du {fmtDate(new Date())}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${healthColor(ci.passRate)}`}>
                      {ci.passRate}%
                    </p>
                    <p className="text-[10px] text-gray-400">CI — succès</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p
                      className={`text-lg font-semibold ${openIssues ? "text-rose-500" : "text-emerald-500"}`}
                    >
                      {openIssues}
                    </p>
                    <p className="text-[10px] text-gray-400">Issues ouvertes</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className="text-lg font-semibold">{closedIssues}</p>
                    <p className="text-[10px] text-gray-400">Issues fermées</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className="text-lg font-semibold">{mergedPrs}</p>
                    <p className="text-[10px] text-gray-400">PRs fusionnées</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className="text-lg font-semibold">{openPrs}</p>
                    <p className="text-[10px] text-gray-400">PRs ouvertes</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className="text-lg font-semibold">{fmtNum(r._count.commits)}</p>
                    <p className="text-[10px] text-gray-400">Commits</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className="text-lg font-semibold">{r._count.workflowRuns}</p>
                    <p className="text-[10px] text-gray-400">Runs CI</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                      Indicateurs
                    </p>
                    <div className="space-y-1.5 text-[12px]">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stars</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Star className="h-3 w-3 text-amber-400" /> {fmtNum(r.stars)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Forks</span>
                        <span className="flex items-center gap-1 font-medium">
                          <GitFork className="h-3 w-3 text-sky-400" /> {fmtNum(r.forks)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contributeur principal</span>
                        <span className="font-medium">
                          {topAuthor ? `${topAuthor[0]} (${topAuthor[1]})` : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Releases</span>
                        <span className="font-medium">{r._count.releases}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Runs CI succès</span>
                        <span className="font-medium">{pct(ci.passRate)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                      CI — derniers runs
                    </p>
                    <div className="space-y-2">
                      {(runsByRepo.get(r.id) ?? []).slice(0, 5).map((run) => (
                        <div key={run.id} className="flex items-center gap-2 text-[12px]">
                          <span className="w-24 truncate font-medium">
                            {run.name ?? `Run #${run.runNumber}`}
                          </span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                            <div
                              className={`h-full rounded-full ${progressColor(ci.passRate)}`}
                              style={{ width: `${ci.passRate}%` }}
                            />
                          </div>
                          <OsStatusBadge
                            status={(run.conclusion ?? run.status ?? "").toUpperCase()}
                          />
                        </div>
                      ))}
                      {(runsByRepo.get(r.id) ?? []).length === 0 && (
                        <p className="text-[12px] text-gray-400">Aucun run CI</p>
                      )}
                    </div>
                  </div>
                </div>

                {releases.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                      Dernières releases
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {releases.map((rel) => (
                        <span
                          key={rel.id}
                          className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium dark:bg-white/5"
                        >
                          {rel.tagName} · {rel.publishedAt ? fmtDate(rel.publishedAt) : "brouillon"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
