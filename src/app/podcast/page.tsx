import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Play, Clock, Calendar, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Podcast",
  description: "Épisodes de podcast sur les technologies et le développement web.",
};

const EPISODES = [
  {
    number: 12,
    title: "L'état de React en 2026",
    description: "Retour sur les nouveautés React 19, Server Components, Actions et l'avenir du framework.",
    date: "12 Juillet 2026",
    duration: "45 min",
    tags: ["React", "Server Components"],
  },
  {
    number: 11,
    title: "Mon setup de développement",
    description: "Outils, extensions VS Code, configuration terminal, et workflow productivité maximale.",
    date: "5 Juillet 2026",
    duration: "38 min",
    tags: ["Productivité", "Outils"],
  },
  {
    number: 10,
    title: "Déployer sur Vercel",
    description: "Guide complet du déploiement Next.js sur Vercel — config, edge functions, ISR, analytics.",
    date: "28 Juin 2026",
    duration: "52 min",
    tags: ["Vercel", "DevOps"],
  },
  {
    number: 9,
    title: "TypeScript strict mode",
    description: "Pourquoi et comment activer le mode strict — noUncheckedIndexedAccess, discriminated unions, type guards.",
    date: "21 Juin 2026",
    duration: "41 min",
    tags: ["TypeScript", "Bonnes pratiques"],
  },
  {
    number: 8,
    title: "Prisma ORM en production",
    description: "Retour d'expérience sur Prisma — schema design, migrations, performance, et pièges à éviter.",
    date: "14 Juin 2026",
    duration: "48 min",
    tags: ["Prisma", "Database"],
  },
  {
    number: 7,
    title: "Tailwind CSS v4 — Ce qui change",
    description: "Nouvelle configuration CSS-first, oklch colors, nouvelles utilities et migration depuis v3.",
    date: "7 Juin 2026",
    duration: "35 min",
    tags: ["Tailwind", "CSS"],
  },
];

const PLATFORMS = [
  { name: "YouTube", url: "https://youtube.com/@wabtechs" },
  { name: "Spotify", url: "#" },
  { name: "Apple Podcasts", url: "#" },
  { name: "RSS Feed", url: "#" },
];

export default function PodcastPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Podcast"
          title="Podcast"
          highlight="Tech"
          description="Épisodes réguliers sur les tendances tech, tutoriels et interviews de développeurs."
        />

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {PLATFORMS.map((platform) => (
            <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer">
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors">
                <ExternalLink className="mr-1 h-3 w-3" />
                {platform.name}
              </Badge>
            </a>
          ))}
        </div>

        <div className="mt-12 space-y-4 max-w-4xl mx-auto">
          {EPISODES.map((ep) => (
            <Card key={ep.number} className="transition-all hover:shadow-lg group">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Play className="h-6 w-6 ml-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      Épisode {ep.number}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {ep.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {ep.date}
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-lg group-hover:text-primary transition-colors">
                    {ep.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{ep.description}</CardDescription>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {ep.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
