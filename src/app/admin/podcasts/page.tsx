import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Headphones, Clock } from "lucide-react";
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
    <div className="min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10">
              <Headphones className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
                Podcasts
              </h1>
              <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                {podcasts.length} épisodes au total
              </p>
            </div>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="h-8 bg-primary text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
        >
          <Link href="/admin/podcasts/new">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nouvel épisode
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        {podcasts.length === 0 ? (
          <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Headphones className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
              <p className="text-[13px] text-gray-500">Aucun épisode</p>
              <Link
                href="/admin/podcasts/new"
                className="mt-2 text-[12px] font-medium text-primary hover:underline"
              >
                Créer votre premier podcast
              </Link>
            </CardContent>
          </Card>
        ) : (
          podcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="group flex items-center justify-between rounded-xl border border-gray-200/80 bg-white px-5 py-4 transition-all duration-200 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:border-border dark:bg-card dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.15)]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[14px] font-medium text-gray-900 dark:text-foreground">
                    {podcast.title}
                  </p>
                  {podcast.published ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      Publié
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
                      Brouillon
                    </span>
                  )}
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    S{podcast.season}E{podcast.episode}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[12px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {podcast.duration}s
                  </span>
                  <span>·</span>
                  <span>{podcast.slug}</span>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-foreground"
                >
                  <Link href={`/admin/podcasts/${podcast.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <DeletePodcastButton id={podcast.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
