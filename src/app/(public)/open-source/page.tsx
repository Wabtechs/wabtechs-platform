import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Github, Star, GitFork, ExternalLink, Code2, Users, BookOpen, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Open Source",
  description: "Projets open source et contributions communautaires de Wabtechs.",
};

const PROJECTS = [
  {
    name: "wabtechs-platform",
    description: "La plateforme Wabtechs — blog, docs, podcast, vidéos et projets. Construite avec Next.js 16, React 19, Prisma et PostgreSQL.",
    language: "TypeScript",
    stars: 42,
    forks: 12,
    url: "https://github.com/Wabtechs/wabtechs-platform",
    topics: ["nextjs", "react", "prisma", "postgresql"],
  },
  {
    name: "react-hook-patterns",
    description: "Collection de patterns et hooks React réutilisables pour des projets de production.",
    language: "TypeScript",
    stars: 87,
    forks: 23,
    url: "https://github.com/wabtechs/react-hook-patterns",
    topics: ["react", "hooks", "patterns"],
  },
  {
    name: "prisma-utils",
    description: "Utilitaires et helpers pour Prisma ORM — migrations, seeders, et type safety avancé.",
    language: "TypeScript",
    stars: 156,
    forks: 34,
    url: "https://github.com/wabtechs/prisma-utils",
    topics: ["prisma", "database", "typescript"],
  },
  {
    name: "tailwind-presets",
    description: "Présets Tailwind CSS prêts à l'emploi pour des interfaces modernes et accessibles.",
    language: "CSS",
    stars: 203,
    forks: 45,
    url: "https://github.com/wabtechs/tailwind-presets",
    topics: ["tailwind", "css", "design-system"],
  },
  {
    name: "next-auth-starter",
    description: "Template de démarrage avec NextAuth.js v5, Prisma Adapter et credentials/OAuth providers.",
    language: "TypeScript",
    stars: 312,
    forks: 78,
    url: "https://github.com/wabtechs/next-auth-starter",
    topics: ["nextjs", "auth", "prisma"],
  },
  {
    name: "devtools-cli",
    description: "CLI pour automatiser les tâches de développement — scaffolding, migrations, déploiement.",
    language: "TypeScript",
    stars: 64,
    forks: 11,
    url: "https://github.com/wabtechs/devtools-cli",
    topics: ["cli", "devtools", "automation"],
  },
];

const CONTRIBUTING_STEPS = [
  { icon: Code2, title: "Fork & Clone", description: "Forkez le dépôt et clonez-le localement." },
  { icon: BookOpen, title: "Lisez la doc", description: "Consultez le README et les guidelines de contribution." },
  { icon: Users, title: "Créez une branche", description: "Créez une branche pour votre feature ou fix." },
  { icon: Heart, title: "Soumettez une PR", description: "Ouvrez une Pull Request avec une description claire." },
];

const LANGUAGES_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500",
  CSS: "bg-pink-500",
  JavaScript: "bg-yellow-500",
  Python: "bg-green-500",
};

export default function OpenSourcePage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Open Source"
          title="Projets"
          highlight="Open Source"
          description="Contributions communautaires, outils et projets réutilisables. Tout est open source sous licence MIT."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <Link key={project.name} href={project.url} target="_blank" rel="noopener noreferrer">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className={`h-2.5 w-2.5 rounded-full ${LANGUAGES_COLORS[project.language] ?? "bg-gray-500"}`} />
                      {project.language}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />
                      {project.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5" />
                      {project.forks}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <section className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Comment contribuer</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Toutes les contributions sont les bienvenues. Voici les étapes pour commencer.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CONTRIBUTING_STEPS.map((step, i) => (
              <Card key={step.title} className="relative text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="absolute top-3 left-3 text-xs font-bold text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <CardTitle className="mt-2 text-base">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-24 text-center">
          <Card className="mx-auto max-w-2xl bg-muted/30">
            <CardContent className="pt-6">
              <Github className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-bold">Rejoignez-nous sur GitHub</h3>
              <p className="mt-2 text-muted-foreground">
                Suivez les projets, ouvrez des issues et contribuez au futur de la plateforme.
              </p>
              <Button asChild className="mt-6">
                <a href="https://github.com/wabtechs" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Voir GitHub
                </a>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
