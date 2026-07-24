import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2 } from "lucide-react";

export const metadata: Metadata = { title: "Snippets" };

const SNIPPETS = [
  { title: "Debounce Hook", language: "TypeScript", description: "Hook React pour debounce" },
  { title: "Date Formatter", language: "TypeScript", description: "Formatage de dates en français" },
  { title: "API Handler", language: "TypeScript", description: "Pattern API route Next.js" },
];

export default function SnippetsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4"><Code2 className="mr-1 h-3 w-3" /> Snippets</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Code <span className="gradient-text">Snippets</span></h1>
          <p className="mt-6 text-lg text-muted-foreground">Bibliothèque de snippets réutilisables.</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SNIPPETS.map((s) => (
            <Card key={s.title} className="cursor-pointer transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2"><Badge variant="outline">{s.language}</Badge></div>
                <CardTitle className="text-base">{s.title}</CardTitle>
                <CardDescription>{s.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
