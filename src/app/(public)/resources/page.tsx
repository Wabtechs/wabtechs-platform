import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { ExternalLink, FileCode, BookOpen, Wrench, Video, Headphones, Palette } from "lucide-react";

export const metadata: Metadata = {
  title: "Ressources",
  description: "Outils et références pour développeurs.",
};

const CATEGORIES = [
  {
    icon: FileCode,
    title: "Références langages",
    color: "text-blue-500",
    items: [
      { name: "TypeScript Handbook", description: "Documentation officielle TypeScript", url: "https://www.typescriptlang.org/docs/", language: "TypeScript" },
      { name: "MDN Web Docs", description: "Référence complète du web (HTML, CSS, JS)", url: "https://developer.mozilla.org/", language: "Web" },
      { name: "React Documentation", description: "Documentation officielle de React", url: "https://react.dev/", language: "React" },
      { name: "Next.js Docs", description: "Documentation officielle de Next.js", url: "https://nextjs.org/docs", language: "Next.js" },
    ],
  },
  {
    icon: Wrench,
    title: "Outils de développement",
    color: "text-green-500",
    items: [
      { name: "VS Code", description: "Éditeur de code source par Microsoft", url: "https://code.visualstudio.com/", language: "Éditeur" },
      { name: "GitHub Copilot", description: "Assistant IA de codage", url: "https://github.com/features/copilot", language: "IA" },
      { name: "Postman", description: "Plateforme d'API development", url: "https://www.postman.com/", language: "API" },
      { name: "Vercel", description: "Plateforme de déploiement Next.js", url: "https://vercel.com/", language: "Deploy" },
      { name: "Neon", description: "PostgreSQL serverless managed", url: "https://neon.tech/", language: "Database" },
    ],
  },
  {
    icon: Palette,
    title: "Design & UI",
    color: "text-purple-500",
    items: [
      { name: "Tailwind CSS", description: "Framework CSS utility-first", url: "https://tailwindcss.com/", language: "CSS" },
      { name: "shadcn/ui", description: "Composants UI réutilisables", url: "https://ui.shadcn.com/", language: "React" },
      { name: "Figma", description: "Outil de design collaboratif", url: "https://www.figma.com/", language: "Design" },
      { name: "Lucide Icons", description: "Icônes open source pour React", url: "https://lucide.dev/", language: "Icons" },
    ],
  },
  {
    icon: BookOpen,
    title: "Livres & Lectures",
    color: "text-yellow-500",
    items: [
      { name: "Clean Code", description: "Robert C. Martin — Bonnes pratiques de code", url: "#", language: "Livre" },
      { name: "The Pragmatic Programmer", description: "Hunt & Thomas — Devenir un meilleur développeur", url: "#", language: "Livre" },
      { name: "You Don't Know JS", description: "Kyle Simpson — Approfondir JavaScript", url: "#", language: "Livre" },
      { name: "Refactoring", description: "Martin Fowler — Améliorer le design du code", url: "#", language: "Livre" },
    ],
  },
  {
    icon: Video,
    title: "Chaînes YouTube",
    color: "text-red-500",
    items: [
      { name: "Fireship", description: "Tutoriels rapides et concepts dev", url: "https://www.youtube.com/@Fireship", language: "YouTube" },
      { name: "Theo", description: "Opinions et tutorials web dev", url: "https://www.youtube.com/@t3dotgg", language: "YouTube" },
      { name: "ByteGrad", description: "Next.js et React en profondeur", url: "https://www.youtube.com/@ByteGrad", language: "YouTube" },
      { name: "Web Dev Simplified", description: "Concepts web expliqués simplement", url: "https://www.youtube.com/@WebDevSimplified", language: "YouTube" },
    ],
  },
  {
    icon: Headphones,
    title: "Podcasts tech",
    color: "text-orange-500",
    items: [
      { name: "Syntax FM", description: "Podcast web dev par Wes Bos et Scott Tolinski", url: "https://syntax.fm/", language: "Podcast" },
      { name: "JS Party", description: "Podcast JavaScript par Changelog", url: "https://changelog.com/jsparty", language: "Podcast" },
      { name: "ShopTalk Show", description: "Podcast sur le web design et le développement", url: "https://shoptalkshow.com/", language: "Podcast" },
    ],
  },
];

export default function ResourcesPage() {
  const totalResources = CATEGORIES.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Ressources"
          title="Ressources"
          highlight="utiles"
          description={`${totalResources} ressources soigneusement sélectionnées pour les développeurs web modernes.`}
        />

        <div className="mt-16 space-y-16">
          {CATEGORIES.map((category) => (
            <section key={category.title}>
              <div className="flex items-center gap-3 mb-6">
                <category.icon className={`h-5 w-5 ${category.color}`} />
                <h2 className="text-xl font-bold tracking-tight">{category.title}</h2>
                <Badge variant="outline">{category.items.length}</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base group-hover:text-primary transition-colors">
                              {item.name}
                            </CardTitle>
                            <CardDescription className="mt-1">{item.description}</CardDescription>
                          </div>
                          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardHeader>
                    </Card>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Une ressource à recommander ?{" "}
            <Button asChild variant="link" className="p-0">
              <a href="https://github.com/Wabtechs/wabtechs-platform/issues/new" target="_blank" rel="noopener noreferrer">
                Ouvrez une issue sur GitHub
              </a>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
