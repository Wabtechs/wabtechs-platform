import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { DownloadButton } from "@/components/templates/download-button";
import { Download, Github, Star, ExternalLink, Check, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = await db.template.findUnique({ where: { slug } });
  if (!template) return { title: "Template introuvable" };
  return {
    title: template.name,
    description: template.description,
  };
}

const FEATURES = [
  "Code propre et commenté",
  "Responsive et accessible",
  "SEO de base inclus",
  "Configuré pour le déploiement",
  "Documentation de démarrage",
  "Mises à jour incluses",
];

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = await db.template.findUnique({ where: { slug } });
  if (!template) notFound();

  const free = Number(template.price) === 0;

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/templates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux templates
          </Link>
        </Button>

        <PageHeader
          badge={`v${template.version}`}
          title={template.name}
          highlight=""
          description={template.description}
        />

        <div className="text-muted-foreground mx-auto mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
          <Badge className="capitalize">{template.category}</Badge>
          {template.stack && <span className="truncate">{template.stack}</span>}
          <span className="text-white/10">·</span>
          <span className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            {template.downloads} téléchargements
          </span>
          {template.featured && (
            <Badge className="bg-primary/15 text-primary">
              <Star className="mr-1 h-3 w-3" /> Populaire
            </Badge>
          )}
        </div>

        <div className="border-border mt-10 overflow-hidden rounded-2xl border bg-gradient-to-br from-[#1F1F1F] to-[#2a2a2a]">
          {template.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={template.image} alt={template.name} className="w-full object-cover" />
          ) : (
            <div className="flex h-72 items-center justify-center">
              <Download className="text-primary/40 h-16 w-16" />
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <DownloadButton
            slug={template.slug}
            downloadUrl={template.downloadUrl}
            repoUrl={template.repoUrl}
            free={free}
            price={Number(template.price)}
          />
          {template.demoUrl && (
            <Button asChild variant="outline" size="lg">
              <Link href={template.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Voir la démo
              </Link>
            </Button>
          )}
          {template.repoUrl && (
            <Button asChild variant="outline" size="lg">
              <Link href={template.repoUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Code source
              </Link>
            </Button>
          )}
        </div>

        {template.longDescription && (
          <div className="prose prose-gray dark:prose-invert mx-auto mt-12 max-w-none">
            {template.longDescription.split(/\n\n+/).map((block, i) =>
              block.startsWith("# ") ? (
                <h2 key={i} className="text-2xl font-bold">
                  {block.slice(2)}
                </h2>
              ) : (
                <p key={i} className="text-muted-foreground mb-4 text-[15px] leading-relaxed">
                  {block}
                </p>
              ),
            )}
          </div>
        )}

        <Card className="dark:border-border dark:bg-card mt-12 border-gray-200/80 bg-white">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold tracking-tight">Ce qui est inclus</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="dark:border-border mt-8 border-t border-gray-100 pt-8 text-center">
              <p className="text-3xl font-bold">
                {free ? "Gratuit" : `${Number(template.price)}€`}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {free
                  ? "Une seule licence par projet. Attribution appréciée."
                  : "Paiement unique, licence commerciale incluse. Paiement bientôt disponible."}
              </p>
              <div className="mt-6 flex justify-center">
                <DownloadButton
                  slug={template.slug}
                  downloadUrl={template.downloadUrl}
                  repoUrl={template.repoUrl}
                  free={free}
                  price={Number(template.price)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
