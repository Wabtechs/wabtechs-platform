import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { FeaturesBoard } from "./features-board";
import { KanbanSquare } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Features" };
export const dynamic = "force-dynamic";

export default async function OsFeaturesPage() {
  const projects = await db.osProject.findMany({
    select: { id: true, slug: true, name: true, color: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <OsPageHeader
        title="Features"
        description="Kanban des fonctionnalités sur l'ensemble des projets"
        icon={<KanbanSquare className="h-5 w-5" />}
      />
      <FeaturesBoard projects={projects} />
    </div>
  );
}
