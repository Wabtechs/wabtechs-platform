import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "FAQ", description: "Questions fréquentes sur WabTechs." };

const FAQS = [
  { q: "Qu'est-ce que WabTechs ?", a: "WabTechs est une plateforme technologique complète regroupant blog, documentation, podcasts, vidéos et projets open source." },
  { q: "Comment contribuer aux projets ?", a: "Rendez-vous sur GitHub, fork le projet, faites vos modifications et ouvrez une Pull Request." },
  { q: "Comment s'inscrire à la newsletter ?", a: "Rendez-vous sur la page Newsletter et entrez votre adresse email." },
  { q: "Les contenus sont-ils gratuits ?", a: "Oui, la majorité des contenus sont gratuits et open source." },
];

export default function FAQPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">FAQ</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Questions <span className="gradient-text">fréquentes</span></h1>
        </div>
        <div className="mt-16 space-y-4">
          {FAQS.map((faq) => (
            <Card key={faq.q}>
              <CardHeader><CardTitle className="text-base">{faq.q}</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground">{faq.a}</p></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
