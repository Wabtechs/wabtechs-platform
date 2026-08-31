import { ArrowLeft, ExternalLink, Github, Globe } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getPublicProjectBySlug } from "@/lib/projects";

export const revalidate = 60;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const project = await getPublicProjectBySlug(slug);
	if (!project) return { title: "Projet non trouvé" };
	return {
		title: project.title,
		description: project.description,
	};
}

export default async function ProjectDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const project = await getPublicProjectBySlug(slug);

	if (!project) notFound();

	return (
		<div className="pt-24 pb-16">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
				<Breadcrumb
					items={[
						{ label: "Projets", href: "/projects" },
						{ label: project.title },
					]}
					className="mb-6"
				/>

				<Button variant="ghost" size="sm" asChild className="mb-8">
					<Link href="/projects">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Retour aux projets
					</Link>
				</Button>

				<PageHeader
					badge={project.featured ? "Projet principal" : "Projet"}
					title={project.title}
					description={project.description}
				/>

				<div className="mt-8 flex flex-wrap justify-center gap-3">
					{project.githubUrl && (
						<Button asChild>
							<a
								href={project.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github className="mr-2 h-4 w-4" />
								Code source
							</a>
						</Button>
					)}
					{project.demoUrl && (
						<Button asChild variant="outline">
							<a
								href={project.demoUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Globe className="mr-2 h-4 w-4" />
								Voir la démo
							</a>
						</Button>
					)}
				</div>

				{project.techStack.length > 0 && (
					<div className="mt-10">
						<h2 className="text-lg font-bold mb-4">Stack technique</h2>
						<div className="flex flex-wrap gap-2">
							{project.techStack.map((tag) => (
								<Badge key={tag} variant="secondary">
									{tag}
								</Badge>
							))}
						</div>
					</div>
				)}

				{project.longDescription && (
					<div className="mt-10">
						<h2 className="text-lg font-bold mb-4">À propos du projet</h2>
						<Card>
							<CardHeader>
								<CardDescription className="whitespace-pre-line leading-relaxed">
									{project.longDescription}
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				)}

				{project.coverImage && (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={project.coverImage}
						alt={project.title}
						className="mt-10 w-full rounded-xl border"
					/>
				)}

				{/* Fallback explicite quand aucune description longue */}
				{!project.longDescription && (
					<Card className="mt-10">
						<CardHeader>
							<CardTitle className="text-base">{project.title}</CardTitle>
							<CardDescription>
								{project.description}
								{project.githubUrl && (
									<a
										href={project.githubUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-3 inline-flex items-center gap-1 text-primary hover:underline"
									>
										<ExternalLink className="h-3.5 w-3.5" />
										Voir sur GitHub
									</a>
								)}
							</CardDescription>
						</CardHeader>
					</Card>
				)}
			</div>
		</div>
	);
}
