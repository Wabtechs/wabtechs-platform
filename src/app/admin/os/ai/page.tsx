"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, AlertTriangle, Lightbulb, TrendingUp, ShieldAlert, Target, Rocket, CalendarClock } from "lucide-react";
import { fmtEur } from "@/lib/os-utils";

interface StatsResponse {
  projects: {
    id: string;
    slug: string;
    name: string;
    color: string;
    healthScore: number;
    mrr: number | string;
    status: string;
    _count: { features: number; bugs: number; objectives: number };
  }[];
  totals: {
    activeProjects: number;
    totalMrr: number | string;
    avgHealth: number;
    featureTotal: number;
    featureDone: number;
    featureProgress: number;
    bugOpen: number;
    bugCritical: number;
    activeSprints: number;
    objectivesAtRisk: number;
  };
  featureCounts: Record<string, number>;
  bugCounts: Record<string, number>;
  bugSeverityCounts: Record<string, number>;
  sprintCounts: Record<string, number>;
  objectiveCounts: Record<string, number>;
  releases: { id: string; name: string; project: { slug: string; name: string } }[];
  milestones: { id: string; title: string; date: string | null; project: { slug: string; name: string } }[];
  roadmapItems: { id: string; title: string; priority: string; progress: number; endDate: string | null }[];
  notifications: { id: string; title: string; content: string | null }[];
  growth: { date: string; metric: string; value: number }[];
}

interface Insight {
  type: "warning" | "info" | "positive";
  icon: React.ReactNode;
  title: string;
  body: string;
  link?: { href: string; label: string };
}

function icon(type: Insight["type"]) {
  if (type === "warning") return <AlertTriangle className="h-4 w-4 text-rose-500" />;
  if (type === "positive") return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  return <Lightbulb className="h-4 w-4 text-blue-500" />;
}

