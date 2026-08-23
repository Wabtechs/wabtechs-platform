import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Check, Circle, Clock, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Roadmaps",
  description: "Feuille de route et plans de développement de la plateforme WabTechs.",
};

type Status = "done" | "in-progress" | "planned";

interface RoadmapItem {
  title: string;
  status: Status;
}

interface RoadmapQuarter {
  quarter: string;
  label: string;
  items: RoadmapItem[];
}

const ROADMAPS: RoadmapQuarter[] = [
  {
    quarter: "Q2 2026",
    label: "Fondations",
    items: [
      { title: "Initialisation Next.js 16 + React 19", status: "done" },
      { title: "Système d'authentification (NextAuth v5)", status: "done" },
      { title: "Blog avec contenu MDX", status: "done" },
      { title: "Dashboard admin avec Prisma", status: "done" },
      { title: "Déploiement Vercel + Neon PostgreSQL", status: "done" },
    ],
  },
  {
    quarter: "Q3 2026",
    label: "Communauté & Contenu",
    items: [
      { title: "Forum de discussion communautaire", status: "in-progress" },
      { title: "Système de commentaires sur les articles", status: "in-progress" },
      { title: "Podcast intégré avec lecteur audio", status: "planned" },
      { title: "Vidéos avec player intégré", status: "planned" },
      { title: "Tutoriels pas-à-pas avec progression", status: "planned" },
      { title: "Snippets de code réutilisables", status: "planned" },
    ],
  },
  {
    quarter: "Q4 2026",
    label: "Avancé",
    items: [
      { title: "Newsletter avancée avec segmentation", status: "planned" },
      { title: "Recherche full-text sur tout le contenu", status: "planned" },
      { title: "Notifications push et email", status: "planned" },
      { title: "API publique pour intégrations", status: "planned" },
      { title: "Mode hors-ligne (PWA)", status: "planned" },
      { title: "Analytics dashboard pour auteurs", status: "planned" },
    ],
  },
  {
    quarter: "Q1 2027",
    label: "Évolutivité",
    items: [
      { title: "Multi-utilisateurs avec rôles avancés", status: "planned" },
      { title: "Système de badges et réputation", status: "planned" },
      { title: "Marketplace de templates", status: "planned" },
      { title: "Intégrations tierces (GitHub, Discord)", status: "planned" },
      { title: "Internationalisation (i18n) complète", status: "planned" },
    ],
  },
];

const STATUS_CONFIG: Record<Status, { icon: typeof Check; label: string; color: string; badgeVariant: "default" | "secondary" | "outline" }> = {
  done: { icon: Check, label: "Terminé", color: "text-green-500", badgeVariant: "default" },
  "in-progress": { icon: Clock, label: "En cours", color: "text-yellow-500", badgeVariant: "secondary" },
  planned: { icon: Circle, label: "Prévu", color: "text-muted-foreground", badgeVariant: "outline" },
};

export default function RoadmapsPage() {
  const totalItems = ROADMAPS.reduce((acc, q) => acc + q.items.length, 0);
  const doneItems = ROADMAPS.reduce((acc, q) => acc + q.items.filter((i) => i.status === "done").length, 0);
  const inProgressItems = ROADMAPS.reduce((acc, q) => acc + q.items.filter((i) => i.status === "in-progress").length, 0);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Roadmaps"
          title="Roadmaps"
          highlight="2026-2027"
          description="Feuille de route transparente — suivez l'avancement des fonctionnalités."
        />

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>{doneItems} terminé{doneItems > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span>{inProgressItems} en cours</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 text-muted-foreground" />
            <span>{totalItems - doneItems - inProgressItems} prévu{totalItems - doneItems - inProgressItems > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>{totalItems} fonctionnalités au total</span>
          </div>
        </div>

        <div className="mt-16 space-y-12">
          {ROADMAPS.map((quarter) => {
            const quarterDone = quarter.items.filter((i) => i.status === "done").length;
            const progress = Math.round((quarterDone / quarter.items.length) * 100);

            return (
              <div key={quarter.quarter}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold tracking-tight">{quarter.quarter}</h2>
                  <Badge variant="outline">{quarter.label}</Badge>
                  <div className="flex-1" />
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>

                <div className="relative ml-4 border-l-2 border-muted pl-8 space-y-4">
                  {quarter.items.map((item) => {
                    const config = STATUS_CONFIG[item.status];
                    const Icon = config.icon;
                    return (
                      <div key={item.title} className="relative flex items-center gap-3">
                        <div className={`absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background ${item.status === "done" ? "border-green-500" : item.status === "in-progress" ? "border-yellow-500" : "border-muted-foreground/30"}`}>
                          <Icon className={`h-3 w-3 ${config.color}`} />
                        </div>
                        <span className={item.status === "done" ? "text-muted-foreground line-through" : ""}>
                          {item.title}
                        </span>
                        <Badge variant={config.badgeVariant} className="text-xs">
                          {config.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
