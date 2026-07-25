import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ExternalLink, Github, Star, GitFork, Globe, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Projets",
  description: "Projets open source et applications créées par WabTechs.",
};

const PROJECTS = [
  {
    title: "WabTechs Platform",
    description: "La plateforme officielle — blog, docs, podcasts, vidéos, snippets et projets open source. Construite avec Next.js 16, React 19, Prisma et PostgreSQL.",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    github: "https://github.com/Wabtechs/wabtechs-platform",
    demo: "https://wabtechs-platform.vercel.app",
    stars: 42,
    forks: 12,
    language: "TypeScript",
    featured: true,
  },
  {
    title: "react-hook-patterns",
    description: "Collection de patterns et hooks React réutilisables pour des projets de production. Includes useDebounce, useLocalStorage, useMediaQuery et plus.",
    tags: ["React", "Hooks", "TypeScript"],
    github: "https://github.com/wabtechs/react-hook-patterns",
    demo: null,
    stars: 87,
    forks: 23,
    language: "TypeScript",
    featured: false,
  },
  {
    title: "prisma-utils",
    description: "Utilitaires et helpers pour Prisma ORM — migrations avancées, seeders, type safety et optimisation des requêtes.",
    tags: ["Prisma", "Database", "TypeScript"],
    github: "https://github.com/wabtechs/prisma-utils",
    demo: null,
    stars: 156,
    forks: 34,
    language: "TypeScript",
    featured: false,
  },
  {
    title: "tailwind-presets",
    description: "Présets Tailwind CSS prêts à l'emploi pour des interfaces modernes et accessibles. Thème clair/sombre, palette oklch.",
    tags: ["Tailwind", "CSS", "Design System"],
    github: "https://github.com/wabtechs/tailwind-presets",
    demo: null,
    stars: 203,
    forks: 45,
    language: "CSS",
    featured: false,
  },
  {
    title: "next-auth-starter",
    description: "Template de démarrage avec NextAuth.js v5, Prisma Adapter et credentials/OAuth providers. Auth complète en 5 minutes.",
    tags: ["Next.js", "Auth", "Prisma"],
    github: "https://github.com/wabtechs/next-auth-starter",
    demo: null,
    stars: 312,
    forks: 78,
    language: "TypeScript",
    featured: false,
  },
  {
    title: "devtools-cli",
    description: "CLI pour automatiser les tâches de développement — scaffolding de pages, migrations, déploiement et code generation.",
    tags: ["CLI", "Node.js", "Automation"],
    github: "https://github.com/wabtechs/devtools-cli",
    demo: null,
    stars: 64,
    forks: 11,
    language: "TypeScript",
    featured: false,
  },
  {
    title: "api-handler-patterns",
    description: "Patterns et utilitaires pour les API routes Next.js — validation Zod, error handling, rate limiting et logging.",
    tags: ["Next.js", "API", "TypeScript"],
    github: "https://github.com/wabtechs/api-handler-patterns",
    demo: null,
    stars: 95,
    forks: 19,
    language: "TypeScript",
    featured: false,
  },
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500",
  CSS: "bg-pink-500",
  JavaScript: "bg-yellow-500",
};

export default function ProjectsPage() {
  const featured = PROJECTS.find((p) => p.featured);
  const others = PROJECTS.filter((p) => !p.featured);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Projets" }]} className="mb-6" />

        <PageHeader
          badge="Projets"
          title="Projets"
          highlight="Open Source"
          description={`${PROJECTS.length} projets open source — contributions, outils et templates pour la communauté.`}
        />

        {featured && (
          <section className="mt-16">
            <Badge variant="default" className="mb-4">Projet principal</Badge>
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="grid md:grid-cols-[1fr_auto] gap-6 p-6 md:p-8">
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {featured.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold">{featured.title}</h2>
                  <p className="mt-2 text-muted-foreground">{featured.description}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className={`h-2.5 w-2.5 rounded-full ${LANG_COLORS[featured.language] ?? "bg-gray-500"}`} />
                      {featured.language}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />
                      {featured.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5" />
                      {featured.forks}
                    </span>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild>
                      <a href={featured.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        Voir le code
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href={featured.demo} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Voir la démo
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        <section className="mt-16">
          <h2 className="text-xl font-bold tracking-tight mb-6">Autres projets</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((project) => (
              <Card key={project.title} className="flex flex-col transition-all hover:shadow-lg hover:border-primary/50 group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {project.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        {project.forks}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Github className="h-4 w-4" />
                      </a>
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-20 text-center">
          <Card className="mx-auto max-w-2xl bg-muted/30">
            <CardContent className="pt-6">
              <Github className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-bold">Plus de projets sur GitHub</h3>
              <p className="mt-2 text-muted-foreground">
                Tous les projets sont open source. N&apos;hésitez pas à contribuer !
              </p>
              <Button asChild className="mt-6" variant="outline">
                <a href="https://github.com/wabtechs" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Voir tous les projets
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
