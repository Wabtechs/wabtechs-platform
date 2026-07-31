import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import {
  MessageSquare,
  Users,
  BookOpen,
  Code2,
  Heart,
  Shield,
  Github,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Communauté",
  description: "Rejoignez la communauté Wabtechs — échangez, partagez et grandissez ensemble.",
};

const CHANNELS = [
  {
    icon: MessageSquare,
    title: "Forum de discussion",
    description: "Posez vos questions, partagez vos astuces et aidez les autres développeurs.",
    href: "/community",
    badge: "Bientôt disponible",
  },
  {
    icon: Github,
    title: "GitHub",
    description: "Suivez le développement, ouvrez des issues et contribuez aux projets open source.",
    href: "https://github.com/wabtechs",
    external: true,
  },
  {
    icon: Code2,
    title: "Live Coding",
    description: "Sessions de développement en direct — posez vos questions en temps réel.",
    href: "/events",
  },
];

const GUIDELINES = [
  { icon: Heart, title: "Respect et bienveillance", description: "Traitez chacun avec respect. Les questions « bêtes » n'existent pas — nous avons tous commencé quelque part." },
  { icon: Shield, title: "Constructif", description: "Donnez du feedback constructif. Critiquez les idées, pas les personnes." },
  { icon: BookOpen, title: "Partagez vos connaissances", description: "Un tutoriel, un snippet, un article ? Partagez-le avec la communauté." },
  { icon: Users, title: "Entraide", description: "Aidez les membres en difficulté. L'entraide est le cœur de cette communauté." },
];

const ROLES = [
  { title: "Membre", description: "Accès au forum, commentaires et newsletter.", color: "bg-muted" },
  { title: "Contributeur", description: "Contributions reconnues aux projets open source.", color: "bg-blue-500" },
  { title: "Auteur", description: "Publie des articles, tutoriels ou snippets.", color: "bg-purple-500" },
  { title: "Modérateur", description: "Aide à modérer les discussions et maintient la qualité.", color: "bg-green-500" },
  { title: "Admin", description: "Accès complet à la gestion de la plateforme.", color: "bg-red-500" },
];

export default function CommunityPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Communauté"
          title="Communauté"
          highlight="Wabtechs"
          description="Rejoignez une communauté de développeurs passionnés. Échangez, apprenez et construisez ensemble."
        />

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Où nous trouver</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {CHANNELS.map((channel) => (
              <Link key={channel.title} href={channel.href} target={channel.external ? "_blank" : undefined} rel={channel.external ? "noopener noreferrer" : undefined}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 group">
                  <CardHeader>
                    <channel.icon className="h-8 w-8 text-primary" />
                    <div className="flex items-center gap-2">
                      <CardTitle className="mt-2 text-base group-hover:text-primary transition-colors">
                        {channel.title}
                      </CardTitle>
                      {channel.external && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
                    </div>
                    <CardDescription>{channel.description}</CardDescription>
                    {channel.badge && (
                      <Badge variant="secondary" className="w-fit mt-2">{channel.badge}</Badge>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight">Charte communautaire</h2>
            <p className="mt-4 text-muted-foreground">
              Ces principes guident nos interactions et garantissent un environnement sain pour tous.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {GUIDELINES.map((g) => (
              <Card key={g.title}>
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <g.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{g.title}</CardTitle>
                    <CardDescription className="mt-1">{g.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight">Rôles de la communauté</h2>
            <p className="mt-4 text-muted-foreground">
              Des rôles qui évoluent avec votre engagement et vos contributions.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {ROLES.map((role) => (
              <div key={role.title} className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
                <span className={`h-3 w-3 rounded-full ${role.color}`} />
                <div>
                  <span className="text-sm font-medium">{role.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">— {role.description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 text-center">
          <Card className="mx-auto max-w-2xl bg-muted/30">
            <CardContent className="pt-6">
              <Users className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-bold">Prêt à rejoindre ?</h3>
              <p className="mt-2 text-muted-foreground">
                Commencez par créer un compte et explorez les différentes sections.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/register">Créer un compte</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://github.com/wabtechs" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
