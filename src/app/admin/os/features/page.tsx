import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { FeaturesBoard } from "./features-board";
import { KanbanSquare } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Features" };
export const dynamic = "force-dynamic";

export default async function OsFeaturesPage() {
  const repositories = await db.gitHubRepository.findMany({
    select: { id: true, fullName: true, name: true, owner: true },
    orderBy: { fullName: "asc" },
  });

  return (
    <div>
      <OsPageHeader
        title="Features"
        description="Pull requests GitHub des dépôts liés — source de vérité : GitHub"
        icon={<KanbanSquare className="h-5 w-5" />}
      />
      <FeaturesBoard repositories={repositories} />
    </div>
  );
}
