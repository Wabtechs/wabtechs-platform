import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { DeletePodcastButton } from "./delete-button";

export const metadata: Metadata = { title: "Gestion des podcasts" };

export default async function AdminPodcastsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  const podcasts = await db.podcast.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Podcasts</h1>
            <p className="mt-2 text-muted-foreground">{podcasts.length} épisodes au total.</p>
          </div>
          <Button asChild>
            <Link href="/admin/podcasts/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouvel épisode
            </Link>
          </Button>
        </div>

        <div className="mt-8 space-y-3">
          {podcasts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucun épisode. Créez votre premier podcast !
              </CardContent>
            </Card>
          ) : (
            podcasts.map((podcast) => (
              <Card key={podcast.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base truncate">{podcast.title}</CardTitle>
                      <Badge variant={podcast.published ? "default" : "secondary"}>
                        {podcast.published ? "Publié" : "Brouillon"}
                      </Badge>
                      <Badge variant="outline">S{podcast.season}E{podcast.episode}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {podcast.duration} secondes · {podcast.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/podcasts/${podcast.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeletePodcastButton id={podcast.id} />
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
