import { Zap, Code2, Users } from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { BgLines } from "@/components/shared/bg-lines";

const REASONS = [
  {
    icon: Zap,
    title: "Tout-en-un",
    description:
      "Documentation, blog, vidéos, tutoriels, podcasts, templates et académie — tout est centralisé sur une seule plateforme.",
  },
  {
    icon: Code2,
    title: "Open Source",
    description:
      "Code source disponible, contributions bienvenues et templates réutilisables pour démarrer vos projets en quelques minutes.",
  },
  {
    icon: Users,
    title: "Communauté active",
    description:
      "500+ développeurs, contenu régulier et support direct. Rejoignez un écosystème qui grandit chaque jour.",
  },
];

export function WhyWabtechs() {
  return (
    <section className="relative border-t border-white/10">
      <div className="for-bgc-black py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="mb-16 text-center">
              <span className="sub-title">Pourquoi Wabtechs ?</span>
              <h2 className="text-3xl font-bold sm:text-4xl">
                La plateforme <span className="text-primary">conçue pour les développeurs</span>
              </h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {REASONS.map((reason, i) => (
              <AnimateOnScroll key={reason.title} delay={i * 0.1}>
                <div className="hover:border-primary/30 rounded-[14px] border border-white/10 bg-[#1F1F1F] p-8 transition-all">
                  <div className="bg-primary/10 mb-5 flex h-12 w-12 items-center justify-center rounded-xl">
                    <reason.icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">{reason.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
      <BgLines />
    </section>
  );
}
