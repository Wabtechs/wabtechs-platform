import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeleteProjectButton } from "./delete-button";

export const metadata: Metadata = { title: "Gestion des projets" };

export default async function AdminProjectsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
            <p className="mt-2 text-muted-foreground">{projects.length} projets au total.</p>
          </div>
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau projet
            </Link>
          </Button>
        </div>

        <div className="mt-8 space-y-3">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucun projet. Créez votre premier projet !
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base truncate">{project.title}</CardTitle>
                      {project.featured && <Badge variant="outline">Featured</Badge>}
                      {project.archived && <Badge variant="secondary">Archivé</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(project.createdAt)}
                      {project.techStack.length > 0 && ` · ${project.techStack.join(", ")}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteProjectButton id={project.id} />
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
