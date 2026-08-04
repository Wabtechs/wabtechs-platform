"use client";

import { Clock, CheckCircle, XCircle, Download, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type BuildRecord = {
  id: string;
  platform: string;
  version: string;
  status: string;
  createdAt: Date;
  completedAt?: Date | null;
  duration?: number | null;
  artifactUrl?: string | null;
  logs?: string | null;
};

export interface BuildHistoryProps {
  builds: BuildRecord[];
  onDownload?: (build: BuildRecord) => void;
  onViewLogs?: (build: BuildRecord) => void;
}

const statusIcons = {
  PENDING: { icon: Clock, color: "text-yellow-500", label: "En attente" },
  BUILDING: { icon: Clock, color: "text-blue-500", label: "En cours" },
  SUCCESS: { icon: CheckCircle, color: "text-green-500", label: "Réussi" },
  FAILED: { icon: XCircle, color: "text-red-500", label: "Échec" },
};

export function BuildHistory({ builds, onDownload, onViewLogs }: BuildHistoryProps) {
  if (builds.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Clock className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground">Aucun build pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des builds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {builds.map((build) => {
            const statusEntry =
              statusIcons[build.status as keyof typeof statusIcons] || statusIcons.PENDING;
            const Icon = statusEntry.icon;
            const duration = build.duration ? `${Math.floor(build.duration / 1000)}s` : "—";

            return (
              <div key={build.id} className="rounded-lg border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full bg-${statusEntry.color}/10 p-2`}>
                      <Icon className={`h-4 w-4 ${statusEntry.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs uppercase">
                          {build.platform}
                        </Badge>
                        <span className="text-sm font-medium">v{build.version}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Durée: {duration} • Créé: {new Date(build.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      build.status === "SUCCESS"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-gray-500/10 text-gray-500"
                    }
                  >
                    {statusEntry.label}
                  </Badge>
                </div>

                {build.status === "FAILED" && build.logs && (
                  <div className="mt-3 rounded-md bg-red-500/10 p-3">
                    <p className="text-xs break-all whitespace-pre-wrap text-red-400">
                      {build.logs.substring(0, 500)}
                      {build.logs.length > 500 && " ..."}
                    </p>
                  </div>
                )}

                <div className="mt-3 flex gap-2 self-end">
                  {build.artifactUrl && (
                    <Button variant="outline" size="sm" onClick={() => onDownload?.(build)}>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </Button>
                  )}
                  {build.logs && (
                    <Button variant="outline" size="sm" onClick={() => onViewLogs?.(build)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir logs
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
