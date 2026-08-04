import { Mail } from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { BgLines } from "@/components/shared/bg-lines";
import { NewsletterForm } from "@/components/shared/newsletter-form";

export function NewsletterInlineCTA() {
  return (
    <section className="relative border-t border-white/10 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-[#1F1F1F] px-8 py-10 text-center md:flex-row md:text-left">
            <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl">
              <Mail className="text-primary h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Restez informé</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Recevez les derniers articles, tutoriels et annonces directement dans votre boîte
                mail.
              </p>
            </div>
            <div className="w-full max-w-sm flex-shrink-0">
              <NewsletterForm />
            </div>
          </div>
        </AnimateOnScroll>
      </div>
      <BgLines />
    </section>
  );
}
