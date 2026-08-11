import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { BugsTable } from "./bugs-table";
import { Bug } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Bugs" };
export const dynamic = "force-dynamic";

export default async function OsBugsPage() {
  const repositories = await db.gitHubRepository.findMany({
    select: { id: true, fullName: true, name: true, owner: true },
    orderBy: { fullName: "asc" },
  });

  return (
    <div>
      <OsPageHeader
        title="Bugs"
        description="Issues GitHub des dépôts liés — source de vérité : GitHub"
        icon={<Bug className="h-5 w-5" />}
      />
      <BugsTable repositories={repositories} />
    </div>
  );
}
