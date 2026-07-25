import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Layers, Archive, Star } from "lucide-react";
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
    <div className="min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
              <Layers className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Projets
              </h1>
              <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                {projects.length} projets au total
              </p>
            </div>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="h-8 bg-[#842ae3] text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
        >
          <Link href="/admin/projects/new">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nouveau projet
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        {projects.length === 0 ? (
          <Card className="border-gray-200/80 bg-white dark:border-white/[0.06] dark:bg-[#111]">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Layers className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
              <p className="text-[13px] text-gray-500">Aucun projet</p>
              <Link
                href="/admin/projects/new"
                className="mt-2 text-[12px] font-medium text-[#842ae3] hover:underline"
              >
                Créer votre premier projet
              </Link>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="group flex items-center justify-between rounded-xl border border-gray-200/80 bg-white px-5 py-4 transition-all duration-200 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-[#111] dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.15)]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[14px] font-medium text-gray-900 dark:text-white">
                    {project.title}
                  </p>
                  {project.featured && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                      <Star className="h-2.5 w-2.5" />
                      Featured
                    </span>
                  )}
                  {project.archived && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
                      <Archive className="h-2.5 w-2.5" />
                      Archivé
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[12px] text-gray-400">
                  <span>{formatDate(project.createdAt)}</span>
                  {project.techStack.length > 0 && (
                    <>
                      <span>·</span>
                      <span>{project.techStack.slice(0, 3).join(", ")}</span>
                      {project.techStack.length > 3 && (
                        <span>+{project.techStack.length - 3}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="ml-4 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <Link href={`/admin/projects/${project.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <DeleteProjectButton id={project.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
