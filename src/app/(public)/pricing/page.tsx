import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Plans tarifaires de la plateforme Wabtechs.",
};

const ICONS = [Zap, Crown, Building2];

export default async function PricingPage() {
  const pricingPlans = await db.pricingPlan.findMany({ orderBy: { order: "asc" } });

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
          {pricingPlans.map((plan, i) => {
            const Icon = ICONS[i] ?? Zap;
            return (
              <Card
                key={plan.id}
                className={`relative transition-all hover:shadow-lg ${plan.featured ? "border-primary shadow-lg scale-[1.02]" : ""}`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Populaire</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {plan.price === "0" || plan.price === "Gratuit" ? "Gratuit" : `${plan.price}€`}
                    </span>
                    {plan.price !== "0" && plan.price !== "Gratuit" && (
                      <span className="text-sm text-muted-foreground">/mois</span>
                    )}
                  </div>
                  {plan.save && (
                    <CardDescription className="mt-2 text-green-500">{plan.save}</CardDescription>
                  )}
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
                  <Button asChild variant={plan.featured ? "default" : "outline"} className="mt-6 w-full">
                    <Link href={plan.price === "0" || plan.price === "Gratuit" ? "/register" : "/support"}>
                      {plan.price === "0" || plan.price === "Gratuit" ? "Commencer gratuitement" : "Choisir ce plan"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
