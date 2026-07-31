import Link from "next/link";
import { ArrowRight, BookOpen, Video, MessageSquare, Github } from "lucide-react";
import { BgLines } from "@/components/shared/bg-lines";

export function CTASection() {
  return (
    <section className="relative border-t border-white/10 py-24">
      <div className="for-bgc-black py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Prêt à <span className="text-primary">construire</span> ?
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Que vous soyez développeur, entrepreneur ou étudiant, Wabtechs vous donne 
                les outils et ressources pour passer à l&apos;action.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/docs" className="theme-btn">
                  Explorer la documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:text-primary"
                >
                  Nous contacter
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { href: "/blog", icon: BookOpen, label: "Blog & Articles" },
                { href: "/videos", icon: Video, label: "Vidéos & Tutos" },
                { href: "/community", icon: MessageSquare, label: "Communauté" },
                { href: "https://github.com/wabtechs", icon: Github, label: "GitHub" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-[#1F1F1F] p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BgLines />
    </section>
  );
}
