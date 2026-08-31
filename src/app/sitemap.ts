import type { MetadataRoute } from "next";
import { getAllDocs } from "@/lib/mdx";
import { db } from "@/lib/prisma";

const BASE_URL = "https://wabtechs.com";

export const revalidate = 3600;

const staticRoutes = [
	"",
	"/about",
	"/blog",
	"/docs",
	"/projects",
	"/podcast",
	"/videos",
	"/snippets",
	"/resources",
	"/downloads",
	"/community",
	"/newsletter",
	"/faq",
	"/events",
	"/open-source",
	"/roadmaps",
	"/tutorials",
	"/contact",
	"/privacy",
	"/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
		url: `${BASE_URL}${route}`,
		lastModified: new Date(),
		changeFrequency: route === "" ? "daily" : "weekly",
		priority: route === "" ? 1 : 0.8,
	}));

	try {
		const [posts, projects, podcasts, docs] = await Promise.all([
			db.post.findMany({
				where: { published: true },
				select: { slug: true, updatedAt: true },
			}),
			db.project.findMany({
				where: { archived: false },
				select: { slug: true, updatedAt: true },
			}),
			db.podcast.findMany({
				where: { published: true },
				select: { slug: true, updatedAt: true },
			}),
			Promise.resolve(
				getAllDocs().map((doc) => ({
					slug: doc.slug,
					updatedAt: new Date(),
				})),
			),
		]);

		for (const post of posts) {
			entries.push({
				url: `${BASE_URL}/blog/${post.slug}`,
				lastModified: post.updatedAt,
				changeFrequency: "weekly",
				priority: 0.7,
			});
		}
		for (const project of projects) {
			entries.push({
				url: `${BASE_URL}/projects/${project.slug}`,
				lastModified: project.updatedAt,
				changeFrequency: "monthly",
				priority: 0.6,
			});
		}
		for (const podcast of podcasts) {
			entries.push({
				url: `${BASE_URL}/podcast`,
				lastModified: podcast.updatedAt,
				changeFrequency: "weekly",
				priority: 0.5,
			});
		}
		for (const doc of docs) {
			entries.push({
				url: `${BASE_URL}/docs/${doc.slug}`,
				lastModified: doc.updatedAt,
				changeFrequency: "monthly",
				priority: 0.4,
			});
		}
	} catch {
		// Retourne au minimum les routes statiques si la base est indisponible.
	}

	return entries;
}
