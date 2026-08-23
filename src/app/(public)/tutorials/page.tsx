import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Clock, BookOpen, Code2, Database, Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "Tutoriels",
  description: "Tutoriels pas-à-pas pour maîtriser les technologies modernes.",
};

const TUTORIALS = [
  {
    title: "Débuter avec Next.js 16",
    description: "Créez votre première application avec Next.js 16 — App Router, Server Components, layouts imbriqués.",
    level: "Débutant" as const,
    duration: "45 min",
    icon: Rocket,
    steps: ["Installation et configuration", "Création des routes", "Server Components vs Client", "Layouts et metadata", "Déploiement sur Vercel"],
    technologies: ["Next.js", "React", "TypeScript"],
  },
  {
    title: "Prisma & PostgreSQL",
    description: "Maîtrisez Prisma ORM — schema design, migrations, relations, transactions et optimisation des queries.",
    level: "Intermédiaire" as const,
    duration: "1h30",
    icon: Database,
    steps: ["Installation de Prisma", "Définition du schema", "Migrations et seed", "CRUD et relations", "Transactions et performance"],
    technologies: ["Prisma", "PostgreSQL", "TypeScript"],
  },
  {
    title: "Déploiement CI/CD",
    description: "Pipeline automatique avec GitHub Actions — tests, lint, build et déploiement sur Vercel.",
    level: "Avancé" as const,
    duration: "1h",
    icon: Code2,
    steps: ["Setup GitHub Actions", "Tests automatisés", "Lint et type-check", "Build et optimisation", "Déploiement Vercel"],
    technologies: ["GitHub Actions", "Vercel", "Docker"],
  },
  {
    title: "Authentification NextAuth v5",
    description: "Implémentez une authentification complète — credentials, JWT, session management et middleware.",
    level: "Intermédiaire" as const,
    duration: "1h15",
    icon: BookOpen,
    steps: ["Configuration NextAuth", "Credentials Provider", "JWT et sessions", "Middleware de protection", "Inscription et login"],
    technologies: ["NextAuth", "Prisma", "bcrypt"],
  },
  {
    title: "React Hook Form + Zod",
    description: "Formulaires robustes avec validation côté client — schemas Zod, erreurs, champ dynamiques.",
    level: "Débutant" as const,
    duration: "40 min",
    icon: Code2,
    steps: ["Installation des dépendances", "Définition des schemas Zod", "Configuration du formulaire", "Gestion des erreurs", "Soumission et feedback"],
    technologies: ["React Hook Form", "Zod", "TypeScript"],
  },
  {
    title: "Tailwind CSS v4 en profondeur",
    description: "Nouvelles features de Tailwind v4 — CSS-first config, oklch colors, nouvelles utilities.",
    level: "Intermédiaire" as const,
    duration: "50 min",
    icon: BookOpen,
    steps: ["Migration depuis v3", "Configuration CSS-first", "Système de couleurs oklch", "Responsive et dark mode", "Composants réutilisables"],
    technologies: ["Tailwind CSS", "PostCSS"],
  },
];

const LEVEL_CONFIG = {
  Débutant: { color: "bg-green-500", badgeVariant: "default" as const },
  Intermédiaire: { color: "bg-yellow-500", badgeVariant: "secondary" as const },
  Avancé: { color: "bg-red-500", badgeVariant: "outline" as const },
};

export default function TutorialsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Tutoriels"
          title="Tutoriels"
          highlight="pas-à-pas"
          description="Apprenez à votre rythme avec des guides pratiques et des projets concrets."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {TUTORIALS.map((tutorial) => {
            const levelConfig = LEVEL_CONFIG[tutorial.level];
            return (
              <Card key={tutorial.title} className="transition-all hover:shadow-lg group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <tutorial.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base group-hover:text-primary transition-colors">
                          {tutorial.title}
                        </CardTitle>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant={levelConfig.badgeVariant} className="text-xs">
                            <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${levelConfig.color}`} />
                            {tutorial.level}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {tutorial.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-3">{tutorial.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {tutorial.steps.map((step, i) => (
                      <div key={step} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                          {i + 1}
                        </span>
                        {step}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tutorial.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
