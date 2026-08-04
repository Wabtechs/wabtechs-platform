import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { AppBuilderDashboard } from "@/modules/mobile-builder/components/AppBuilderDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Package, Upload, Activity } from "lucide-react";

export const metadata: Metadata = { title: "Mobile App Builder" };
export const dynamic = "force-dynamic";

export default async function MobileDashboardPage() {
  const apps = await db.mobileApp.findMany({
    orderBy: { createdAt: "desc" },
    include: { builds: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  const builds = await db.mobileBuild.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { app: true },
  });

  const stats = {
    total: apps.length,
    ready: apps.filter((a) => a.status === "SUCCESS").length,
    building: apps.filter((a) => a.status === "BUILDING").length,
    failed: apps.filter((a) => a.status === "FAILED").length,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mobile App Builder</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les versions Web, Mobile et Desktop de vos produits Wabtechs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="bg-primary/10 rounded-lg p-3">
              <Smartphone className="text-primary h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-muted-foreground text-sm">Applications</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-green-500/10 p-3">
              <Package className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.ready}</p>
              <p className="text-muted-foreground text-sm">Prêts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Upload className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.building}</p>
              <p className="text-muted-foreground text-sm">En cours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-red-500/10 p-3">
              <Activity className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.failed}</p>
              <p className="text-muted-foreground text-sm">Échecs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <AppBuilderDashboard apps={apps} builds={builds} />
      </div>

      <div className="mt-8 flex gap-4">
        <Link href="/admin/mobile/apps/new" className="theme-btn">
          Nouvelle application
        </Link>
        <Link href="/admin/mobile/builds" className="theme-btn">
          Historique des builds
        </Link>
        <Link href="/admin/mobile/settings" className="theme-btn">
          Paramètres
        </Link>
      </div>
    </div>
  );
}
