import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { ReleaseManager } from "@/modules/mobile-builder/components/ReleaseManager";

export const metadata: Metadata = { title: "Releases — Mobile Center" };
export const dynamic = "force-dynamic";

export default async function MobileReleasesPage() {
  const releases = await db.mobileRelease.findMany({
    orderBy: { createdAt: "desc" },
    include: { app: true, build: true },
  });

  const builds = await db.mobileBuild.findMany({
    select: { id: true, version: true, status: true },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Gestion des releases</h1>
      <p className="text-muted-foreground mt-2">
        Gérez les versions et publiez les applications sur les stores.
      </p>
      <div className="mt-8">
        <ReleaseManager releases={releases} builds={builds} />
      </div>
    </div>
  );
}
