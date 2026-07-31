import type { Metadata } from "next";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Archives Newsletter",
  description: "Tous les numéros précédents de la newsletter Wabtechs.",
};

const ISSUES = [
  { slug: "bienvenue-sur-wabtechs", title: "Bienvenue sur Wabtechs Platform", date: "Juillet 2026", summary: "Présentation de la plateforme, roadmap et vision." },
];

export default function ArchivePage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Archives"
          title="Archives de la"
          highlight="Newsletter"
          description="Retrouvez tous les numéros précédents de la newsletter."
        />

        <div className="mt-12 space-y-4">
          {ISSUES.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Aucun numéro pour le moment. Revenez bientôt !</p>
          ) : (
            ISSUES.map((issue) => (
              <Link
                key={issue.slug}
                href={`/newsletter/archive/${issue.slug}`}
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-[#1F1F1F] p-6 transition-all hover:border-primary/50"
              >
                <div>
                  <p className="text-sm text-muted-foreground">{issue.date}</p>
                  <h3 className="mt-1 text-lg font-semibold text-white group-hover:text-primary transition-colors">
                    {issue.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{issue.summary}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/newsletter" className="theme-btn inline-flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            S&apos;inscrire à la newsletter
          </Link>
        </div>
      </div>
    </div>
  );
}
