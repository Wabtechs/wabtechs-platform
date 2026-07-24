import type { Metadata } from "next";
import { BookOpen, Code2, FileText, Rocket } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { DocsSearch } from "@/components/docs/docs-search";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Documentation complète de la plateforme WabTechs.",
};

const SECTIONS = [
  { icon: Rocket, title: "Getting Started", description: "Premiers pas avec la plateforme.", href: "/docs/getting-started" },
  { icon: Code2, title: "Architecture", description: "Structure et conventions du projet.", href: "/docs/architecture" },
  { icon: FileText, title: "API Reference", description: "Référence complète de l'API.", href: "/docs/api-reference" },
  { icon: BookOpen, title: "Guides", description: "Guides pas-à-pas pour les fonctionnalités.", href: "/docs/guides" },
];

export default function DocsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Documentation"
          title="Documentation"
          highlight="complète"
          description="Guides, références et tutoriels pour utiliser la plateforme."
        />

        <div className="mt-12">
          <DocsSearch />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {SECTIONS.map((section) => (
            <Link key={section.href} href={section.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <section.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="mt-2">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
