import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { getPublicProjects } from "@/lib/data-cache";
import { ExternalLink, Github, Star, GitFork, Globe, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Projets",
  description: "Projets open source et applications créées par Wabtechs.",
};

export const dynamic = "force-dynamic";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500",
  CSS: "bg-pink-500",
  JavaScript: "bg-yellow-500",
};

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  const featured = projects.find((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Projets" }]} className="mb-6" />

        <PageHeader
          badge="Projets"
          title="Projets"
          highlight="Open Source"
          description={`${projects.length} projets open source — contributions, outils et templates pour la communauté.`}
        />

        {featured && (
          <section className="mt-16">
            <Badge variant="default" className="mb-4">
              Projet principal
            </Badge>
            <Card className="border-primary/20 from-primary/5 overflow-hidden bg-gradient-to-br to-transparent">
              <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:p-8">
                <div>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {featured.techStack.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold">{featured.title}</h2>
                  <p className="text-muted-foreground mt-2">{featured.description}</p>
                  <div className="text-muted-foreground mt-4 flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${LANG_COLORS[featured.language] ?? "bg-gray-500"}`}
                      />
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
                    {featured.githubUrl && (
                      <Button asChild>
                        <a href={featured.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          Voir le code
                        </a>
                      </Button>
                    )}
                    {featured.demoUrl && (
                      <Button asChild variant="outline">
                        <a href={featured.demoUrl} target="_blank" rel="noopener noreferrer">
                          <Globe className="mr-2 h-4 w-4" />
                          Voir la démo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold tracking-tight">Autres projets</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((project) => (
              <Card
                key={project.title}
                className="hover:border-primary/50 group flex flex-col transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary text-base transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground flex items-center gap-3 text-xs">
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
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
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
          <Card className="bg-muted/30 mx-auto max-w-2xl">
            <CardContent className="pt-6">
              <Github className="text-muted-foreground mx-auto h-10 w-10" />
              <h3 className="mt-4 text-xl font-bold">Plus de projets sur GitHub</h3>
              <p className="text-muted-foreground mt-2">
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
