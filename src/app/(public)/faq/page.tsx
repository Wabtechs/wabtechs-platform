"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Search, HelpCircle, MessageSquare } from "lucide-react";

const FAQ_CATEGORIES = [
  {
    name: "Général",
    items: [
      { q: "Qu'est-ce que WabTechs ?", a: "WabTechs est une plateforme technologique complète regroupant blog, documentation, podcasts, vidéos, snippets et projets open source. Elle est dédiée aux développeurs francophones souhaitant apprendre et partager leurs connaissances." },
      { q: "Qui derrière WabTechs ?", a: "WabTechs est créé et maintenu par Emmanuel Mulonda Johannes, développeur full-stack passionné par les technologies web modernes et l'enseignement." },
      { q: "La plateforme est-elle gratuite ?", a: "Oui, l'ensemble des contenus (articles, tutoriels, vidéos, snippets) est gratuitement accessible. Certaines fonctionnalités avancées pourraient être ajoutées à l'avenir." },
      { q: "Dans quelle langue sont les contenus ?", a: "Les contenus sont principalement en français, avec certains articles techniques en anglais pour rester fidèle à la documentation officielle des outils." },
    ],
  },
  {
    name: "Compte & Authentification",
    items: [
      { q: "Comment créer un compte ?", a: "Rendez-vous sur la page d'inscription, remplissez votre nom, email et mot de passe. Un email de confirmation vous sera envoyé." },
      { q: "J'ai oublié mon mot de passe, que faire ?", a: "Utilisez la fonctionnalité « Mot de passe oublié » sur la page de connexion. Un email de réinitialisation vous sera envoyé." },
      { q: "Comment supprimer mon compte ?", a: "Contactez-nous à privacy@wabtechs.com avec votre demande. Vos données seront supprimées dans un délai de 30 jours conformément à notre politique de confidentialité." },
    ],
  },
  {
    name: "Contenu & Contributions",
    items: [
      { q: "Comment contribuer aux projets open source ?", a: "Rendez-vous sur GitHub, fork le projet souhaité, créez une branche pour votre feature ou fix, puis ouvrez une Pull Request. Toutes les contributions sont les bienvenues !" },
      { q: "Comment proposer un article ou tutoriel ?", a: "Vous pouvez nous contacter via la page Contact ou ouvrir une issue sur GitHub avec votre proposition. Incluez le sujet, le public cible et un bref résumé." },
      { q: "Les snippets de code sont-ils libres de droits ?", a: "Oui, tous les snippets sont distribués sous licence MIT et peuvent être librement utilisés dans vos projets personnels et commerciaux." },
      { q: "Comment signaler une erreur dans un article ?", a: "Ouvrez une issue sur GitHub avec le lien de l'article et décrivez l'erreur. Vous pouvez aussi commenter directement sous l'article si vous êtes connecté." },
    ],
  },
  {
    name: "Technique",
    items: [
      { q: "Quel stack technique est utilisé ?", a: "La plateforme utilise Next.js 16, React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui, Prisma ORM, PostgreSQL (Neon) et est déployée sur Vercel." },
      { q: "La plateforme supporte-t-elle le dark mode ?", a: "Oui, un mode sombre est disponible via le bouton de bascule dans la barre de navigation. Il utilise la préférence système par défaut." },
      { q: "Puis-je utiliser le contenu dans mes propres projets ?", a: "Les snippets et le code open source sont sous MIT. Les articles et tutoriels sont sous licence Creative Commons BY-NC. Mentionnez la source WabTechs." },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredCategories = FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((cat) => cat.items.length > 0);

  const totalQuestions = FAQ_CATEGORIES.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            <HelpCircle className="mr-1 h-3 w-3" />
            FAQ
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Questions <span className="gradient-text">fréquentes</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            {totalQuestions} questions pour vous aider à démarrer.
          </p>
        </div>

        <div className="mt-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-background px-10 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="mt-10 space-y-10">
          {filteredCategories.map((category) => (
            <div key={category.name}>
              <h2 className="mb-4 text-lg font-semibold">{category.name}</h2>
              <div className="space-y-2">
                {category.items.map((faq) => {
                  const key = `${category.name}-${faq.q}`;
                  const isOpen = openIndex === key;
                  return (
                    <Card key={key} className="overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : key)}
                        className="w-full text-left"
                      >
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                          <CardTitle className="text-sm font-medium pr-4">
                            {faq.q}
                          </CardTitle>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </CardHeader>
                      </button>
                      {isOpen && (
                        <CardContent className="pt-0 pb-4">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {faq.a}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            <p>Aucune question trouvée pour « {search} ».</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Card className="mx-auto max-w-md bg-muted/30">
            <CardContent className="pt-6">
              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-3 text-lg font-bold">Pas de réponse ?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Contactez-nous directement et nous vous répondrons dans les plus brefs délais.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
