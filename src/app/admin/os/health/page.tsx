import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatusBadge } from "@/components/admin/os/os-badge";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { summarizeCiRuns, repoHealthScore } from "@/lib/os-github";
import { healthColor, progressColor } from "@/lib/os-labels";
import { pct, fmtDateTime } from "@/lib/os-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HeartPulse, CheckCircle2, GitMerge } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Santé" };
export const dynamic = "force-dynamic";

export default async function OsHealthPage() {
  const [repos, issueGroups, prMergedGroups, recentRuns] = await Promise.all([
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

  const runsByRepo = new Map<string, (typeof recentRuns)[number][]>();
  for (const run of recentRuns) {
    const list = runsByRepo.get(run.repositoryId) ?? [];
    list.push(run);
    runsByRepo.set(run.repositoryId, list);
  }

  const scores = repos.map((r) => {
    const issueCounts = issueByRepo[r.id] ?? {};
    const totalIssues = (issueCounts.open ?? 0) + (issueCounts.closed ?? 0);
    const ci = summarizeCiRuns(runsByRepo.get(r.id) ?? []);
    const score = repoHealthScore({
      ciPass: ci.passRate,
      ciTotal: ci.total,
      closedIssues: issueCounts.closed ?? 0,
      totalIssues,
      mergedPrs: mergedByRepo[r.id] ?? 0,
      totalPrs: r._count.pullRequests,
    });
    return { repo: r, ci, issueCounts, totalIssues, score };
  });

  const avgScore = scores.length
    ? Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length)
    : 0;
  const healthy = scores.filter((s) => s.score >= 80).length;
  const atRisk = scores.filter((s) => s.score < 60).length;

  return (
    <div>
      <OsPageHeader
        title="Santé"
        description={`${repos.length} dépôts · santé moyenne ${pct(avgScore)} · ${healthy} sains · ${atRisk} à risque`}
        icon={<HeartPulse className="h-5 w-5" />}
      />

      {repos.length === 0 ? (
        <OsEmpty title="Aucun dépôt lié" />
      ) : (
        <div className="space-y-8">
          {scores.map(({ repo, ci, issueCounts, totalIssues, score }) => (
            <Card key={repo.id} className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/[0.08] flex h-10 w-10 items-center justify-center rounded-xl">
                      <HeartPulse className="text-primary h-5 w-5" />
                    </span>
                    <div>
                      <CardTitle className="text-sm">{repo.fullName}</CardTitle>
                      <CardDescription>
                        {totalIssues} issues · {repo._count.pullRequests} PRs ·{" "}
                        {repo._count.workflowRuns} runs CI
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <OsStatusBadge status={repo.archived ? "ARCHIVED" : "ACTIVE"} />
                    <div className="text-right">
                      <p className={`text-xl font-bold ${healthColor(score)}`}>{score}</p>
                      <p className="text-[10px] text-gray-400">santé /100</p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${progressColor(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className="text-lg font-semibold">{issueCounts.open ?? 0}</p>
                    <p className="text-[10px] text-gray-400">Issues ouvertes</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className="text-lg font-semibold">{issueCounts.closed ?? 0}</p>
                    <p className="text-[10px] text-gray-400">Issues fermées</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className="text-lg font-semibold">{mergedByRepo[repo.id] ?? 0}</p>
                    <p className="text-[10px] text-gray-400">PRs fusionnées</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className="text-lg font-semibold">{repo._count.commits}</p>
                    <p className="text-[10px] text-gray-400">Commits</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p className="text-lg font-semibold">{ci.success}</p>
                    <p className="text-[10px] text-gray-400">Runs OK</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-white/5">
                    <p
                      className={`text-lg font-semibold ${ci.failure ? "text-rose-500" : "text-gray-900 dark:text-gray-200"}`}
                    >
                      {ci.failure}
                    </p>
                    <p className="text-[10px] text-gray-400">Runs KO</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[12px]">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> CI {ci.passRate}% succès
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-violet-500/10 px-2 py-1 font-medium text-violet-600 dark:text-violet-400">
                    <GitMerge className="h-3.5 w-3.5" /> Taux de merge{" "}
                    {repo._count.pullRequests
                      ? `${Math.round(((mergedByRepo[repo.id] ?? 0) / repo._count.pullRequests) * 100)}%`
                      : "—"}
                  </span>
                </div>

                {ci.total > 0 && (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                      Derniers runs CI
                    </p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-[11px]">Workflow</TableHead>
                          <TableHead className="text-[11px]">Branche</TableHead>
                          <TableHead className="hidden text-[11px] md:table-cell">Date</TableHead>
                          <TableHead className="text-[11px]">Résultat</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(runsByRepo.get(repo.id) ?? []).slice(0, 8).map((run) => (
                          <TableRow key={run.id}>
                            <TableCell className="text-[12px] font-medium">
                              {run.name ?? `Run #${run.runNumber}`}
                            </TableCell>
                            <TableCell className="text-[12px] text-gray-400">
                              {run.branch ?? "—"}
                            </TableCell>
                            <TableCell className="hidden text-[12px] text-gray-400 md:table-cell">
                              {fmtDateTime(run.createdAt)}
                            </TableCell>
                            <TableCell>
                              <OsStatusBadge
                                status={(run.conclusion ?? run.status ?? "").toUpperCase()}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
