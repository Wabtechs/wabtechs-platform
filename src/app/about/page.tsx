import type { Metadata } from "next";
import { Code2, GraduationCap, Heart, Lightbulb, Target, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez WabTechs — la plateforme de Emmanuel Mulonda Johannes pour le développement web et les technologies modernes.",
};

const VALUES = [
  { icon: Code2, title: "Excellence technique", description: "Code de qualité, bonnes pratiques et technologies de pointe." },
  { icon: Users, title: "Communauté", description: "Partage de connaissances et entraide entre développeurs." },
  { icon: Lightbulb, title: "Innovation", description: "Exploration constante des nouvelles technologies et approches." },
  { icon: Heart, title: "Passion", description: "L'amour du développement est au cœur de tout ce que je fais." },
  { icon: GraduationCap, title: "Apprentissage", description: "Apprendre et enseigner pour faire grandir la communauté." },
  { icon: Target, title: "Impact", description: "Créer des outils et contenus qui font une différence réelle." },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">À propos</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Construire l&apos;avenir du <span className="gradient-text">dev francophone</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Développeur passionné, je crée cette plateforme pour partager mes connaissances,
            mes projets et contribuer à la communauté des développeurs.
          </p>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value) => (
            <Card key={value.title} className="border-0 bg-muted/30">
              <CardHeader>
                <value.icon className="h-8 w-8 text-primary" />
                <CardTitle className="mt-2">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
