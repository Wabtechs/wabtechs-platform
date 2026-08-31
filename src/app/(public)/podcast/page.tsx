"use client";

import {
	Calendar,
	Clock,
	ExternalLink,
	Loader2,
	Pause,
	Play,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AudioPlayer } from "@/components/podcast/audio-player";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import { usePodcast } from "@/providers/podcast-provider";

interface PodcastEpisodePublic {
	number: number;
	season: number;
	title: string;
	description: string;
	duration: number;
	tags: string[];
	audioSrc: string;
	coverImage: string | null;
	publishedAt: string | null;
}

const FALLBACK_EPISODES: PodcastEpisodePublic[] = [
	{
		number: 1,
		season: 1,
		title: "Bienvenue sur WabTechs Podcast",
		description:
			"Présentation de la plateforme et des sujets qui seront abordés.",
		duration: 1800,
		tags: ["Podcast"],
		audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
		coverImage: null,
		publishedAt: null,
	},
];

const PLATFORMS = [
	{ name: "YouTube", url: "https://youtube.com/@wabtechs" },
	{ name: "Spotify", url: "#" },
	{ name: "Apple Podcasts", url: "#" },
	{ name: "RSS Feed", url: "#" },
];

export default function PodcastPage() {
	const { currentEpisode, isPlaying, play, pause } = usePodcast();
	const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
	const [episodes, setEpisodes] = useState<PodcastEpisodePublic[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		async function loadEpisodes() {
			try {
				const res = await fetch("/api/podcast");
				if (!res.ok) throw new Error("Erreur réseau");
				const data = (await res.json()) as PodcastEpisodePublic[];
				if (!cancelled) setEpisodes(data.length > 0 ? data : FALLBACK_EPISODES);
			} catch {
				if (!cancelled) setEpisodes(FALLBACK_EPISODES);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		loadEpisodes();
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<div className="pt-24 pb-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<PageHeader
					badge="Podcast"
					title="Podcast"
					highlight="Tech"
					description="Épisodes réguliers sur les tendances tech, tutoriels et interviews de développeurs."
				/>

				<div className="mt-8 flex flex-wrap justify-center gap-3">
					{PLATFORMS.map((platform) => (
						<a
							key={platform.name}
							href={platform.url}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Badge
								variant="outline"
								className="cursor-pointer border-white/10 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
							>
								<ExternalLink className="mr-1 h-3 w-3" />
								{platform.name}
							</Badge>
						</a>
					))}
				</div>

				{loading ? (
					<div className="mt-16 flex justify-center">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : (
					<div className="mt-12 space-y-4 max-w-4xl mx-auto">
						{episodes.map((ep) => {
							const isCurrent = currentEpisode?.number === ep.number;
							const isEpPlaying = isCurrent && isPlaying;
							return (
								<div key={ep.number}>
									<Card
										className={`transition-all group cursor-pointer ${isCurrent ? "border-primary bg-[#1F1F1F]" : "border-white/10 bg-[#1F1F1F] hover:border-primary/50"}`}
										onClick={() => {
											setSelectedEpisode(
												selectedEpisode === ep.number ? null : ep.number,
											);
										}}
									>
										<CardHeader className="flex flex-row items-start gap-4">
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													if (isEpPlaying) pause();
													else
														play({
															number: ep.number,
															title: ep.title,
															audioSrc: ep.audioSrc,
														});
												}}
												className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors"
											>
												{isEpPlaying ? (
													<Pause className="h-6 w-6" />
												) : (
													<Play className="h-6 w-6 ml-0.5" />
												)}
											</button>
											<div className="flex-1 min-w-0">
												<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
													<Badge
														variant="outline"
														className="text-xs border-white/10"
													>
														Épisode {ep.number}
													</Badge>
													<span className="flex items-center gap-1">
														<Clock className="h-3 w-3" />
														{formatDuration(ep.duration)}
													</span>
													{ep.publishedAt && (
														<span className="flex items-center gap-1">
															<Calendar className="h-3 w-3" />
															{new Date(ep.publishedAt).toLocaleDateString(
																"fr-FR",
																{
																	day: "numeric",
																	month: "long",
																	year: "numeric",
																},
															)}
														</span>
													)}
												</div>
												<CardTitle className="mt-2 text-lg text-white group-hover:text-primary transition-colors">
													{ep.title}
												</CardTitle>
												<CardDescription className="mt-1">
													{ep.description}
												</CardDescription>
												{ep.tags.length > 0 && (
													<div className="mt-3 flex flex-wrap gap-1.5">
														{ep.tags.map((tag) => (
															<Badge
																key={tag}
																variant="secondary"
																className="text-xs bg-white/5 text-muted-foreground"
															>
																{tag}
															</Badge>
														))}
													</div>
												)}
											</div>
										</CardHeader>
									</Card>
									{selectedEpisode === ep.number && (
										<div className="mt-2">
											<AudioPlayer
												src={ep.audioSrc}
												title={ep.title}
												duration={formatDuration(ep.duration)}
											/>
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
