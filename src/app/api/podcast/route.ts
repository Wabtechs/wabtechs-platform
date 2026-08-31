import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
	try {
		const podcasts = await db.podcast.findMany({
			where: { published: true },
			orderBy: [{ season: "asc" }, { episode: "asc" }],
			include: { tags: { select: { name: true } } },
		});

		const episodes = podcasts.map((podcast) => ({
			number: podcast.episode,
			season: podcast.season,
			title: podcast.title,
			description: podcast.description,
			duration: podcast.duration,
			tags: podcast.tags.map((t) => t.name),
			audioSrc: podcast.audioUrl,
			coverImage: podcast.coverImage,
			publishedAt: podcast.publishedAt,
		}));

		return NextResponse.json(episodes);
	} catch {
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
