import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { OsStatusBadge } from "@/components/admin/os/os-badge";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { fmtDateTime } from "@/lib/os-utils";
import { Map, Github, GitPullRequest, ExternalLink } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Roadmap" };
export const dynamic = "force-dynamic";

export default async function OsRoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ repository?: string }>;
}) {
  const { repository } = await searchParams;

  const repositories = await db.gitHubRepository.findMany({
    select: { id: true, fullName: true, name: true, owner: true },
    orderBy: { fullName: "asc" },
  });

  const ids = repository
    ? repositories.filter((r) => r.id === repository).map((r) => r.id)
    : repositories.map((r) => r.id);

  const [issues, pullRequests] = await Promise.all([
    db.gitHubIssue.findMany({
      where: { repositoryId: { in: ids }, isPr: false, state: "open" },
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: { repository: { select: { id: true, fullName: true } } },
    }),
    db.gitHubPullRequest.findMany({
      where: { repositoryId: { in: ids }, state: "open", merged: false },
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: { repository: { select: { id: true, fullName: true } } },
    }),
  ]);

  return (
    <div>
      <OsPageHeader
        title="Roadmap"
        description="Travail en cours sur les dépôts GitHub — issues et pull requests ouvertes"
        icon={<Map className="h-5 w-5" />}
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link
          href="/admin/os/roadmap"
          className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${
            !repository
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
          }`}
        >
          Tous les dépôts
        </Link>
        {repositories.map((r) => (
          <Link
            key={r.id}
            href={`/admin/os/roadmap?repository=${r.id}`}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${
              repository === r.id
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
            }`}
          >
            {r.fullName}
          </Link>
        ))}
      </div>

      {issues.length === 0 && pullRequests.length === 0 ? (
        <OsEmpty
          title="Aucun travail en cours"
          hint="Aucune issue ou pull request ouverte sur les dépôts sélectionnés."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="border-border bg-card rounded-xl border">
            <div className="dark:border-border flex items-center gap-2 border-b border-gray-100 px-4 py-3">
              <Github className="h-4 w-4 text-emerald-500" />
              <p className="text-[13px] font-semibold">Issues ouvertes</p>
              <span className="ml-auto rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-white/10">
                {issues.length}
              </span>
            </div>
            <div className="dark:divide-border divide-y divide-gray-100">
              {issues.map((i) => (
                <a
                  key={i.id}
                  href={i.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start justify-between gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">
                      <span className="text-gray-400">#{i.number}</span> {i.title}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-gray-400">
                      <span className="font-medium text-gray-500 dark:text-gray-300">
                        {i.repository.fullName}
                      </span>
                      <span>· {fmtDateTime(i.updatedAt)}</span>
                    </p>
                    {Array.isArray(i.labels) && i.labels.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {(i.labels as { id: number; name: string; color?: string | null }[])
                          .slice(0, 4)
                          .map((l) => (
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
                    )}
                  </div>
                  <ExternalLink className="mt-1 h-3 w-3 shrink-0 text-gray-300" />
                </a>
              ))}
              {issues.length === 0 && (
                <p className="px-4 py-8 text-center text-[12px] text-gray-400">
                  Aucune issue ouverte
                </p>
              )}
            </div>
          </div>

          <div className="border-border bg-card rounded-xl border">
            <div className="dark:border-border flex items-center gap-2 border-b border-gray-100 px-4 py-3">
              <GitPullRequest className="h-4 w-4 text-violet-500" />
              <p className="text-[13px] font-semibold">Pull requests ouvertes</p>
              <span className="ml-auto rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-white/10">
                {pullRequests.length}
              </span>
            </div>
            <div className="dark:divide-border divide-y divide-gray-100">
              {pullRequests.map((pr) => (
                <a
                  key={pr.id}
                  href={pr.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start justify-between gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">
                      <span className="text-gray-400">#{pr.number}</span> {pr.title}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-gray-400">
                      <span className="font-medium text-gray-500 dark:text-gray-300">
                        {pr.author ?? "inconnu"}
                      </span>
                      <span> · {pr.repository.fullName}</span>
                      {pr.headBranch && pr.baseBranch && (
                        <span>
                          {" "}
                          · {pr.headBranch} → {pr.baseBranch}
                        </span>
                      )}
                      <span> · {fmtDateTime(pr.updatedAt)}</span>
                    </p>
                  </div>
                  <OsStatusBadge status="OPEN" className="mt-0.5 shrink-0" />
                </a>
              ))}
              {pullRequests.length === 0 && (
                <p className="px-4 py-8 text-center text-[12px] text-gray-400">
                  Aucune pull request ouverte
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
