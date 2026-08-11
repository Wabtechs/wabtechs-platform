import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { OsStatusBadge } from "@/components/admin/os/os-badge";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { summarizeCiRuns } from "@/lib/os-github";
import { fmtNum, fmtDate, fmtDateTime } from "@/lib/os-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Github,
  Star,
  GitPullRequest,
  Activity,
  ExternalLink,
  ArrowLeft,
  GitCommitVertical,
  Rocket,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const repo = await db.gitHubRepository.findUnique({ where: { id } });
  return { title: `Project OS — ${repo?.fullName ?? id}` };
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function StateBadge({ state, merged }: { state: string; merged?: boolean }) {
  return <OsStatusBadge status={merged ? "MERGED" : state.toUpperCase()} />;
}

export default async function OsProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [repo, issues, pullRequests, commits, releases, runs] = await Promise.all([
    db.gitHubRepository.findUnique({
      where: { id },
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
    db.gitHubIssue.findMany({
      where: { repositoryId: id, isPr: false },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    db.gitHubPullRequest.findMany({
      where: { repositoryId: id },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    db.gitHubCommit.findMany({
      where: { repositoryId: id },
      orderBy: { committedAt: "desc" },
      take: 12,
    }),
    db.gitHubRelease.findMany({
      where: { repositoryId: id },
      orderBy: { publishedAt: "desc" },
    }),
    db.gitHubWorkflowRun.findMany({
      where: { repositoryId: id },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
  ]);

  if (!repo) notFound();

  const openIssues = issues.filter((i) => i.state === "open").length;
  const ci = summarizeCiRuns(runs);

  return (
    <div>
      <Link
        href="/admin/os/projects"
        className="hover:text-primary mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-400"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Retour aux projets
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="bg-primary/[0.08] flex h-14 w-14 items-center justify-center rounded-2xl">
            <Github className="text-primary h-7 w-7" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{repo.fullName}</h1>
              <OsStatusBadge status={repo.archived ? "ARCHIVED" : "ACTIVE"} />
              <OsStatusBadge status={repo.visibility === "private" ? "MAINTENANCE" : "PUBLIC"} />
            </div>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
              {repo.language ?? "Git"} · branche {repo.defaultBranch}
              {repo.lastSyncAt && <> · synchronisé le {fmtDateTime(repo.lastSyncAt)}</>}
            </p>
          </div>
        </div>
        <a
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-medium hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Ouvrir sur GitHub
        </a>
      </div>

      <p className="dark:border-border mb-6 rounded-xl border border-gray-100 p-4 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
        {repo.description ?? "Aucune description fournie sur GitHub."}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 dark:text-gray-400">
              <Star className="h-3.5 w-3.5 text-amber-400" /> Stars
            </p>
            <p className="mt-1 text-2xl font-semibold">{fmtNum(repo.stars)}</p>
            <p className="mt-0.5 text-[11px] text-gray-400">{fmtNum(repo.forks)} forks</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 dark:text-gray-400">
              <GitPullRequest className="h-3.5 w-3.5 text-blue-500" /> Issues ouvertes
            </p>
            <p
              className={`mt-1 text-2xl font-semibold ${openIssues ? "text-rose-500" : "text-emerald-500"}`}
            >
              {openIssues}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">sur {repo._count.issues} issues</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 dark:text-gray-400">
              <GitCommitVertical className="h-3.5 w-3.5 text-violet-500" /> Commits
            </p>
            <p className="mt-1 text-2xl font-semibold">{fmtNum(repo._count.commits)}</p>
            <p className="mt-0.5 text-[11px] text-gray-400">{repo._count.pullRequests} PRs</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 dark:text-gray-400">
              <Activity className="h-3.5 w-3.5 text-cyan-500" /> CI — succès
            </p>
            <p
              className={`mt-1 text-2xl font-semibold ${ci.passRate >= 80 ? "text-emerald-500" : ci.passRate >= 60 ? "text-amber-500" : "text-rose-500"}`}
            >
              {ci.passRate}%
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">{ci.total} runs récents</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Section
          title="Issues récentes"
          description={`${repo._count.issues} issues · ${openIssues} ouvertes`}
        >
          {issues.length === 0 ? (
            <OsEmpty title="Aucune issue" />
          ) : (
            <div className="space-y-2">
              {issues.map((i) => (
                <a
                  key={i.id}
                  href={i.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="dark:border-border flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">
                      <span className="text-gray-400">#{i.number}</span> {i.title}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-gray-400">
                      {Array.isArray(i.labels) &&
                        (i.labels as { name: string }[]).slice(0, 4).map((l) => (
                          <span
                            key={l.name}
                            className="rounded bg-gray-100 px-1.5 py-0.5 font-medium dark:bg-white/5"
                          >
                            {l.name}
                          </span>
                        ))}
                      <span>· {fmtDateTime(i.updatedAt)}</span>
                    </p>
                  </div>
                  <StateBadge state={i.state} />
                </a>
              ))}
            </div>
          )}
        </Section>

        <Section title="Pull requests récentes" description={`${repo._count.pullRequests} PRs`}>
          {pullRequests.length === 0 ? (
            <OsEmpty title="Aucune pull request" />
          ) : (
            <div className="space-y-2">
              {pullRequests.map((pr) => (
                <a
                  key={pr.id}
                  href={pr.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="dark:border-border flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">
                      <span className="text-gray-400">#{pr.number}</span> {pr.title}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-gray-400">
                      {pr.author ?? "inconnu"} · {pr.headBranch ?? "?"} → {pr.baseBranch ?? "?"} ·{" "}
                      {fmtDate(pr.mergedAt ?? pr.updatedAt)}
                    </p>
                  </div>
                  <StateBadge state={pr.state} merged={pr.merged} />
                </a>
              ))}
            </div>
          )}
        </Section>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Section title="Releases" description={`${repo._count.releases} versions`}>
          {releases.length === 0 ? (
            <OsEmpty title="Aucune release" />
          ) : (
            <div className="space-y-2">
              {releases.map((r) => (
                <a
                  key={r.id}
                  href={r.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="dark:border-border flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Rocket className="h-3.5 w-3.5 shrink-0 text-fuchsia-500" />
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium">{r.tagName}</p>
                      {r.name && r.name !== r.tagName && (
                        <p className="truncate text-[10px] text-gray-400">{r.name}</p>
                      )}
                    </div>
                  </div>
                  <p className="shrink-0 text-[10px] font-semibold text-emerald-500">
                    {r.publishedAt ? fmtDate(r.publishedAt) : "—"}
                  </p>
                </a>
              ))}
            </div>
          )}
        </Section>

        <Section title="Commits récents" description="Derniers commits">
          {commits.length === 0 ? (
            <OsEmpty title="Aucun commit" />
          ) : (
            <div className="space-y-2">
              {commits.map((c) => (
                <a
                  key={c.sha}
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="dark:border-border block rounded-lg border border-gray-100 px-3 py-2.5"
                >
                  <p className="truncate text-[12px] font-medium">{c.message.split("\n")[0]}</p>
                  <p className="mt-0.5 truncate text-[10px] text-gray-400">
                    {c.authorLogin ?? c.authorName ?? "inconnu"} · {fmtDateTime(c.committedAt)} ·{" "}
                    {c.sha.slice(0, 7)}
                  </p>
                </a>
              ))}
            </div>
          )}
        </Section>

        <Section title="Runs CI" description={`${repo._count.workflowRuns} runs`}>
          {runs.length === 0 ? (
            <OsEmpty title="Aucun run CI" />
          ) : (
            <div className="space-y-2">
              {runs.map((run) => (
                <a
                  key={run.id}
                  href={run.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="dark:border-border flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-medium">
                      {run.name ?? `Run #${run.runNumber}`}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-gray-400">
                      {run.branch ?? "?"} · {fmtDateTime(run.createdAt)}
                    </p>
                  </div>
                  <StateBadge state={(run.conclusion ?? run.status ?? "").toUpperCase()} />
                </a>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
