import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Download, Star, Github, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Templates",
  description: "Téléchargez des templates de démarrage prêts à l'emploi pour vos projets.",
};

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const templates = await db.template.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Marketplace"
          title="Templates"
          highlight="prêts à l'emploi"
          description="Des points de départ solides pour vos projets : dashboard admin, landing page SaaS, blog MDX, portfolio développeur et plus encore. Téléchargez, personnalisez, ship."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.length === 0 ? (
            <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card md:col-span-2 lg:col-span-3">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Download className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
                <p className="text-[13px] text-gray-500">Les templates arrivent bientôt</p>
              </CardContent>
            </Card>
          ) : (
            templates.map((template) => (
              <Card
                key={template.id}
                className="group flex flex-col overflow-hidden border-gray-200/80 bg-white transition-all hover:shadow-lg dark:border-border dark:bg-card"
              >
                <div className="relative h-40 bg-gradient-to-br from-[#1F1F1F] to-[#2a2a2a]">
                  {template.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={template.image}
                      alt={template.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Download className="h-10 w-10 text-primary/60" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <Badge className="capitalize bg-black/40 backdrop-blur-sm">{template.category}</Badge>
                    {template.featured && (
                      <Badge className="bg-primary/80 backdrop-blur-sm">
                        <Star className="mr-1 h-3 w-3" /> Populaire
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-lg font-semibold tracking-tight">{template.name}</h3>
                    {Number(template.price) === 0 ? (
                      <span className="shrink-0 text-sm font-semibold text-emerald-500">Gratuit</span>
                    ) : (
                      <span className="shrink-0 text-sm font-semibold text-primary">{Number(template.price)}€</span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                    {template.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" />
                      {template.downloads} téléchargements
                    </span>
                    {template.stack && (
                      <span className="truncate">v{template.version} · {template.stack}</span>
                    )}
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-5 w-full">
                    <Link href={`/templates/${template.slug}`}>
                      Voir le template
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-20 rounded-2xl border border-white/10 bg-[#1F1F1F] p-8 text-center">
          <h2 className="text-2xl font-bold">Un template manquant ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Proposez un template ou commandez un point de départ sur mesure pour votre projet.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild size="lg" className="bg-primary text-white hover:bg-[#7323c4]">
              <Link href="https://github.com/wabtechs" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                Ouvrir une demande sur GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
