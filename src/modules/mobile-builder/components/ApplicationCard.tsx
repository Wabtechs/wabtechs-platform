"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Smartphone,
  Globe,
  GitBranch,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type MobileAppCardProps = {
  app: {
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
  };
};

const statusConfig = {
  PENDING: { icon: Clock, color: "bg-yellow-500/10 text-yellow-500", label: "En attente" },
  BUILDING: { icon: Clock, color: "bg-blue-500/10 text-blue-500", label: "En cours" },
  SUCCESS: { icon: CheckCircle, color: "bg-green-500/10 text-green-500", label: "Prêt" },
  FAILED: { icon: XCircle, color: "bg-red-500/10 text-red-500", label: "Échec" },
};

export function ApplicationCard({ app }: MobileAppCardProps) {
  const statusKey = app.status as keyof typeof statusConfig;
  const statusEntry = statusConfig[statusKey] || statusConfig.PENDING;
  const StatusIcon = statusEntry.icon;
  const statusClass = statusEntry.color;
  const statusLabel = statusEntry.label;

  const frameworkKey = app.framework as string;
  const allFrameworks: Record<string, string> = {
    NEXT_JS: "Next.js",
    REACT_NATIVE: "React Native",
    EXPO: "Expo",
    VUE: "Vue",
    SVELTEKIT: "SvelteKit",
    CUSTOM: "Custom",
  };
  const frameworkLabel = allFrameworks[frameworkKey] ?? app.framework;

  return (
    <Card className="group transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 relative flex h-12 w-12 items-center justify-center rounded-xl">
              {app.icon ? (
                <Image src={app.icon} alt={app.name} fill className="rounded-xl object-contain" />
              ) : (
                <Smartphone className="text-primary h-6 w-6" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{app.name}</CardTitle>
              <p className="text-muted-foreground text-sm">v{app.version}</p>
            </div>
          </div>
          <Badge className={statusClass}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {statusLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {app.description && (
          <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">{app.description}</p>
        )}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Globe className="text-muted-foreground h-4 w-4" />
            <span>Android: {app.packageName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="text-muted-foreground h-4 w-4" />
            <span>iOS: {app.bundleId}</span>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="text-muted-foreground h-4 w-4" />
            <a
              href={app.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary truncate hover:underline"
            >
              {app.repositoryUrl}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Framework:</span>
            <Badge variant="outline" className="text-xs">
              {frameworkLabel}
            </Badge>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/admin/mobile/apps/${app.id}`}>Voir les détails</Link>
          </Button>
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link href={`/admin/mobile/apps/${app.id}/builds/new`}>
              <AlertCircle className="mr-2 h-4 w-4" />
              Build
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
