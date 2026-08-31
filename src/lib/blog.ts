import type { PostMeta } from "@/lib/mdx";
import {
	getPostBySlug as getMdxPostBySlug,
	getAllPosts as getMdxPosts,
} from "@/lib/mdx";
import { db } from "@/lib/prisma";

export interface BlogPost extends PostMeta {
	content: string;
	source: "db" | "mdx";
}

interface DbPostRow {
	slug: string;
	title: string;
	description: string;
	content: string;
	readTime: number;
	featured: boolean;
	date: Date;
	author: { name: string | null } | null;
	tags: { name: string }[];
}

function toPostMeta(record: DbPostRow): PostMeta {
	return {
		slug: record.slug,
		title: record.title,
		description: record.description,
		date: record.date.toISOString(),
		tags: record.tags.map((t) => t.name),
		author: record.author?.name ?? "WabTechs",
		readTime: record.readTime,
		featured: record.featured,
	};
}

async function getDbPosts(): Promise<DbPostRow[]> {
	try {
		const posts = await db.post.findMany({
			where: { published: true },
			orderBy: { publishedAt: "desc" },
			include: {
				author: { select: { name: true } },
				tags: { select: { name: true } },
			},
		});
		return posts.map((post) => ({
			slug: post.slug,
			title: post.title,
			description: post.description,
			content: post.content,
			readTime: post.readTime,
			featured: post.featured,
			date: post.publishedAt ?? post.createdAt,
			author: post.author,
			tags: post.tags,
		}));
	} catch (error) {
		console.error("[blog] Erreur de lecture des posts DB:", error);
		return [];
	}
}

async function getMdxPostsAsync(): Promise<BlogPost[]> {
	return getMdxPosts().map((post) => {
		const found = getMdxPostBySlug(post.slug);
		return {
			...post,
			content: found?.content ?? "",
			source: "mdx" as const,
		};
	});
}

/**
 * Récupère tous les posts du blog : les articles publiés depuis la base
 * de données plus les articles locaux MDX. Triés par date (récent d'abord).
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
	const [dbPosts, mdxPosts] = await Promise.all([
		getDbPosts(),
		getMdxPostsAsync(),
	]);

	const merged: BlogPost[] = [
		...dbPosts.map((post) => ({
			...toPostMeta(post),
			content: post.content,
			source: "db" as const,
		})),
		...mdxPosts,
	];

	return merged.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);
}

export async function getBlogPostBySlug(
	slug: string,
): Promise<BlogPost | null> {
	const mdx = getMdxPostBySlug(slug);
	if (mdx) {
		return { ...mdx.meta, content: mdx.content, source: "mdx" };
	}

	try {
		const post = await db.post.findUnique({
			where: { slug },
			include: {
				author: { select: { name: true } },
				tags: { select: { name: true } },
			},
		});
		if (!post?.published) return null;
		return {
			...toPostMeta({
				slug: post.slug,
				title: post.title,
				description: post.description,
				date: post.publishedAt ?? post.createdAt,
				readTime: post.readTime,
				featured: post.featured,
				author: post.author,
				tags: post.tags,
				content: post.content,
			}),
			content: post.content,
			source: "db",
		};
	} catch (error) {
		console.error("[blog] Erreur de lecture du post DB:", error);
		return null;
	}
}

/**
 * Liste des tags avec leur nombre d'articles, combinant posts DB et MDX.
 */
export async function getAllBlogTags(): Promise<
	{ tag: string; count: number }[]
> {
	const posts = await getAllBlogPosts();
	const tagMap = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.tags) {
			tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
		}
	}
	return Array.from(tagMap.entries())
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Articles similaires basés sur les tags partagés.
 */
export async function getRelatedBlogPosts(
	slug: string,
	limit = 3,
): Promise<BlogPost[]> {
	const all = await getAllBlogPosts();
	const current = all.find((p) => p.slug === slug);
	if (!current) return [];
	return all
		.filter((p) => p.slug !== slug)
		.map((p) => ({
			...p,
			relevance: p.tags.filter((t) => current.tags.includes(t)).length,
		}))
		.sort((a, b) => b.relevance - a.relevance)
		.slice(0, limit);
}
