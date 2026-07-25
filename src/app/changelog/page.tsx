import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Check, Plus, Wrench, Zap, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Historique des mises à jour et nouvelles fonctionnalités de WabTechs.",
};

type ChangeType = "feature" | "fix" | "improvement" | "breaking";

const CHANGE_TYPE_CONFIG: Record<ChangeType, { icon: typeof Check; label: string; color: string }> = {
  feature: { icon: Plus, label: "Feature", color: "text-green-500" },
  fix: { icon: Wrench, label: "Fix", color: "text-blue-500" },
  improvement: { icon: Zap, label: "Amélioration", color: "text-yellow-500" },
  breaking: { icon: Zap, label: "Breaking", color: "text-red-500" },
};

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: { type: ChangeType; description: string }[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    version: "2.5.0",
    date: "25 Juillet 2026",
    title: "Pages frontend complètes",
    changes: [
      { type: "feature", description: "Page Open Source avec projets GitHub et guide de contribution" },
      { type: "feature", description: "Page Événements avec listing à venir et passés" },
      { type: "feature", description: "Page Roadmaps avec timeline interactive et statuts" },
      { type: "feature", description: "Page Communauté avec charte et rôles" },
      { type: "feature", description: "Page Support avec canaux et FAQ rapide" },
      { type: "feature", description: "Page Tarifs avec 3 plans (Gratuit, Pro, Équipe)" },
      { type: "feature", description: "Page Changelog pour suivre les mises à jour" },
      { type: "improvement", description: "Privacy et Terms réécrites avec contenu complet RGPD" },
      { type: "improvement", description: "FAQ avec recherche et accordéon interactif" },
      { type: "improvement", description: "Downloads avec catégories et métadonnées complètes" },
      { type: "improvement", description: "Resources avec liens réels et catégorisées" },
      { type: "improvement", description: "Snippets avec code réel et syntaxe formatée" },
      { type: "improvement", description: "Tutoriels avec étapes et technologies détaillées" },
      { type: "improvement", description: "Vidéos avec durée, catégories et niveaux" },
      { type: "improvement", description: "Podcast avec tags et liens plateformes" },
    ],
  },
  {
    version: "2.4.0",
    date: "20 Juillet 2026",
    title: "Infrastructure et authentification",
    changes: [
      { type: "feature", description: "Middleware proxy pour Next.js 16 (migration de middleware.ts)" },
      { type: "feature", description: "Pages docs rendues avec MDX réel via compileMDX" },
      { type: "fix", description: "NEXTAUTH_URL corrigé pour production Vercel" },
      { type: "improvement", description: "Sidebar docs dynamique basée sur les fichiers MDX" },
    ],
  },
  {
    version: "2.3.0",
    date: "15 Juillet 2026",
    title: "Dashboard et admin avec données réelles",
    changes: [
      { type: "feature", description: "Dashboard avec statistiques Prisma en temps réel" },
      { type: "feature", description: "Admin posts CRUD avec création et suppression" },
      { type: "feature", description: "Admin podcasts CRUD" },
      { type: "feature", description: "Admin projects CRUD" },
      { type: "feature", description: "Admin messages avec lecture et suppression" },
      { type: "feature", description: "Admin subscribers et user management" },
      { type: "feature", description: "Seed Prisma avec admin user (admin@wabtechs.com)" },
    ],
  },
  {
    version: "2.2.0",
    date: "8 Juillet 2026",
    title: "Blog et contenu MDX",
    changes: [
      { type: "feature", description: "Blog avec 3 articles MDX (architecture, perf, TypeScript)" },
      { type: "feature", description: "Docs avec 4 pages MDX (getting-started, architecture, api, guides)" },
      { type: "feature", description: "Page blog avec recherche et filtrage par tags" },
      { type: "feature", description: "Articles liés et table des matières" },
    ],
  },
  {
    version: "2.1.0",
    date: "1 Juillet 2026",
    title: "Authentification et sécurité",
    changes: [
      { type: "feature", description: "NextAuth v5 avec credentials provider et JWT" },
      { type: "feature", description: "Pages login et register avec React Hook Form" },
      { type: "feature", description: "Protection routes dashboard et admin via middleware" },
      { type: "improvement", description: "Bcrypt pour le hashage des mots de passe" },
    ],
  },
  {
    version: "2.0.0",
    date: "25 Juin 2026",
    title: "Lancement de la plateforme",
    changes: [
      { type: "feature", description: "Initialisation Next.js 16 + React 19 + TypeScript strict" },
      { type: "feature", description: "Design system Tailwind CSS v4 avec thème oklch" },
      { type: "feature", description: "13 composants shadcn/ui" },
      { type: "feature", description: "Pages homepage, about, contact, blog, docs, projects, podcast, videos" },
      { type: "feature", description: "SEO avec sitemap, robots, OpenGraph metadata" },
      { type: "feature", description: "Error pages (not-found, error, loading)" },
      { type: "feature", description: "Déploiement Vercel avec Neon PostgreSQL" },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Changelog"
          title="Historique"
          highlight="des mises à jour"
          description="Toutes les modifications, nouvelles fonctionnalités et corrections apportées à la plateforme."
        />

        <div className="mt-16 space-y-12">
          {CHANGELOG.map((entry) => (
            <div key={entry.version}>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="font-mono">v{entry.version}</Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {entry.date}
                </span>
              </div>
              <h2 className="text-xl font-bold">{entry.title}</h2>
              <div className="mt-4 space-y-2">
                {entry.changes.map((change, i) => {
                  const config = CHANGE_TYPE_CONFIG[change.type];
                  const Icon = config.icon;
                  return (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.color}`} />
                      <span className="text-muted-foreground">{change.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
