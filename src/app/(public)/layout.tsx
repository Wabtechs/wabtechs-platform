import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { BackToTop } from "@/components/shared/back-to-top";
import { PodcastWrapper } from "@/components/shared/podcast-wrapper";
import { PageTransition } from "@/components/shared/page-transition";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <PodcastWrapper>
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BackToTop />
    </PodcastWrapper>
  );
}
