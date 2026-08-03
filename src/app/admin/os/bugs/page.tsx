import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { BugsTable } from "./bugs-table";
import { Bug } from "lucide-react";

export const metadata: Metadata = { title: "Project OS — Bugs" };
export const dynamic = "force-dynamic";

export default async function OsBugsPage() {
  const projects = await db.osProject.findMany({
    select: { id: true, slug: true, name: true, color: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <OsPageHeader
        title="Bugs"
        description="Suivi des bugs et défauts sur l'ensemble des projets"
        icon={<Bug className="h-5 w-5" />}
      />
      <BugsTable projects={projects} />
    </div>
  );
}
