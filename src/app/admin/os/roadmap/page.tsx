import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { OsPageHeader } from "@/components/admin/os/os-page-header";
import { Map } from "lucide-react";
import { RoadmapBoard } from "./roadmap-board";

export const metadata: Metadata = { title: "Project OS — Roadmap" };
export const dynamic = "force-dynamic";

interface OsProject {
  id: string;
  slug: string;
  name: string;
  color: string;
}

export default async function OsRoadmapPage() {
  const projects = await db.osProject.findMany({
    select: { id: true, slug: true, name: true, color: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <OsPageHeader
        title="Roadmap"
        description="Gestion complète de la feuille de route produits"
        icon={<Map className="h-5 w-5" />}
      />
      <RoadmapBoard projects={projects as OsProject[]} />
    </div>
  );
}
