import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { OsStatusBadge, OsTypeBadge, OsPriorityBadge, OsSeverityBadge, OsMethodBadge } from "@/components/admin/os/os-badge";
import { OsEmpty } from "@/components/admin/os/os-empty";
import { ProjectStatusSelect } from "./status-select";
import { healthColor, progressColor } from "@/lib/os-labels";
import { fmtEur, fmtNum, fmtDate, daysUntil } from "@/lib/os-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Github, FileText, Globe, Users, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await db.osProject.findUnique({ where: { slug } });
  return { title: `Project OS — ${project?.name ?? slug}` };
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
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

export default async function OsProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const project = await db.osProject.findUnique({
    where: { slug },
    include: {
      owner: { select: { name: true, email: true } },
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      modules: true,
      epics: { include: { _count: { select: { features: true } } } },
      sprints: { include: { _count: { select: { features: true } } } },
      releases: { orderBy: { createdAt: "desc" } },
      milestones: { orderBy: { date: "asc" } },
      roadmapItems: { orderBy: { endDate: "asc" } },
      features: {
        include: {
          module: { select: { id: true, name: true } },
          epic: { select: { id: true, name: true } },
          assignee: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      bugs: { include: { assignee: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } },
      objectives: { include: { keyResults: true, assignee: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) notFound();

  const totalFeaturePoints = project.features.reduce((a, f) => a + f.points, 0);
  const completedPoints = project.features.filter((f) => f.status === "DONE" || f.status === "RELEASED").reduce((a, f) => a + f.points, 0);
  const openBugs = project.bugs.filter((b) => ["NEW", "TRIAGED", "IN_PROGRESS"].includes(b.status)).length;

  return (
    <div>
      <Link href="/admin/os/projects" className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-400 hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> Retour aux projets
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg" style={{ background: project.color }}>
            {project.name.charAt(0)}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
              <OsStatusBadge status={project.status} />
              <OsTypeBadge type={project.type} />
            </div>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
              v{project.version} · {project.environment} · {project.technologies}
            </p>
          </div>
        </div>
        <ProjectStatusSelect slug={project.slug} value={project.status} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">Santé</p>
            <p className={`mt-1 text-2xl font-semibold ${healthColor(project.healthScore)}`}>{project.healthScore}/100</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">Sprint progress</p>
            <p className="mt-1 text-2xl font-semibold">{project.features.length ? `${Math.round((completedPoints / totalFeaturePoints) * 100)}%` : "0%"}</p>
            <p className="mt-0.5 text-[11px] text-gray-400">{completedPoints}/{totalFeaturePoints} story points livrés</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">Bugs ouverts</p>
            <p className={`mt-1 text-2xl font-semibold ${openBugs ? "text-rose-500" : "text-emerald-500"}`}>{openBugs}</p>
            <p className="mt-0.5 text-[11px] text-gray-400">sur {project.bugs.length} au total</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">MRR</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-500">{fmtEur(project.mrr)}</p>
            <p className="mt-0.5 text-[11px] text-gray-400">{fmtNum(project.githubStars)} stars · {fmtNum(project.githubForks)} forks</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-[13px] font-semibold">
              <Users className="h-4 w-4 text-primary" /> Équipe ({project.members.length})
            </div>
            <ul className="mt-3 space-y-2">
              {project.members.map((m) => (
                <li key={m.id} className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/[0.08] text-[10px] font-semibold text-primary">
                      {m.user.name?.charAt(0) ?? "?"}
                    </span>
                    {m.user.name}
                  </span>
                  <span className="text-[10px] font-medium text-gray-400">{m.role}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-gray-100 pt-3 text-[11px] text-gray-400 dark:border-border">Owner : {project.owner.name ?? project.owner.email}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border bg-card">
          <CardContent className="p-5">
            <p className="text-[13px] font-semibold">Liens & informations</p>
            <p className="mt-2 text-[12px] leading-relaxed text-gray-500 dark:text-gray-400">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-medium hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10">
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
              )}
              {project.docsUrl && (
                <a href={project.docsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-medium hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10">
                  <FileText className="h-3.5 w-3.5" /> Docs
                </a>
              )}
              {project.websiteUrl && (
                <a href={project.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-medium hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10">
                  <Globe className="h-3.5 w-3.5" /> Site
                </a>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3 text-center text-[11px] dark:bg-white/5">
              <div><p className="text-sm font-semibold">{fmtNum(project.githubStars)}</p><p className="text-gray-400">Stars</p></div>
              <div><p className="text-sm font-semibold">{fmtNum(project.githubIssues)}</p><p className="text-gray-400">Issues</p></div>
              <div><p className="text-sm font-semibold">{fmtNum(project.githubCommits)}</p><p className="text-gray-400">Commits</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Section title="Modules" description={`${project.modules.length} modules`}>
          {project.modules.length === 0 ? (
            <OsEmpty title="Aucun module" />
          ) : (
            <div className="space-y-3">
              {project.modules.map((m) => (
                <div key={m.id} className="rounded-lg border border-gray-100 p-3 dark:border-border">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium">{m.name}</p>
                    <OsStatusBadge status={m.status} />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400">
                    <span>v{m.version}</span>
                    <span>·</span>
                    <span>Couverture {m.testCoverage}%</span>
                    <span>·</span>
                    <span>Dette {m.technicalDebt}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                    <div className={`h-full rounded-full ${progressColor(m.progress)}`} style={{ width: `${m.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Sprints" description={`${project.sprints.length} sprints`}>
          {project.sprints.length === 0 ? (
            <OsEmpty title="Aucun sprint" />
          ) : (
            <div className="space-y-3">
              {project.sprints.map((s) => {
                const d = daysUntil(s.endDate);
                return (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-border">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium">{s.name}</p>
                      {s.goal && <p className="mt-0.5 truncate text-[11px] text-gray-400">{s.goal}</p>}
                      <p className="mt-0.5 text-[10px] text-gray-400">
                        {s.startDate ? fmtDate(s.startDate) : "—"} → {s.endDate ? fmtDate(s.endDate) : "—"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <OsStatusBadge status={s.status} />
                      <p className="mt-1 text-[10px] text-gray-400">vélocité {s.velocity}</p>
                      {d !== null && s.status === "ACTIVE" && <p className="text-[10px] font-medium text-amber-500">{d >= 0 ? `${d} j restants` : `dépassé de ${-d} j`}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Section title="Features" description={`${project.features.length} fonctionnalités`}>
          {project.features.length === 0 ? (
            <OsEmpty title="Aucune feature" />
          ) : (
            <div className="space-y-2">
              {project.features.slice(0, 10).map((f) => (
                <div key={f.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2.5 dark:border-border">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{f.title}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-400">
                      {f.module && <span>{f.module.name}</span>}
                      {f.epic && <><span>·</span><span>{f.epic.name}</span></>}
                      {f.assignee && <><span>·</span><span>{f.assignee.name}</span></>}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-white/5 dark:text-gray-400">{f.points} pts</span>
                    <OsPriorityBadge priority={f.priority} />
                    <OsStatusBadge status={f.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Bugs" description={`${project.bugs.length} bugs · ${openBugs} ouverts`}>
          {project.bugs.length === 0 ? (
            <OsEmpty title="Aucun bug" />
          ) : (
            <div className="space-y-2">
              {project.bugs.slice(0, 10).map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2.5 dark:border-border">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{b.title}</p>
                    <p className="mt-0.5 text-[10px] text-gray-400">
                      {b.version && <span>v{b.version}</span>}
                      {b.assignee && <><span> · </span><span>{b.assignee.name}</span></>}
                      <span> · </span><span>{b.fixHours}h estimées</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <OsSeverityBadge severity={b.severity} />
                    <OsPriorityBadge priority={b.priority} />
                    <OsStatusBadge status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Section title="Objectifs & Key Results" description={`${project.objectives.length} objectifs`}>
          {project.objectives.length === 0 ? (
            <OsEmpty title="Aucun objectif" />
          ) : (
            <div className="space-y-3">
              {project.objectives.map((o) => (
                <div key={o.id} className="rounded-lg border border-gray-100 p-3 dark:border-border">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium">{o.title}</p>
                    <div className="flex items-center gap-2">
                      <OsMethodBadge method={o.method} />
                      <OsStatusBadge status={o.status} />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                      <div className={`h-full rounded-full ${progressColor(o.progress)}`} style={{ width: `${o.progress}%` }} />
                    </div>
                    <span className="text-[11px] font-semibold">{o.progress}%</span>
                  </div>
                  {o.keyResults.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {o.keyResults.map((kr) => (
                        <li key={kr.id} className="flex items-center justify-between text-[11px] text-gray-400">
                          <span className="truncate">{kr.title}</span>
                          <span className="ml-2 shrink-0 font-medium">
                            {Number(kr.current)}/{Number(kr.target)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {o.deadline && <p className="mt-1.5 text-[10px] text-gray-400">Échéance : {fmtDate(o.deadline)}</p>}
                </div>
              ))}
            </div>
          )}
        </Section>

        <div className="space-y-4">
          <Section title="Roadmap" description={`${project.roadmapItems.length} items`}>
            {project.roadmapItems.length === 0 ? (
              <OsEmpty title="Roadmap vide" />
            ) : (
              <div className="space-y-2">
                {project.roadmapItems.map((r) => {
                  const d = daysUntil(r.endDate);
                  return (
                    <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2.5 dark:border-border">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium">{r.title}</p>
                        <p className="mt-0.5 text-[10px] text-gray-400">
                          {r.type} · {r.estimatedHours}h estimées · {r.actualHours}h passées
                          {d !== null && d >= 0 && <> · dans {d} j</>}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <OsPriorityBadge priority={r.priority} />
                        <span className="text-[11px] font-semibold">{r.progress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          <div className="grid gap-4 sm:grid-cols-2">
            <Section title="Releases" description={`${project.releases.length} versions`}>
              {project.releases.length === 0 ? (
                <OsEmpty title="Aucune release" />
              ) : (
                <div className="space-y-2">
                  {project.releases.map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5 dark:border-border">
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium">{r.name}</p>
                        <p className="text-[10px] text-gray-400">{r.releasedAt ? fmtDate(r.releasedAt) : r.status}</p>
                      </div>
                      <OsStatusBadge status={r.status} />
                    </div>
                  ))}
                </div>
              )}
            </Section>
            <Section title="Milestones" description={`${project.milestones.length} jalons`}>
              {project.milestones.length === 0 ? (
                <OsEmpty title="Aucun jalon" />
              ) : (
                <div className="space-y-2">
                  {project.milestones.map((m) => (
                    <div key={m.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5 dark:border-border">
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium">{m.title}</p>
                        <p className="text-[10px] text-gray-400">{m.date ? fmtDate(m.date) : "—"}</p>
                      </div>
                      <OsStatusBadge status={m.status} />
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Section title="Epics" description={`${project.epics.length} epics`}>
          {project.epics.length === 0 ? (
            <OsEmpty title="Aucun epic" />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.epics.map((e) => (
                <div key={e.id} className="rounded-lg border border-gray-100 p-3 dark:border-border">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium">{e.name}</p>
                    <OsStatusBadge status={e.status} />
                  </div>
                  {e.description && <p className="mt-1 line-clamp-2 text-[11px] text-gray-400">{e.description}</p>}
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${e.progress}%` }} />
                    </div>
                    <span>{e.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
