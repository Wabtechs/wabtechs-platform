import { db } from "@/lib/prisma";

export interface PublicProject {
	id: string;
	slug: string;
	title: string;
	description: string;
	longDescription: string | null;
	coverImage: string | null;
	githubUrl: string | null;
	demoUrl: string | null;
	techStack: string[];
	featured: boolean;
}

async function getDbProjects(): Promise<PublicProject[]> {
	try {
		const projects = await db.project.findMany({
			where: { archived: false },
			orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
		});
		return projects.map((p) => ({
			id: p.id,
			slug: p.slug,
			title: p.title,
			description: p.description,
			longDescription: p.longDescription,
			coverImage: p.coverImage,
			githubUrl: p.githubUrl,
			demoUrl: p.demoUrl,
			techStack: p.techStack,
			featured: p.featured,
		}));
	} catch (error) {
		console.error("[projects] Erreur de lecture des projets DB:", error);
		return [];
	}
}

export async function getPublicProjects(): Promise<PublicProject[]> {
	const projects = await getDbProjects();
	if (projects.length > 0) return projects;

	// Fallback si la base est vide pour ne pas casser la page.
	return [
		{
			id: "fallback-wabtechs-platform",
			slug: "wabtechs-platform",
			title: "WabTechs Platform",
			description:
				"La plateforme officielle — blog, docs, podcasts, vidéos, snippets et projets open source.",
			longDescription: null,
			coverImage: null,
			githubUrl: "https://github.com/wabtechs/wabtechs-platform",
			demoUrl: "https://wabtechs-platform.vercel.app",
			techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
			featured: true,
		},
	];
}

export async function getPublicProjectBySlug(
	slug: string,
): Promise<PublicProject | null> {
	const project = await db.project.findUnique({
		where: { slug },
	});
	if (!project || project.archived) return null;
	return {
		id: project.id,
		slug: project.slug,
		title: project.title,
		description: project.description,
		longDescription: project.longDescription,
		coverImage: project.coverImage,
		githubUrl: project.githubUrl,
		demoUrl: project.demoUrl,
		techStack: project.techStack,
		featured: project.featured,
	};
}
