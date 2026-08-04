import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { BuildHistory } from "@/modules/mobile-builder/components/BuildHistory";

export const metadata: Metadata = { title: "Builds — Mobile Center" };
export const dynamic = "force-dynamic";

export default async function MobileBuildsPage() {
  const builds = await db.mobileBuild.findMany({
    orderBy: { createdAt: "desc" },
    include: { app: true },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Historique des builds</h1>
      <p className="text-muted-foreground mt-2">
        Consultez l&apos;historique de tous les builds mobiles.
      </p>
      <div className="mt-8">
        <BuildHistory builds={builds} />
      </div>
    </div>
  );
}
