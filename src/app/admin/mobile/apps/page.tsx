import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { ApplicationCard } from "@/modules/mobile-builder/components/ApplicationCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Applications — Mobile Center" };
export const dynamic = "force-dynamic";

export default async function MobileAppsPage() {
  const apps = await db.mobileApp.findMany({
    orderBy: { createdAt: "desc" },
    include: { builds: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground mt-2">Gérez vos applications mobiles Wabtechs.</p>
        </div>
        <Button asChild>
          <Link href="/admin/mobile/apps/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle application
          </Link>
        </Button>
      </div>

      {apps.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-[#1F1F1F] p-12 text-center">
          <p className="text-muted-foreground">Aucune application enregistrée.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/mobile/apps/new">Créer la première application</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
