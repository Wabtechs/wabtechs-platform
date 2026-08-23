import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, BookOpen, FileText } from "lucide-react";

const SUGGESTIONS = [
  { icon: Home, label: "Accueil", href: "/" },
  { icon: BookOpen, label: "Blog", href: "/blog" },
  { icon: FileText, label: "Documentation", href: "/docs" },
  { icon: Search, label: "Recherche", href: "/blog" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold gradient-text">404</p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Page introuvable</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
        Voici quelques liens pour vous aider :
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SUGGESTIONS.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="transition-all hover:shadow-lg hover:border-primary/50 group cursor-pointer">
              <CardContent className="flex flex-col items-center gap-2 pt-6 pb-4">
                <s.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium">{s.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Button asChild className="mt-8">
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </div>
  );
}
