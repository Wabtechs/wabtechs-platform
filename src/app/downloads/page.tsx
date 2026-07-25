import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Download, FileCode, Terminal, Palette, BookOpen, FileJson } from "lucide-react";

export const metadata: Metadata = {
  title: "Téléchargements",
  description: "Ressources et outils téléchargeables pour développeurs.",
};

const CATEGORIES = [
  {
    icon: Palette,
    title: "Thèmes",
    items: [
      {
        name: "WabTechs VSCode Theme",
        description: "Thème VSCode optimisé pour TypeScript, React et Tailwind CSS. Contraste élevé, couleurs soigneusement choisies.",
        size: "2.1 MB",
        version: "1.4.0",
        updated: "20 Juillet 2026",
        downloads: 1240,
        link: "#",
      },
      {
        name: "WabTechs iTerm Theme",
        description: "Thème pour iTerm2 compatible avec les terminals modernes.",
        size: "4 KB",
        version: "1.2.0",
        updated: "10 Juin 2026",
        downloads: 380,
        link: "#",
      },
    ],
  },
  {
    icon: Terminal,
    title: "Configurations",
    items: [
      {
        name: "Terminal Config Pack",
        description: "Configuration complète pour terminal — oh-my-zsh, aliases, prompt personnalisé, Git integration.",
        size: "15 KB",
        version: "2.0.1",
        updated: "5 Juillet 2026",
        downloads: 890,
        link: "#",
      },
      {
        name: "ESLint Config",
        description: "Configuration ESLint partageable pour projets Next.js + TypeScript strict.",
        size: "2 KB",
        version: "3.1.0",
        updated: "15 Juillet 2026",
        downloads: 2100,
        link: "#",
      },
      {
        name: "Prettier Config",
        description: "Configuration Prettier avec plugin Tailwind CSS pour un code toujours formaté.",
        size: "1 KB",
        version: "1.0.3",
        updated: "1 Août 2026",
        downloads: 1560,
        link: "#",
      },
    ],
  },
  {
    icon: FileCode,
    title: "Templates",
    items: [
      {
        name: "Next.js Starter Template",
        description: "Template de démarrage complet — Next.js 16, Prisma, Auth, Tailwind, shadcn/ui.",
        size: "45 KB",
        version: "1.0.0",
        updated: "25 Juillet 2026",
        downloads: 3200,
        link: "#",
      },
      {
        name: "API Route Handler Template",
        description: "Template pour API routes Next.js avec validation Zod, error handling et logging.",
        size: "8 KB",
        version: "1.1.0",
        updated: "10 Juillet 2026",
        downloads: 980,
        link: "#",
      },
    ],
  },
  {
    icon: BookOpen,
    title: "Guides PDF",
    items: [
      {
        name: "Cheatsheet TypeScript",
        description: "Référence rapide TypeScript — types, generics, utility types, patterns courants.",
        size: "1.2 MB",
        version: "2026.07",
        updated: "25 Juillet 2026",
        downloads: 4500,
        link: "#",
      },
      {
        name: "Git Commands Cheatsheet",
        description: "Commandes Git essentielles — branching, merging, rebasing, stash, cherry-pick.",
        size: "800 KB",
        version: "2026.07",
        updated: "25 Juillet 2026",
        downloads: 3800,
        link: "#",
      },
      {
        name: "Tailwind CSS v4 Cheatsheet",
        description: "Nouvelles fonctionnalités de Tailwind v4 et guide de migration depuis v3.",
        size: "1.5 MB",
        version: "2026.07",
        updated: "20 Juillet 2026",
        downloads: 2900,
        link: "#",
      },
    ],
  },
  {
    icon: FileJson,
    title: "Données & Configs",
    items: [
      {
        name: "Prisma Schema Starter",
        description: "Schéma Prisma optimisé avec User, Post, Comment, Tag et toutes les relations.",
        size: "5 KB",
        version: "1.3.0",
        updated: "15 Juillet 2026",
        downloads: 1800,
        link: "#",
      },
      {
        name: "Docker Compose Dev",
        description: "Docker Compose pour développement local — PostgreSQL, Redis, MinIO.",
        size: "3 KB",
        version: "1.0.2",
        updated: "1 Août 2026",
        downloads: 650,
        link: "#",
      },
    ],
  },
];

export default function DownloadsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Téléchargements"
          title="Téléchargements"
          highlight="gratuits"
          description="Outils, templates, configurations et cheatsheets pour booster votre productivité."
        />

        <div className="mt-16 space-y-16">
          {CATEGORIES.map((category) => (
            <section key={category.title}>
              <div className="flex items-center gap-3 mb-6">
                <category.icon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold tracking-tight">{category.title}</h2>
                <Badge variant="outline">{category.items.length}</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {category.items.map((item) => (
                  <Card key={item.name} className="transition-all hover:shadow-lg group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base group-hover:text-primary transition-colors">
                            {item.name}
                          </CardTitle>
                          <CardDescription className="mt-1">{item.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">{item.version}</Badge>
                          <span>{item.size}</span>
                          <span>{item.downloads.toLocaleString()} téléch.</span>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <a href={item.link}>
                            <Download className="mr-1 h-3.5 w-3.5" />
                            Télécharger
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
