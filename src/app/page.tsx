import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Code2,
  FileText,
  Headphones,
  Layers,
  Play,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroSection } from "@/components/home/hero-section";
import { FeatureCard } from "@/components/home/feature-card";
import { StatsSection } from "@/components/home/stats-section";
import { CTASection } from "@/components/home/cta-section";
import { getAllPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

const FEATURES = [
  {
    icon: <FileText className="h-6 w-6 text-primary" />,
    title: "Blog Technique",
    description: "Articles approfondis sur le développement web, les bonnes pratiques et les technologies modernes.",
    href: "/blog",
  },
  {
    icon: <BookOpen className="h-6 w-6 text-primary" />,
    title: "Documentation",
    description: "Documentation complète et guides pour ma stack technique et mes projets open source.",
    href: "/docs",
  },
  {
    icon: <Headphones className="h-6 w-6 text-primary" />,
    title: "Podcast",
    description: "Épisodes réguliers sur les tendances tech, les interviews et les discussions communautaires.",
    href: "/podcast",
  },
  {
    icon: <Play className="h-6 w-6 text-primary" />,
    title: "Vidéos & Tutoriels",
    description: "Tutoriels vidéo pratiques, démos live et contenus YouTube exclusifs.",
    href: "/videos",
  },
  {
    icon: <Code2 className="h-6 w-6 text-primary" />,
    title: "Projets Open Source",
    description: "Contributions à l'écosystème open source avec des projets maintenus et documentés.",
    href: "/projects",
  },
  {
    icon: <Layers className="h-6 w-6 text-primary" />,
    title: "Snippets & Ressources",
    description: "Bibliothèque de snippets réutilisables et ressources pour accélérer votre productivité.",
    href: "/snippets",
  },
];

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <HeroSection />

      <section className="border-t py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Plateforme
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Tout ce dont vous avez besoin
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Une plateforme complète pour apprendre, partager et grandir dans le domaine du développement.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.href} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Zap className="mr-1 h-3 w-3" />
                Derniers articles
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Du contenu récent
              </h2>
            </div>
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/blog">
                Voir tout
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="group h-full cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                      <span className="text-xs text-muted-foreground">{post.readTime} min</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.description}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground">{formatDate(post.date)}</p>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
          {posts.length === 0 && (
            <p className="text-center text-muted-foreground">
              Aucun article pour le moment. Revenez bientôt !
            </p>
          )}
          <div className="mt-8 text-center sm:hidden">
            <Button variant="ghost" asChild>
              <Link href="/blog">
                Voir tous les articles
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <StatsSection />
      <CTASection />
    </>
  );
}
