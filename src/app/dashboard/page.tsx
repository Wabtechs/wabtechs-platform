import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Headphones, Layers, Mail, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { MetricCard } from "@/components/shared/metric-card";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [postCount, podcastCount, projectCount, subscriberCount, messageCount] = await Promise.all([
    db.post.count(),
    db.podcast.count(),
    db.project.count(),
    db.newsletter.count({ where: { active: true } }),
    db.contactMessage.count({ where: { read: false } }),
  ]);

  const recentPosts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, slug: true, published: true, createdAt: true },
  });

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Bonjour, {session.user.name ?? "Admin"}
            </h1>
            <p className="mt-2 text-muted-foreground">Vue d&apos;ensemble de votre plateforme.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="border-white/10 text-muted-foreground hover:bg-white/5">
              <Link href="/admin">
                <BarChart3 className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={FileText} title="Articles" value={postCount} change={`${postCount} publiés`} changeType="neutral" />
          <MetricCard icon={Headphones} title="Podcasts" value={podcastCount} change={`${podcastCount} épisodes`} changeType="neutral" />
          <MetricCard icon={Layers} title="Projets" value={projectCount} change={`${projectCount} open source`} changeType="neutral" />
          <MetricCard icon={Users} title="Abonnés" value={subscriberCount} change={`${subscriberCount} actifs`} changeType="positive" />
        </div>

        {messageCount > 0 && (
          <Card className="mt-6 border-white/10 bg-[#1F1F1F]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-sm text-white">Messages non lus</CardTitle>
                <Badge variant="destructive" className="ml-auto">
                  {messageCount}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        )}

        <Card className="mt-6 border-white/10 bg-[#1F1F1F]">
          <CardHeader>
            <CardTitle className="text-lg text-white">Articles récents</CardTitle>
            <CardDescription>Vos derniers articles publiés.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <EmptyState icon={FileText} title="Aucun article" description="Commencez par créer votre premier article." />
            ) : (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-[#131313] p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{post.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                    </div>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
