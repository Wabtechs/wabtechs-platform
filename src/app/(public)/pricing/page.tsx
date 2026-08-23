import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Check, Zap, Crown, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Plans tarifaires de la plateforme WabTechs.",
};

const PLANS = [
  {
    name: "Gratuit",
    icon: Zap,
    price: "0",
    period: "pour toujours",
    description: "Tout ce dont vous avez besoin pour démarrer.",
    features: [
      "Accès à tous les articles",
      "Documentation complète",
      "Projets open source",
      "Snippets de code",
      "Newsletter hebdomadaire",
      "1 compte utilisateur",
    ],
    cta: "Commencer gratuitement",
    ctaHref: "/register",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    icon: Crown,
    price: "9",
    period: "par mois",
    description: "Pour les développeurs sérieux qui veulent aller plus loin.",
    features: [
      "Tout du plan Gratuit",
      "Tutoriels avancés exclusifs",
      "Podcast sans publicité",
      "Snippets prioritaires",
      "Support prioritaire",
      "Accès bêta aux nouvelles features",
      "Badges et réputation",
    ],
    cta: "Passer en Pro",
    ctaHref: "/register",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Équipe",
    icon: Building2,
    price: "29",
    period: "par mois",
    description: "Pour les équipes et les entreprises.",
    features: [
      "Tout du plan Pro",
      "Jusqu'à 10 membres",
      "Dashboard analytics",
      "Contenu personnalisé",
      "Support dédié",
      "Facturation annuelle",
      "SLA garanti",
    ],
    cta: "Contacter le support",
    ctaHref: "/support",
    variant: "outline" as const,
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Tarifs"
          title="Des tarifs"
          highlight="simples"
          description="Commencez gratuitement, évoluez quand vous êtes prêt. Pas de surprises."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative transition-all hover:shadow-lg ${plan.popular ? "border-primary shadow-lg scale-[1.02]" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Populaire</Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2">
                  <plan.icon className="h-5 w-5 text-primary" />
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price === "0" ? "Gratuit" : `$${plan.price}`}</span>
                  {plan.price !== "0" && (
                    <span className="text-sm text-muted-foreground">/{plan.period}</span>
                  )}
                  {plan.price === "0" && (
                    <span className="text-sm text-muted-foreground"> · {plan.period}</span>
                  )}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant={plan.variant} className="mt-6 w-full">
                  <Link href={plan.ctaHref}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-muted-foreground">
            Tous les plans incluent l&apos;accès à la communauté et les mises à jour gratuites.
          </p>
          <p className="mt-2 text-muted-foreground text-sm">
            Des questions sur les tarifs ?{" "}
            <Button asChild variant="link" className="p-0">
              <Link href="/support">Contactez-nous</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
