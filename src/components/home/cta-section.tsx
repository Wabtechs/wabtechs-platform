import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="border-t py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card p-8 sm:p-12 lg:p-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Rejoignez la communauté
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Recevez les derniers articles, tutoriels et ressources directement dans votre boîte mail.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/newsletter">
                S&apos;inscrire à la newsletter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/community">Rejoindre la communauté</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
