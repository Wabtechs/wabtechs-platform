import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";

export const metadata: Metadata = {
  title: "Projets",
  description: "Projets open source et applications créées par WabTechs.",
};

const PROJECTS = [
  {
    title: "WabTechs Platform",
    description: "La plateforme officielle — blog, docs, podcasts, et plus encore.",
    tags: ["Next.js", "TypeScript", "Prisma"],
    github: "#",
    demo: "#",
  },
  {
    title: "Dev Toolkit",
    description: "Collection d'outils CLI pour accélérer le développement.",
    tags: ["Node.js", "CLI"],
    github: "#",
    demo: "#",
  },
  {
    title: "React Components",
    description: "Bibliothèque de composants React réutilisables.",
    tags: ["React", "TypeScript", "Storybook"],
    github: "#",
    demo: "#",
  },
];

export default function ProjectsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">Projets</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="gradient-text">Projets</span> Open Source
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Projets et contributions à l&apos;écosystème open source.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <Card key={project.title} className="flex flex-col transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <div className="mt-auto flex gap-2 p-6 pt-0">
                <a href={project.github} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                  <Github className="mr-1 h-4 w-4" /> Code
                </a>
                <a href={project.demo} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                  <ExternalLink className="mr-1 h-4 w-4" /> Démo
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
