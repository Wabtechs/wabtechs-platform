import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatCard } from "@/components/admin/os/os-stat-card";
import { OsProjectFilter } from "@/components/admin/os/os-project-filter";
import { OsBarChart, OsPieChart, OsLineChart } from "@/components/admin/os/os-charts";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { summarizeCiRuns, countWithinDays, commitsPerDay } from "@/lib/os-github";
import { fmtNum } from "@/lib/os-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  TrendingUp,
  Github,
  Rocket,
  GitMerge,
  GitCommitVertical,
  Activity,
  Star,
  GitPullRequest,
} from "lucide-react";

export const metadata: Metadata = { title: "Project OS — KPI" };
export const dynamic = "force-dynamic";

export default async function OsKpiPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project } = await searchParams;

  const repos = await db.gitHubRepository.findMany({
    select: { id: true, fullName: true, name: true, owner: true, stars: true },
    orderBy: { fullName: "asc" },
  });
  const selected = project ? repos.find((r) => r.id === project) : null;
  const whereRepo = selected ? { repositoryId: selected.id } : {};

  const [issueGroups, prGroups, mergedCount, releaseCount, commitRows, runRows] = await Promise.all(
    [
      db.gitHubIssue.groupBy({
        by: ["state"],
        where: { ...whereRepo, isPr: false },
        _count: { _all: true },
      }),
      db.gitHubPullRequest.groupBy({
        by: ["state"],
        where: { ...whereRepo, merged: false },
        _count: { _all: true },
      }),
      db.gitHubPullRequest.count({ where: { ...whereRepo, merged: true } }),
      db.gitHubRelease.count({ where: whereRepo }),
      db.gitHubCommit.findMany({
        where: whereRepo,
        select: { committedAt: true },
        orderBy: { committedAt: "desc" },
      }),
      db.gitHubWorkflowRun.findMany({
        where: whereRepo,
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ],
  );

  const issueCounts: Record<string, number> = {};
  for (const g of issueGroups) issueCounts[g.state] = g._count._all;
  const prCounts: Record<string, number> = {};
  for (const g of prGroups) prCounts[g.state] = g._count._all;

  const openIssues = issueCounts.open ?? 0;
  const closedIssues = issueCounts.closed ?? 0;
  const openPrs = prCounts.open ?? 0;
  const closedPrs = prCounts.closed ?? 0;
  const ci = summarizeCiRuns(runRows);
  const commits30 = countWithinDays(commitRows, 30);
  const stars = selected ? selected.stars : repos.reduce((a, r) => a + r.stars, 0);

  const issueData = [
    { name: "Ouvertes", value: openIssues },
    { name: "Fermées", value: closedIssues },
  ].filter((d) => d.value > 0);
  const prData = [
    { name: "Ouvertes", value: openPrs },
    { name: "Fusionnées", value: mergedCount },
    { name: "Fermées", value: closedPrs },
  ].filter((d) => d.value > 0);
  const growthData = commitsPerDay(commitRows, 30);

  return (
    <div>
      <OsPageHeader
        title="KPI"
        description={
          selected
            ? `Indicateurs clés — ${selected.fullName}`
            : "Indicateurs clés issus des données GitHub du portfolio"
        }
        icon={<TrendingUp className="h-5 w-5" />}
      >
        <OsProjectFilter
          projects={repos.map((r) => ({ id: r.id, slug: r.id, name: r.fullName }))}
          value={selected?.id ?? "all"}
          basePath="/admin/os/kpi"
        />
      </OsPageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OsStatCard
          label="Issues ouvertes"
          value={fmtNum(openIssues)}
          hint={`${closedIssues} fermées`}
          icon={<Github className="h-4 w-4" />}
          accent="text-emerald-500"
        />
        <OsStatCard
          label="Issues fermées"
          value={fmtNum(closedIssues)}
          hint={`${openIssues} encore ouvertes`}
          icon={<Rocket className="h-4 w-4" />}
          accent="text-blue-500"
        />
        <OsStatCard
          label="PRs fusionnées"
          value={fmtNum(mergedCount)}
          hint={`${openPrs} ouvertes · ${closedPrs} fermées`}
          icon={<GitMerge className="h-4 w-4" />}
          accent="text-violet-500"
        />
        <OsStatCard
          label="PRs ouvertes"
          value={fmtNum(openPrs)}
          hint={`${mergedCount} fusionnées au total`}
          icon={<GitPullRequest className="h-4 w-4" />}
          accent="text-fuchsia-500"
        />
        <OsStatCard
          label="Commits (30 jours)"
          value={fmtNum(commits30)}
          hint={`${fmtNum(commitRows.length)} au total`}
          icon={<GitCommitVertical className="h-4 w-4" />}
          accent="text-orange-500"
        />
        <OsStatCard
          label="Releases"
          value={fmtNum(releaseCount)}
          hint="Versions publiées"
          icon={<Rocket className="h-4 w-4" />}
          accent="text-cyan-500"
        />
        <OsStatCard
          label="CI — succès"
          value={`${ci.passRate}%`}
          hint={`${ci.success}/${ci.total} derniers runs`}
          icon={<Activity className="h-4 w-4" />}
          accent={
            ci.passRate >= 80
              ? "text-emerald-500"
              : ci.passRate >= 60
                ? "text-amber-500"
                : "text-rose-500"
          }
        />
        <OsStatCard
          label="Stars"
          value={fmtNum(stars)}
          hint="Stars cumulées"
          icon={<Star className="h-4 w-4" />}
          accent="text-amber-500"
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Issues par état</CardTitle>
            <CardDescription>Distribution des issues</CardDescription>
          </CardHeader>
          <CardContent>
            {issueData.length ? (
              <OsBarChart data={issueData} height={260} />
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
              <OsPieChart data={prData} height={260} />
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
                height={260}
                lines={[{ key: "commits", name: "Commits", color: "#842ae3" }]}
              />
            ) : (
              <OsEmpty title="Aucun commit" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
