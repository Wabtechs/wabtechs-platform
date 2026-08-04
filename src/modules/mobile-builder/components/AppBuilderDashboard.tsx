import { Smartphone, Package, Upload, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApplicationCard } from "@/modules/mobile-builder/components/ApplicationCard";
import { BuildHistory } from "@/modules/mobile-builder/components/BuildHistory";

interface AppBuilderDashboardProps {
  apps: Array<{
    id: string;
    name: string;
    slug: string;
    packageName: string;
    bundleId: string;
    description?: string | null;
    icon?: string | null;
    repositoryUrl: string;
    framework: string;
    version: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  builds: Array<{
    id: string;
    platform: string;
    version: string;
    status: string;
    createdAt: Date;
    completedAt?: Date | null;
    duration?: number | null;
    artifactUrl?: string | null;
    logs?: string | null;
  }>;
}

export function AppBuilderDashboard({ apps, builds }: AppBuilderDashboardProps) {
  const stats = [
    { label: "Total applications", value: apps.length, icon: Smartphone },
    {
      label: "Prêts à publier",
      value: apps.filter((a) => a.status === "SUCCESS").length,
      icon: Package,
    },
    {
      label: "En cours de build",
      value: apps.filter((a) => a.status === "BUILDING").length,
      icon: Upload,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mobile App Builder</h1>
          <p className="text-muted-foreground">
            Gérez les versions Web, Mobile et Desktop de vos produits Wabtechs.
          </p>
        </div>
        <Button asChild>
          <a href="/admin/mobile/apps/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle application
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <stat.icon className="text-primary h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Mes applications</h2>
          <Button variant="link" asChild>
            <a href="/admin/mobile/apps">Voir toutes les applications</a>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.slice(0, 6).map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
          {apps.length === 0 && (
            <Card className="col-span-3 py-12 text-center">
              <CardContent>
                <Smartphone className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">Aucune application enregistrée.</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Créez votre première application mobile en cliquant sur le bouton ci-dessus.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Build récent (10 derniers)</h2>
        <BuildHistory builds={builds.slice(0, 10)} />
      </div>
    </div>
  );
}
