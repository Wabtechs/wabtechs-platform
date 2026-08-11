import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatCard } from "@/components/admin/os/os-stat-card";
import { OsProjectFilter } from "@/components/admin/os/os-project-filter";
import { OsLineChart } from "@/components/admin/os/os-charts";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { countWithinDays, seriesByDate, commitsPerDay } from "@/lib/os-github";
import { fmtNum } from "@/lib/os-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet, Star, GitFork, GitCommitVertical, GitMerge } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Business" };
export const dynamic = "force-dynamic";

export default async function OsBusinessPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project } = await searchParams;

  const repos = await db.gitHubRepository.findMany({
    select: { id: true, fullName: true, name: true, owner: true, stars: true, forks: true },
    orderBy: { fullName: "asc" },
  });
  const selected = project ? repos.find((r) => r.id === project) : null;
  const whereRepo = selected ? { repositoryId: selected.id } : {};

  const [commitRows, closedIssueRows, mergedPrRows, mergedCount] = await Promise.all([
    db.gitHubCommit.findMany({
      where: whereRepo,
      select: { committedAt: true },
      orderBy: { committedAt: "desc" },
    }),
    db.gitHubIssue.findMany({
      where: { ...whereRepo, isPr: false },
      select: { closedAt: true },
      orderBy: { closedAt: "desc" },
      take: 2000,
    }),
    db.gitHubPullRequest.findMany({
      where: { ...whereRepo, merged: true },
      select: { mergedAt: true },
      orderBy: { mergedAt: "desc" },
      take: 2000,
    }),
    db.gitHubPullRequest.count({ where: { ...whereRepo, merged: true } }),
  ]);

  const totalStars = selected ? selected.stars : repos.reduce((a, r) => a + r.stars, 0);
  const totalForks = selected ? selected.forks : repos.reduce((a, r) => a + r.forks, 0);
  const commits30 = countWithinDays(commitRows, 30);

  const commitsData = commitsPerDay(commitRows, 30);
  const closedData = seriesByDate(closedIssueRows, 30);
  const mergedData = seriesByDate(mergedPrRows, 30);

  const topRepos = repos.sort((a, b) => b.stars - a.stars).slice(0, 8);
  const maxStars = Math.max(1, ...topRepos.map((r) => r.stars));

  return (
    <div>
      <OsPageHeader
        title="Business"
        description={
          selected
            ? `Métriques GitHub — ${selected.fullName}`
            : "Métriques de traction et d'activité issues de GitHub"
        }
        icon={<Wallet className="h-5 w-5" />}
      >
        <OsProjectFilter
          projects={repos.map((r) => ({ id: r.id, slug: r.id, name: r.fullName }))}
          value={selected?.id ?? "all"}
          basePath="/admin/os/business"
        />
      </OsPageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OsStatCard
          label="Stars cumulées"
          value={fmtNum(totalStars)}
          hint="Traction GitHub"
          icon={<Star className="h-4 w-4" />}
          accent="text-amber-500"
        />
        <OsStatCard
          label="Forks cumulés"
          value={fmtNum(totalForks)}
          hint="Réutilisation du code"
          icon={<GitFork className="h-4 w-4" />}
          accent="text-sky-500"
        />
        <OsStatCard
          label="Commits (30 jours)"
          value={fmtNum(commits30)}
          hint={`${fmtNum(commitRows.length)} au total`}
          icon={<GitCommitVertical className="h-4 w-4" />}
          accent="text-violet-500"
        />
        <OsStatCard
          label="PRs fusionnées"
          value={fmtNum(mergedCount)}
          hint="Livraisons de code"
          icon={<GitMerge className="h-4 w-4" />}
          accent="text-emerald-500"
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Activité commits</CardTitle>
            <CardDescription>Commits par jour — 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            {commitsData.some((d) => d.commits > 0) ? (
              <OsLineChart
                data={commitsData}
                xKey="label"
                height={220}
                lines={[{ key: "commits", name: "Commits", color: "#842ae3" }]}
              />
            ) : (
              <OsEmpty title="Aucun commit" />
            )}
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Issues fermées</CardTitle>
            <CardDescription>Résolution par jour — 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            {closedData.some((d) => d.value > 0) ? (
              <OsLineChart
                data={closedData}
                xKey="label"
                height={220}
                lines={[{ key: "value", name: "Fermées", color: "#10b981" }]}
              />
            ) : (
              <OsEmpty title="Aucune issue fermée" />
            )}
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">PRs fusionnées</CardTitle>
            <CardDescription>Fusions par jour — 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            {mergedData.some((d) => d.value > 0) ? (
              <OsLineChart
                data={mergedData}
                xKey="label"
                height={220}
                lines={[{ key: "value", name: "Fusionnées", color: "#3b82f6" }]}
              />
            ) : (
              <OsEmpty title="Aucune PR fusionnée" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Traction par dépôt</CardTitle>
            <CardDescription>Stars des dépôts les plus suivis</CardDescription>
          </CardHeader>
          <CardContent>
            {topRepos.length === 0 ? (
              <OsEmpty title="Aucun dépôt" />
            ) : (
              <div className="space-y-4">
                {topRepos.map((r) => (
                  <div key={r.id} className="flex items-center gap-3">
                    <span className="flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                      <Star className="h-3.5 w-3.5 text-amber-400" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="truncate font-medium">{r.fullName}</span>
                        <span className="ml-2 font-semibold">{fmtNum(r.stars)}</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${Math.max(2, (r.stars / maxStars) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
