export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import {
  Code2,
  GraduationCap,
  Heart,
  Lightbulb,
  Target,
  Users,
  Github,
  BookOpen,
  Zap,
  Globe,
} from "lucide-react";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez Wabtechs — la plateforme de Emmanuel Mulonda Johannes pour le développement web.",
};

const VALUES = [
  { icon: Code2, title: "Excellence technique", description: "Code de qualité, bonnes pratiques et technologies de pointe. Chaque fonctionnalité est construite avec soin." },
  { icon: Users, title: "Communauté", description: "Partage de connaissances et entraide entre développeurs. Nous grandissons ensemble." },
  { icon: Lightbulb, title: "Innovation", description: "Exploration constante des nouvelles technologies et approches pour rester à la pointe." },
  { icon: Heart, title: "Passion", description: "L'amour du développement est au cœur de tout ce que nous faisons." },
  { icon: GraduationCap, title: "Apprentissage", description: "Apprendre et enseigner pour faire grandir la communauté francophone." },
  { icon: Target, title: "Impact", description: "Créer des outils et contenus qui font une différence réelle dans le quotidien des développeurs." },
];

const TECH_STACK = [
  { name: "Next.js 16", role: "Framework" },
  { name: "React 19", role: "UI Library" },
  { name: "TypeScript", role: "Langage" },
  { name: "Tailwind CSS v4", role: "Styling" },
  { name: "shadcn/ui", role: "Composants" },
  { name: "Prisma", role: "ORM" },
  { name: "PostgreSQL", role: "Base de données" },
  { name: "Vercel", role: "Hébergement" },
];

export default async function AboutPage() {
  const [postCount, projectCount, podcastCount, snippetCount] = await Promise.all([
    db.post.count({ where: { published: true } }),
    db.project.count(),
    db.podcast.count({ where: { published: true } }),
    db.snippet.count({ where: { published: true } }),
  ]);
  const stats = [
    { label: "Articles publiés", value: `${postCount}+` },
    { label: "Projets open source", value: `${projectCount}` },
    { label: "Épisodes podcast", value: `${podcastCount}` },
    { label: "Snippets de code", value: `${snippetCount}+` },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="À propos"
          title="Construire l'avenir du"
          highlight="dev francophone"
          description="Développeur passionné, je crée cette plateforme pour partager mes connaissances, mes projets et contribuer à la communauté des développeurs."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Notre mission</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Rendre les technologies modernes accessibles aux développeurs francophones à travers
              du contenu de qualité, des outils open source et une communauté active.
            </p>
          </div>
        </section>

        <section className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Valeurs</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value) => (
              <Card key={value.title} className="border-0 bg-muted/30">
                <CardHeader>
                  <value.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="mt-2">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Stack technique</h2>
            <p className="mt-4 text-muted-foreground">
              La plateforme est construite avec les technologies les plus modernes.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {TECH_STACK.map((tech) => (
              <div key={tech.name} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-4 py-2.5">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{tech.name}</span>
                <span className="text-xs text-muted-foreground">· {tech.role}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 text-center">
          <Card className="mx-auto max-w-2xl bg-muted/30">
            <CardContent className="pt-6">
              <Globe className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-bold">Restez connecté</h3>
              <p className="mt-2 text-muted-foreground">
                Suivez-nous sur GitHub, YouTube et les réseaux sociaux pour ne rien manquer.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/blog">Lire le blog</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://github.com/wabtechs" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/docs">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Documentation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
