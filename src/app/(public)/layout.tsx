import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { BackToTop } from "@/components/shared/back-to-top";
import { PageTransition } from "@/components/shared/page-transition";
import { PodcastWrapper } from "@/components/shared/podcast-wrapper";
import { ScrollProgress } from "@/components/shared/scroll-progress";

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
