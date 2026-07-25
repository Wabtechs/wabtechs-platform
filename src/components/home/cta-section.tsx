import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BgLines } from "@/components/shared/bg-lines";

export function CTASection() {
  return (
    <section className="relative border-t border-white/10 py-24">
      <div className="for-bgc-black py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Parlons de vos <span className="text-primary">prochains projets</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Que ce soit pour un projet personnel ou professionnel, c&apos;est l&apos;occasion de partager
            vos idées, vos ambitions et de définir les étapes nécessaires pour les réaliser.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact" className="theme-btn">
              Contactez-nous
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/projects" className="theme-btn" style={{ background: "transparent", color: "#cccccc", border: "1px solid rgba(255,255,255,0.1)" }}>
              Voir les projets
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      <BgLines />
    </section>
  );
}
