"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Package, Send, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Release = {
  id: string;
  version: string;
  status: "DRAFT" | "INTERNAL_TESTING" | "BETA" | "PRODUCTION";
  changelog?: string | null;
  buildId?: string | null;
  publishedAt?: Date | null;
  createdAt: Date;
};

interface ReleaseManagerProps {
  releases: Release[];
  builds?: Array<{ id: string; version: string; status: string }>;
  onPublish?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (release: Release) => Promise<void>;
}

const statusColors = {
  DRAFT: "bg-gray-500/10 text-gray-500",
  INTERNAL_TESTING: "bg-blue-500/10 text-blue-500",
  BETA: "bg-purple-500/10 text-purple-500",
  PRODUCTION: "bg-green-500/10 text-green-500",
};

export function ReleaseManager({
  releases,
  builds = [],
  onPublish,
  onDelete,
  onUpdate,
}: ReleaseManagerProps) {
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [editChangelog, setEditChangelog] = useState("");

  const handleStatusChange = async (release: Release, newStatus: string) => {
    await onUpdate?.({ ...release, status: newStatus as Release["status"] });
    toast.success("Statut mis à jour", {
      description: `Release ${release.version} → ${newStatus}`,
    });
  };

  const handlePublish = async (release: Release) => {
    await onPublish?.(release.id);
    toast.success("Publié", {
      description: `Release ${release.version} est maintenant en production`,
    });
  };

  const handleSaveChangelog = async () => {
    if (editingRelease) {
      await onUpdate?.({ ...editingRelease, changelog: editChangelog });
      setEditingRelease(null);
      toast.success("Changelog mis à jour");
    }
  };

  if (releases.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground">Aucun release pour le moment.</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Créez un build pour générer votre première release.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des releases</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {releases.map((release) => (
            <div key={release.id} className="rounded-lg border border-white/10 p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[release.status]}>
                      {release.status.replace("_", " ")}
                    </Badge>
                    <span className="text-sm font-medium">v{release.version}</span>
                  </div>
                  {release.publishedAt && (
                    <p className="text-muted-foreground text-xs">
                      Publié le {new Date(release.publishedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {release.buildId && builds.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Build:{" "}
                      {builds.find((b) => b.id === release.buildId)?.version ||
                        release.buildId.slice(0, 8)}
                    </Badge>
                  )}
                  {onPublish && release.status !== "PRODUCTION" && (
                    <Button size="sm" variant="default" onClick={() => handlePublish(release)}>
                      <Send className="mr-2 h-4 w-4" />
                      Publier
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Modifier la release v{release.version}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Changelog</Label>
                          <Textarea
                            value={editChangelog}
                            onChange={(e) => setEditChangelog(e.target.value)}
                            placeholder="Entrez le changelog..."
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Statut</Label>
                          <Select
                            value={release.status}
                            onValueChange={(val) => handleStatusChange(release, val)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DRAFT">Brouillon</SelectItem>
                              <SelectItem value="INTERNAL_TESTING">Test interne</SelectItem>
                              <SelectItem value="BETA">Beta</SelectItem>
                              <SelectItem value="PRODUCTION">Production</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleSaveChangelog} className="w-full">
                          Sauvegarder
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {onDelete && (
                    <Button size="sm" variant="destructive" onClick={() => onDelete(release.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {release.changelog && (
                <div className="mt-3 rounded-md bg-white/5 p-3">
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {release.changelog}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
