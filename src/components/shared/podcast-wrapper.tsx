"use client";

import { MiniPlayer } from "@/components/podcast/mini-player";
import { PodcastProvider } from "@/providers/podcast-provider";

export function PodcastWrapper({ children }: { children: React.ReactNode }) {
	return (
		<PodcastProvider>
			{children}
			<MiniPlayer />
		</PodcastProvider>
	);
}
