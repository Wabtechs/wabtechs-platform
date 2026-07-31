import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_CONFIG } from "@/lib/utils";
import { db } from "@/lib/prisma";
import { Github, Globe, ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await db.project.findUnique({ where: { slug }, select: { title: true, description: true, metaTitle: true, metaDescription: true } });
  if (!project) return { title: "Projet introuvable" };
  return {
    title: project.metaTitle ?? project.title,
    description: project.metaDescription ?? project.description,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await db.project.findUnique({ where: { slug } });
  if (!project) notFound();

  return (
    <div className="pt-24 pb-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: project.title,
          description: project.description,
          url: project.demoUrl ?? `${SITE_CONFIG.url}/projects/${project.slug}`,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Projets", href: "/projects" }, { label: project.title }]} className="mb-6" />

        <PageHeader
          badge="Projet"
          title={project.title}
          highlight=""
          description={project.description}
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            {project.coverImage && (
              <div className="relative mb-8 aspect-video overflow-hidden rounded-xl border border-white/10">
                <Image src={project.coverImage} alt={project.title} fill className="object-cover" />
              </div>
            )}
            {project.longDescription && (
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{project.longDescription}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Technologies</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.githubUrl && (
                    <Button asChild variant="outline" size="sm">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        Code source
                      </a>
                    </Button>
                  )}
                  {project.demoUrl && (
                    <Button asChild variant="outline" size="sm">
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Démo live
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button asChild variant="ghost" className="w-full">
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux projets
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
