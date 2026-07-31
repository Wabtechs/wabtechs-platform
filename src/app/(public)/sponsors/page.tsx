import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Check, Heart, Coffee, Rocket, Building2, Star, Github } from "lucide-react";

export const metadata: Metadata = {
  title: "Sponsors",
  description: "Soutenez le développement de la plateforme Wabtechs via GitHub Sponsors.",
};

const TIERS = [
  {
    icon: Coffee,
    price: "$5",
    name: "Supporter",
    description: "Pour ceux qui veulent encourager le travail open source.",
    benefits: [
      "Badge Supporter sur GitHub",
      "Accès au Discord communautaire",
      "Mentions dans le README",
      "Newsletter privée",
    ],
    featured: false,
  },
  {
    icon: Heart,
    price: "$25",
    name: "Backer",
    description: "Le tier le plus populaire pour les développeurs.",
    benefits: [
      "Tout le tier Supporter",
      "Badge Backer personnalisé",
      "Vote sur les priorités de développement",
      "Accès anticipé aux tutoriels",
      "Session Q&A mensuelle",
    ],
    featured: true,
  },
  {
    icon: Rocket,
    price: "$100",
    name: "Partner",
    description: "Pour les professionnels et entreprises.",
    benefits: [
      "Tout le tier Backer",
      "Consultation technique mensuelle (30 min)",
      "Logo sur le site /sponsors",
      "Accès prioritaire au support",
      "Accès bêta aux nouvelles fonctionnalités",
    ],
    featured: false,
  },
  {
    icon: Building2,
    price: "$500",
    name: "Enterprise",
    description: "Pour les entreprises qui veulent s'impliquer durablement.",
    benefits: [
      "Tout le tier Partner",
      "Consultation technique bi-mensuelle (1h)",
      "Logo sur la page d'accueil",
      "Formation sur mesure",
      "Collaboration sur des projets open source",
      "Placement dans les communiqués",
    ],
    featured: false,
  },
];

export default function SponsorsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Sponsors"
          title="Soutenez"
          highlight="Wabtechs"
          description="Votre soutien finance l'hébergement, les outils et le temps dédié au développement de la plateforme et de nos projets open source."
        />

        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="bg-primary text-[#1e1e1e] hover:bg-[#9333ea]">
            <Link href="https://github.com/sponsors/wabtechs" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" />
              Devenir sponsor sur GitHub
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => (
            <Card
              key={tier.name}
              className={`relative flex flex-col transition-all hover:shadow-lg ${tier.featured ? "border-primary shadow-lg scale-[1.02]" : ""}`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="mr-1 h-3 w-3" /> Populaire
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2">
                  <tier.icon className="h-5 w-5 text-primary" />
                  <CardTitle>{tier.name}</CardTitle>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">/mois</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="flex-1 space-y-3">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant={tier.featured ? "default" : "outline"} className="mt-6 w-full">
                  <Link href={`https://github.com/sponsors/wabtechs/sponsorships?tier_id=select`} target="_blank" rel="noopener noreferrer">
                    Sponsoriser — {tier.price}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 rounded-2xl border border-white/10 bg-[#1F1F1F] p-8 text-center">
          <h2 className="text-2xl font-bold">Pourquoi sponsoriser ?</h2>
          <div className="mx-auto mt-6 grid max-w-4xl gap-6 text-left sm:grid-cols-3">
            {[
              {
                title: "Open source durable",
                text: "Chaque dollar finance des outils et contenus gratuits pour la communauté.",
              },
              {
                title: "Visibilité directe",
                text: "Votre logo ou votre profil est visible par tous les visiteurs du site.",
              },
              {
                title: "Impact réel",
                text: "Vous influencez directement la roadmap et les priorités de développement.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center text-muted-foreground">
          <p>
            Une question sur le sponsoring ?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contactez-nous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
