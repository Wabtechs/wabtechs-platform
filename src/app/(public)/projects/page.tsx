import { ArrowRight, ExternalLink, Github, Globe } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getPublicProjects } from "@/lib/projects";

export const metadata: Metadata = {
	title: "Projets",
	description: "Projets open source et applications créées par WabTechs.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
	const projects = await getPublicProjects();
	const featured = projects.find((p) => p.featured);
	const others = projects.filter((p) => !p.featured);

	return (
		<div className="pt-24 pb-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<Breadcrumb items={[{ label: "Projets" }]} className="mb-6" />

				<PageHeader
					badge="Projets"
					title="Projets"
					highlight="Open Source"
					description={`${projects.length} projets open source — contributions, outils et templates pour la communauté.`}
				/>

				{featured && (
					<section className="mt-16">
						<Badge variant="default" className="mb-4">
							Projet principal
						</Badge>
						<Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
							<div className="grid md:grid-cols-[1fr_auto] gap-6 p-6 md:p-8">
								<div>
									<div className="flex flex-wrap gap-1.5 mb-3">
										{featured.techStack.map((tag) => (
											<Badge key={tag} variant="secondary" className="text-xs">
												{tag}
											</Badge>
										))}
									</div>
									<h2 className="text-2xl font-bold">{featured.title}</h2>
									<p className="mt-2 text-muted-foreground">
										{featured.description}
									</p>
									<div className="mt-6 flex flex-wrap gap-3">
										<Button asChild>
											<Link href={`/projects/${featured.slug}`}>
												Découvrir le projet
												<ArrowRight className="ml-2 h-4 w-4" />
											</Link>
										</Button>
										{featured.githubUrl && (
											<Button asChild variant="outline">
												<a
													href={featured.githubUrl}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Github className="mr-2 h-4 w-4" />
													Voir le code
												</a>
											</Button>
										)}
										{featured.demoUrl && (
											<Button asChild variant="outline">
												<a
													href={featured.demoUrl}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Globe className="mr-2 h-4 w-4" />
													Voir la démo
												</a>
											</Button>
										)}
									</div>
								</div>
							</div>
						</Card>
					</section>
				)}

				<section className="mt-16">
					<h2 className="text-xl font-bold tracking-tight mb-6">
						Autres projets
					</h2>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{others.map((project) => (
							<Link
								key={project.id}
								href={`/projects/${project.slug}`}
								className="group"
							>
								<Card className="flex h-full flex-col transition-all hover:shadow-lg hover:border-primary/50">
									<CardHeader>
										<div className="flex items-center justify-between mb-2">
											<div className="flex flex-wrap gap-1">
												{project.techStack.slice(0, 3).map((tag) => (
													<Badge
														key={tag}
														variant="secondary"
														className="text-xs"
													>
														{tag}
													</Badge>
												))}
											</div>
										</div>
										<CardTitle className="text-base group-hover:text-primary transition-colors">
											{project.title}
										</CardTitle>
										<CardDescription className="line-clamp-2">
											{project.description}
										</CardDescription>
									</CardHeader>
									<CardContent className="mt-auto">
										<div className="flex justify-end gap-3">
											{project.githubUrl && (
												<span className="text-muted-foreground hover:text-foreground transition-colors">
													<Github className="h-4 w-4" />
												</span>
											)}
											{project.demoUrl && (
												<span className="text-muted-foreground hover:text-foreground transition-colors">
													<ExternalLink className="h-4 w-4" />
												</span>
											)}
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</section>

				<section className="mt-20 text-center">
					<Card className="mx-auto max-w-2xl bg-muted/30">
						<CardContent className="pt-6">
							<Github className="mx-auto h-10 w-10 text-muted-foreground" />
							<h3 className="mt-4 text-xl font-bold">
								Plus de projets sur GitHub
							</h3>
							<p className="mt-2 text-muted-foreground">
								Tous les projets sont open source. N&apos;hésitez pas à
								contribuer !
							</p>
							<Button asChild className="mt-6" variant="outline">
								<a
									href="https://github.com/wabtechs"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Github className="mr-2 h-4 w-4" />
									Voir tous les projets
									<ArrowRight className="ml-2 h-4 w-4" />
								</a>
							</Button>
						</CardContent>
					</Card>
				</section>
			</div>
		</div>
	);
}
