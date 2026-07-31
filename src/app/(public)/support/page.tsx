import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import {
  MessageSquare,
  Mail,
  Bug,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Github,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Support",
  description: "Obtenez de l'aide et du support pour la plateforme Wabtechs.",
};

const SUPPORT_CHANNELS = [
  {
    icon: Bug,
    title: "Signaler un bug",
    description: "Trouvé un bug ? Ouvrez une issue sur GitHub avec les détails pour que nous puissions le corriger rapidement.",
    action: "Ouvrir une issue",
    href: "https://github.com/Wabtechs/wabtechs-platform/issues/new",
    external: true,
    variant: "default" as const,
  },
  {
    icon: Lightbulb,
    title: "Suggérer une feature",
    description: "Une idée pour améliorer la plateforme ? Partagez-la avec nous et votez pour les suggestions existantes.",
    action: "Suggestion",
    href: "https://github.com/Wabtechs/wabtechs-platform/issues/new",
    external: true,
    variant: "outline" as const,
  },
  {
    icon: Mail,
    title: "Contact direct",
    description: "Pour les questions urgentes ou les demandes spécifiques, envoyez-nous un email directement.",
    action: "Envoyer un email",
    href: "mailto:support@wabtechs.com",
    external: false,
    variant: "outline" as const,
  },
  {
    icon: MessageSquare,
    title: "Community Discord",
    description: "Rejoignez notre Discord pour poser vos questions et échanger avec les autres membres en temps réel.",
    action: "Rejoindre",
    href: "#",
    external: true,
    variant: "outline" as const,
  },
];

const FAQ_ITEMS = [
  {
    icon: HelpCircle,
    title: "Comment créer un compte ?",
    description: "Rendez-vous sur la page /register, remplissez le formulaire et confirmez votre email.",
  },
  {
    icon: HelpCircle,
    title: "Comment contribuer ?",
    description: "Fork le projet sur GitHub, créez une branche et ouvrez une Pull Request. Voir la page Open Source.",
  },
  {
    icon: HelpCircle,
    title: "Bug trouvé ?",
    description: "Ouvrez une issue GitHub avec le navigateur, les étapes pour reproduire et les captures d'écran.",
  },
  {
    icon: HelpCircle,
    title: "Demande de contenu ?",
    description: "Proposez un sujet via GitHub Issues ou contactez-nous par email avec votre idée d'article ou tutoriel.",
  },
];

export default function SupportPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Support"
          title="Besoin d'"
          highlight="aide ?"
          description="Nous sommes là pour vous aider. Choisissez le canal qui vous convient le mieux."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {SUPPORT_CHANNELS.map((channel) => (
            <Card key={channel.title} className="transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <channel.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">{channel.title}</CardTitle>
                  <CardDescription className="mt-1">{channel.description}</CardDescription>
                  <Button asChild variant={channel.variant} size="sm" className="mt-3">
                    <a href={channel.href} target={channel.external ? "_blank" : undefined} rel={channel.external ? "noopener noreferrer" : undefined}>
                      {channel.action}
                      {channel.external && <ExternalLink className="ml-1 h-3.5 w-3.5" />}
                    </a>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <section className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight">Questions fréquentes</h2>
            <p className="mt-4 text-muted-foreground">
              Consultez aussi notre FAQ complète pour des réponses détaillées.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
            {FAQ_ITEMS.map((item) => (
              <Card key={item.title}>
                <CardHeader className="flex flex-row items-start gap-3">
                  <item.icon className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
                  <div>
                    <CardTitle className="text-sm">{item.title}</CardTitle>
                    <CardDescription className="mt-1 text-xs">{item.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="link">
              <Link href="/faq">
                Voir toutes les FAQ
              </Link>
            </Button>
          </div>
        </section>

        <section className="mt-20 text-center">
          <Card className="mx-auto max-w-2xl bg-muted/30">
            <CardContent className="pt-6">
              <Github className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-bold">Réponse rapide garantie</h3>
              <p className="mt-2 text-muted-foreground">
                Nous nous efforçons de répondre à toutes les demandes dans les 24 heures.
                Les issues GitHub sont traitées en priorité.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