export default function OsAiPage() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/os/stats")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const insights: Insight[] = [];

  if (data) {
    if (data.totals.bugCritical > 0) {
      insights.push({
        type: "warning",
        icon: icon("warning"),
        title: `${data.totals.bugCritical} bug${data.totals.bugCritical > 1 ? "s" : ""} critique${data.totals.bugCritical > 1 ? "s" : ""} ou bloquant${data.totals.bugCritical > 1 ? "s" : ""} ouverts`,
        body: "Un bug critique non traité peut bloquer une release. Priorisez leur tri et leur correctif immédiatement.",
        link: { href: "/admin/os/bugs", label: "Voir les bugs" },
      });
    }

    if (data.totals.objectivesAtRisk > 0) {
      insights.push({
        type: "warning",
        icon: icon("warning"),
        title: `${data.totals.objectivesAtRisk} objectif${data.totals.objectivesAtRisk > 1 ? "s" : ""} à risque ou en retard`,
        body: "Revoyez ces objectifs : un dérapage ici impacte la trajectoire produit du portfolio.",
        link: { href: "/admin/os/objectives", label: "Voir les objectifs" },
      });
    }

    const backlog = data.featureCounts.BACKLOG ?? 0;
    if (backlog > 0 && data.totals.featureTotal > 0) {
      const ratio = Math.round((backlog / data.totals.featureTotal) * 100);
      if (ratio > 40) {
        insights.push({
          type: "info",
          icon: icon("info"),
          title: `${ratio}% des features sont encore au backlog`,
          body: `Le backlog concentre ${backlog} features. Pensez à challenger les priorités et à couper ce qui n'apporte pas de valeur.`,
          link: { href: "/admin/os/features", label: "Voir le kanban" },
        });
      }
    }

    if (data.totals.featureProgress > 0) {
      insights.push({
        type: "positive",
        icon: icon("positive"),
        title: `${data.totals.featureProgress}% des features sont livrées`,
        body: `Un rythme de livraison de ${data.totals.featureProgress}% sur ${data.totals.featureTotal} features est sain.`,
        link: { href: "/admin/os/kpi", label: "Voir les KPI" },
      });
    }

    const urgentNotDone = data.roadmapItems.filter((r) => r.priority === "URGENT" && r.progress < 100);
    if (urgentNotDone.length > 0) {
      insights.push({
        type: "info",
        icon: icon("info"),
        title: `${urgentNotDone.length} item${urgentNotDone.length > 1 ? "s" : ""} roadmap urgent${urgentNotDone.length > 1 ? "s" : ""} en cours`,
        body: urgentNotDone.map((r) => r.title).join(" · "),
        link: { href: "/admin/os/roadmap", label: "Voir la roadmap" },
      });
    }

    if (data.totals.activeSprints > 0) {
      insights.push({
        type: "positive",
        icon: icon("positive"),
        title: `${data.totals.activeSprints} sprint${data.totals.activeSprints > 1 ? "s" : ""} actif${data.totals.activeSprints > 1 ? "s" : ""}`,
        body: "Les équipes sont en itération active. Suivez la vélocité pour ajuster le planning.",
        link: { href: "/admin/os/sprints", label: "Voir les sprints" },
      });
    }

    const latest = data.releases[0];
    if (latest) {
      insights.push({
        type: "positive",
        icon: <Rocket className="h-4 w-4 text-blue-500" />,
        title: `Dernière release : ${latest.name}`,
        body: `Publiée sur ${latest.project.name}. Vérifiez les métriques post-release.`,
        link: { href: "/admin/os/roadmap", label: "Voir la roadmap" },
      });
    }

    const lastMrr = data.growth.length ? [...data.growth].filter((g) => g.metric === "mrr").pop() : null;
    const prevMrr = data.growth.length ? [...data.growth].filter((g) => g.metric === "mrr").at(-2) : null;
    if (lastMrr && prevMrr && prevMrr.value > 0) {
      const delta = Math.round(((lastMrr.value - prevMrr.value) / prevMrr.value) * 100);
      insights.push({
        type: delta >= 0 ? "positive" : "warning",
        icon: icon(delta >= 0 ? "positive" : "warning"),
        title: `MRR ${delta >= 0 ? "en hausse" : "en baisse"} de ${Math.abs(delta)}%`,
        body: `Passage de ${fmtEur(prevMrr.value)} à ${fmtEur(lastMrr.value)}.`,
        link: { href: "/admin/os/business", label: "Voir les métriques business" },
      });
    }

    const worst = [...data.projects].sort((a, b) => a.healthScore - b.healthScore)[0];
    if (worst && worst.healthScore < 60) {
      insights.push({
        type: "warning",
        icon: <ShieldAlert className="h-4 w-4 text-rose-500" />,
        title: `${worst.name} est le projet le plus fragile`,
        body: `Health score de ${worst.healthScore}/100. Investissez dans la stabilité avant d'ajouter des fonctionnalités.`,
        link: { href: `/admin/os/projects/${worst.slug}`, label: "Ouvrir le projet" },
      });
    }

    const urgentActive = data.projects.filter((p) => p._count.bugs > 0 && p.status === "ACTIVE");
    if (urgentActive.length > 0 && data.totals.bugOpen > 0) {
      insights.push({
        type: "info",
        icon: <Target className="h-4 w-4 text-blue-500" />,
        title: `${data.totals.bugOpen} bugs ouverts à répartir`,
        body: "Équilibrez la charge : assignez les bugs par sévérité et priorité aux membres disponibles.",
        link: { href: "/admin/os/bugs", label: "Voir les bugs" },
      });
    }
  }

  return (
    <div className="min-h-screen">
      <OsPageHeader
        title="Intelligence"
        description="Insights et recommandations générés à partir des données du Project OS"
        icon={<Sparkles className="h-5 w-5" />}
      />

      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {!loading && !data && (
        <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
          <CardContent className="py-16 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-[13px] text-gray-500">Impossible de charger les données.</p>
          </CardContent>
        </Card>
      )}

      {!loading && data && (
        <div className="grid gap-4 md:grid-cols-2">
          {insights.length === 0 && (
            <Card className="md:col-span-2 border-gray-200/80 bg-white dark:border-border dark:bg-card">
              <CardContent className="py-16 text-center">
                <Lightbulb className="mx-auto mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
                <p className="text-[13px] text-gray-500">Aucun signal particulier détecté pour l&apos;instant.</p>
              </CardContent>
            </Card>
          )}
          {insights.map((ins, i) => (
            <Card key={i} className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
              <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/5">{ins.icon}</div>
                <div>
                  <CardTitle className="text-[13px] leading-snug">{ins.title}</CardTitle>
                  <CardDescription className="mt-1 text-[12px] leading-relaxed">{ins.body}</CardDescription>
                  {ins.link && (
                    <Link href={ins.link.href} className="mt-2 inline-block text-[11px] font-medium text-primary hover:underline">
                      {ins.link.label} →
                    </Link>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {!loading && data && data.notifications.length > 0 && (
        <div className="mt-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <CalendarClock className="h-4 w-4 text-primary" /> Dernières notifications
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {data.notifications.map((n) => (
              <div key={n.id} className="rounded-lg border border-gray-100 bg-white p-3 dark:border-border dark:bg-card">
                <p className="text-[13px] font-medium">{n.title}</p>
                {n.content && <p className="mt-0.5 text-[11px] text-gray-400">{n.content}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-dashed border-gray-200 p-6 text-center dark:border-border">
        <p className="text-[12px] text-gray-400">
          Le module d&apos;intelligence se renforce à mesure que les données s&apos;accumulent (stats, bugs, roadmap, objectifs).
        </p>
        <p className="mt-1 text-[11px] text-gray-400">Prochaine étape : intégration d&apos;un LLM pour l&apos;analyse générative.</p>
      </div>
    </div>
  );
}
