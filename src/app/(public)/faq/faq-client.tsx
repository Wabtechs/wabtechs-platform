"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Search, HelpCircle, MessageSquare } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

export function FaqClient({ faqItems }: { faqItems: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const grouped = faqItems.reduce<Record<string, FaqItem[]>>((acc, item) => {
    const cat = item.category ?? "Général";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const filteredCategories = Object.entries(grouped).map(([name, items]) => ({
    name,
    items: items.filter(
      (item) =>
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((cat) => cat.items.length > 0);

  const totalQuestions = faqItems.length;

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
                  const key = `${category.name}-${faq.id}`;
                  const isOpen = openIndex === key;
                  return (
                    <Card key={key} className="overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : key)}
                        className="w-full text-left"
                      >
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                          <CardTitle className="text-sm font-medium pr-4">
                            {faq.question}
                          </CardTitle>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </CardHeader>
                      </button>
                      {isOpen && (
                        <CardContent className="pt-0 pb-4">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {faq.answer}
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
