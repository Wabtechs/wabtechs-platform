import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatCard } from "@/components/admin/os/os-stat-card";
import { OsStatusBadge } from "@/components/admin/os/os-badge";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { OsBarChart, OsLineChart, OsPieChart } from "@/components/admin/os/os-charts";
import { summarizeCiRuns, countWithinDays, commitsPerDay } from "@/lib/os-github";
import { fmtNum, fmtDate, fmtDateTime } from "@/lib/os-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Boxes,
  Layers,
  Github,
  GitPullRequest,
  GitMerge,
  GitCommitVertical,
  Rocket,
  Activity,
  HeartPulse,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Dashboard" };
export const dynamic = "force-dynamic";

export default async function OsDashboardPage() {
  const [
    repos,
    issueGroups,
    openPrGroups,
    mergedPrCount,
    releaseCount,
    releaseList,
    allCommits,
    recentRuns,
  ] = await Promise.all([
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
    db.gitHubIssue.groupBy({
      by: ["state"],
      where: { isPr: false },
      _count: { _all: true },
    }),
    db.gitHubPullRequest.groupBy({
      by: ["state"],
      where: { merged: false },
      _count: { _all: true },
    }),
    db.gitHubPullRequest.count({ where: { merged: true } }),
    db.gitHubRelease.count(),
    db.gitHubRelease.findMany({
      orderBy: { publishedAt: "desc" },
      take: 6,
      include: { repository: { select: { id: true, fullName: true, name: true } } },
    }),
    db.gitHubCommit.findMany({
      select: { committedAt: true },
      orderBy: { committedAt: "desc" },
    }),
    db.gitHubWorkflowRun.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      include: { repository: { select: { id: true, fullName: true, name: true } } },
    }),
  ]);

  const issueStateCounts: Record<string, number> = {};
  for (const g of issueGroups) issueStateCounts[g.state] = g._count._all;
  const prStateCounts: Record<string, number> = {};
  for (const g of openPrGroups) prStateCounts[g.state] = g._count._all;

  const openIssues = issueStateCounts.open ?? 0;
  const closedIssues = issueStateCounts.closed ?? 0;
  const openPrs = prStateCounts.open ?? 0;
  const closedPrs = prStateCounts.closed ?? 0;
  const ci = summarizeCiRuns(recentRuns);
  const commits30 = countWithinDays(allCommits, 30);

  const issueData = [
    { name: "Ouvertes", value: openIssues },
    { name: "Fermées", value: closedIssues },
  ].filter((d) => d.value > 0);
  const prData = [
    { name: "Ouvertes", value: openPrs },
    { name: "Fusionnées", value: mergedPrCount },
    { name: "Fermées", value: closedPrs },
  ].filter((d) => d.value > 0);
  const growthData = commitsPerDay(allCommits, 30);

  return (
    <div>
      <OsPageHeader
        title="Project OS"
        description="Centre de contrôle des projets Wabtechs — données réelles GitHub"
        icon={<Boxes className="h-5 w-5" />}
      >
        <div className="bg-primary/[0.06] text-primary rounded-lg px-3 py-1.5 text-[12px] font-medium">
          {new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(new Date())}
        </div>
      </OsPageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OsStatCard
          label="Dépôts liés"
          value={repos.length}
          hint="Repositories synchronisés"
          icon={<Layers className="h-4 w-4" />}
          accent="text-primary"
        />
        <OsStatCard
          label="Issues ouvertes"
          value={openIssues}
          hint={`${closedIssues} fermées`}
          icon={<Github className="h-4 w-4" />}
          accent="text-emerald-500"
        />
        <OsStatCard
          label="Pull requests ouvertes"
          value={openPrs}
          hint={`${mergedPrCount} fusionnées`}
          icon={<GitPullRequest className="h-4 w-4" />}
          accent="text-blue-500"
        />
        <OsStatCard
          label="Commits (30 jours)"
          value={commits30}
          hint={`${fmtNum(allCommits.length)} au total`}
          icon={<GitCommitVertical className="h-4 w-4" />}
          accent="text-violet-500"
        />
        <OsStatCard
          label="Releases"
          value={releaseCount}
          hint="Versions publiées"
          icon={<Rocket className="h-4 w-4" />}
          accent="text-fuchsia-500"
        />
        <OsStatCard
          label="Runs CI"
          value={ci.total}
          hint={`${ci.success} succès · ${ci.failure} échecs`}
          icon={<Activity className="h-4 w-4" />}
          accent="text-cyan-500"
        />
        <OsStatCard
          label="CI — succès"
          value={`${ci.passRate}%`}
          hint="Taux de succès des derniers runs"
          icon={<HeartPulse className="h-4 w-4" />}
          accent={
            ci.passRate >= 80
              ? "text-emerald-500"
              : ci.passRate >= 60
                ? "text-amber-500"
                : "text-rose-500"
          }
        />
        <OsStatCard
          label="PRs fusionnées"
          value={mergedPrCount}
          hint={`${openPrs} en attente de revue`}
          icon={<GitMerge className="h-4 w-4" />}
          accent="text-green-600"
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Issues par état</CardTitle>
            <CardDescription>Répartition des issues GitHub</CardDescription>
          </CardHeader>
          <CardContent>
            {issueData.length ? (
              <OsBarChart data={issueData} height={250} />
            ) : (
              <OsEmpty title="Aucune issue" />
            )}
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pull requests</CardTitle>
            <CardDescription>Distribution des PRs</CardDescription>
          </CardHeader>
          <CardContent>
            {prData.length ? (
              <OsPieChart data={prData} height={250} />
            ) : (
              <OsEmpty title="Aucune pull request" />
            )}
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Activité commits</CardTitle>
            <CardDescription>Commits par jour — 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            {growthData.some((d) => d.commits > 0) ? (
              <OsLineChart
                data={growthData}
                xKey="label"
                height={250}
                lines={[{ key: "commits", name: "Commits", color: "#842ae3" }]}
              />
            ) : (
              <OsEmpty title="Aucun commit" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Dépôts</h2>
            <Link
              href="/admin/os/projects"
              className="text-primary flex items-center gap-1 text-[12px] font-medium hover:underline"
            >
              Tout voir <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          {repos.map((r) => (
            <Link
              key={r.id}
              href={`/admin/os/projects/${r.id}`}
              className="border-border bg-card flex items-center justify-between rounded-xl border px-5 py-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="bg-primary/[0.08] flex h-6 w-6 shrink-0 items-center justify-center rounded-md">
                    <Github className="text-primary h-3.5 w-3.5" />
                  </span>
                  <p className="truncate text-[14px] font-medium">{r.fullName}</p>
                  {r.archived && (
                    <OsStatusBadge status="ARCHIVED" className="hidden sm:inline-flex" />
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                  {r.language && (
                    <>
                      <span>{r.language}</span>
                      <span>·</span>
                    </>
                  )}
                  <span>{r.stars} stars</span>
                  <span>·</span>
                  <span>{r.forks} forks</span>
                  <span>·</span>
                  <span>{r._count.issues} issues</span>
                  <span>·</span>
                  <span>{r._count.pullRequests} PRs</span>
                  <span>·</span>
                  <span>{fmtNum(r._count.commits)} commits</span>
                </div>
              </div>
              <div className="ml-4 flex shrink-0 items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold">{r._count.releases}</p>
                  <p className="text-[10px] text-gray-400">releases</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{r._count.workflowRuns}</p>
                  <p className="text-[10px] text-gray-400">runs CI</p>
                </div>
              </div>
            </Link>
          ))}
          {repos.length === 0 && (
            <Card className="border-border bg-card">
              <CardContent className="py-12">
                <OsEmpty
                  title="Aucun dépôt lié"
                  hint="Connectez et liez un repository dans l'onglet GitHub, puis synchronisez."
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-3">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Releases récentes</CardTitle>
              <CardDescription>Dernières versions publiées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {releaseList.length === 0 && <OsEmpty title="Aucune release" />}
              {releaseList.map((r) => (
                <div
                  key={r.id}
                  className="dark:border-border flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{r.tagName}</p>
                    <p className="mt-0.5 truncate text-[11px] text-gray-400">
                      {r.repository.fullName}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] font-semibold text-emerald-500">
                      {r.publishedAt ? fmtDate(r.publishedAt) : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Derniers runs CI</CardTitle>
              <CardDescription>Workflow runs récents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentRuns.length === 0 && <OsEmpty title="Aucun run CI" />}
              {recentRuns.map((run) => (
                <div
                  key={run.id}
                  className="dark:border-border flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-medium">
                      {run.name ?? `Run #${run.runNumber}`}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-gray-400">
                      {run.repository.fullName} · {fmtDateTime(run.createdAt)}
                    </p>
                  </div>
                  <OsStatusBadge
                    status={(run.conclusion ?? run.status ?? "").toUpperCase()}
                    className="shrink-0"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
