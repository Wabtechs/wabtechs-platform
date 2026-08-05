import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { FeaturesBoard } from "./features-board";
import { KanbanSquare } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Features" };
export const dynamic = "force-dynamic";

export default async function OsFeaturesPage({
  searchParams,
}: {
  searchParams: Promise<{ moduleId?: string }>;
}) {
  const { moduleId } = await searchParams;

  const [projects, modules] = await Promise.all([
    db.osProject.findMany({
      select: { id: true, slug: true, name: true, color: true },
      orderBy: { name: "asc" },
    }),
    db.module.findMany({
      orderBy: [{ project: { name: "asc" } }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        project: { select: { id: true, name: true, color: true } },
      },
    }),
  ]);

  return (
    <div>
      <OsPageHeader
        title="Features"
        description="Kanban des fonctionnalités sur l'ensemble des projets"
        icon={<KanbanSquare className="h-5 w-5" />}
      />
      <FeaturesBoard projects={projects} modules={modules} initialModuleId={moduleId} />
    </div>
  );
}
