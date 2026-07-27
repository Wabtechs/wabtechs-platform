import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Play, Eye, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Vidéos",
  description: "Tutoriels vidéo et contenus YouTube sur les technologies web modernes.",
};

const VIDEOS = [
  {
    title: "Créer une app Next.js 16 de A à Z",
    description: "Tutoriel complet pour créer une application moderne avec Next.js 16, React 19, Prisma et PostgreSQL.",
    views: "2.5K",
    date: "8 Juillet 2026",
    duration: "42:18",
    category: "Tutoriel",
    level: "Débutant",
    thumbnail: null,
    url: "#",
  },
  {
    title: "Prise en main de Prisma ORM",
    description: "Tout savoir sur Prisma — schema, migrations, relations, transactions et optimisation des requêtes.",
    views: "1.8K",
    date: "1 Juillet 2026",
    duration: "35:42",
    category: "Tutoriel",
    level: "Intermédiaire",
    thumbnail: null,
    url: "#",
  },
  {
    title: "Tailwind CSS v4 — Nouveautés et migration",
    description: "Découvrez les nouvelles features de Tailwind v4 : CSS-first config, oklch, et guide de migration complet.",
    views: "3.2K",
    date: "25 Juin 2026",
    duration: "28:15",
    category: "Tutoriel",
    level: "Intermédiaire",
    thumbnail: null,
    url: "#",
  },
  {
    title: "NextAuth v5 — Auth complète en 30 min",
    description: "Implémentez une authentification credentials + JWT avec NextAuth v5 et Prisma Adapter.",
    views: "1.4K",
    date: "18 Juin 2026",
    duration: "31:05",
    category: "Tutoriel",
    level: "Intermédiaire",
    thumbnail: null,
    url: "#",
  },
  {
    title: "React 19 — Server Components en pratique",
    description: "Comprendre et utiliser les Server Components de React 19 dans un vrai projet.",
    views: "4.1K",
    date: "10 Juin 2026",
    duration: "38:22",
    category: "Concept",
    level: "Avancé",
    thumbnail: null,
    url: "#",
  },
  {
    title: "Deployer sur Vercel — Guide complet",
    description: "Tout pour déployer votre Next.js sur Vercel — variables d'env, edge functions, ISR, monorepo.",
    views: "2.8K",
    date: "3 Juin 2026",
    duration: "25:50",
    category: "DevOps",
    level: "Intermédiaire",
    thumbnail: null,
    url: "#",
  },
];

const LEVEL_COLORS: Record<string, string> = {
  Débutant: "bg-green-500",
  Intermédiaire: "bg-yellow-500",
  Avancé: "bg-red-500",
};

export default function VideosPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Vidéos"
          title="Vidéos &"
          highlight="Tutoriels"
          description="Contenus vidéo pour apprendre et se perfectionner — tutoriels, concepts et guides pratiques."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((video) => (
            <a key={video.title} href={video.url} target="_blank" rel="noopener noreferrer">
              <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 group">
                <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <Play className="h-8 w-8 ml-1" />
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="text-xs bg-black/60 text-white border-0">
                      <Clock className="mr-1 h-3 w-3" />
                      {video.duration}
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <Badge variant="secondary" className="text-xs bg-black/60 text-white border-0">
                      {video.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${LEVEL_COLORS[video.level]}`} />
                    <span className="text-xs text-muted-foreground">{video.level}</span>
                  </div>
                  <CardTitle className="text-sm leading-snug group-hover:text-primary transition-colors">
                    {video.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">{video.description}</CardDescription>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {video.views} vues
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {video.date}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
