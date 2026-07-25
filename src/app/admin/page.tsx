import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  FileText,
  MessageSquare,
  Headphones,
  Layers,
  Users,
  Mail,
  ArrowRight,
  Settings,
} from "lucide-react";

export const metadata: Metadata = { title: "Administration" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  const [postCount, podcastCount, projectCount, subscriberCount, messageCount, unreadMessages, userCount] =
    await Promise.all([
      db.post.count(),
      db.podcast.count(),
      db.project.count(),
      db.newsletter.count({ where: { active: true } }),
      db.contactMessage.count(),
      db.contactMessage.count({ where: { read: false } }),
      db.user.count(),
    ]);

  const sections = [
    {
      icon: FileText,
      title: "Articles",
      description: `${postCount} articles`,
      href: "/admin/posts",
      color: "text-blue-500",
    },
    {
      icon: Headphones,
      title: "Podcasts",
      description: `${podcastCount} épisodes`,
      href: "/admin/podcasts",
      color: "text-purple-500",
    },
    {
      icon: Layers,
      title: "Projets",
      description: `${projectCount} projets`,
      href: "/admin/projects",
      color: "text-green-500",
    },
    {
      icon: Users,
      title: "Utilisateurs",
      description: `${userCount} comptes`,
      href: "/admin/users",
      color: "text-orange-500",
    },
    {
      icon: Mail,
      title: "Newsletter",
      description: `${subscriberCount} abonnés`,
      href: "/admin/subscribers",
      color: "text-cyan-500",
    },
    {
      icon: MessageSquare,
      title: "Messages",
      description: `${unreadMessages}/${messageCount} non lus`,
      href: "/admin/messages",
      color: "text-yellow-500",
    },
    {
      icon: Settings,
      title: "Paramètres",
      description: "Configurer le site",
      href: "/admin/settings",
      color: "text-pink-500",
    },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
              <Badge variant="destructive">Admin</Badge>
            </div>
            <p className="mt-2 text-muted-foreground">Gestion complète de la plateforme WabTechs.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link key={section.href} href={section.href}>
              <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <section.icon className={`h-8 w-8 ${section.color}`} />
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <CardTitle className="mt-2">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Aperçu rapide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{postCount}</p>
                  <p className="text-xs text-muted-foreground">Articles</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{subscriberCount}</p>
                  <p className="text-xs text-muted-foreground">Abonnés</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{projectCount}</p>
                  <p className="text-xs text-muted-foreground">Projets</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Activité récente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">{unreadMessages} messages non lus</p>
              <p className="text-muted-foreground">{podcastCount} épisodes podcast</p>
              <p className="text-muted-foreground">{userCount} utilisateurs inscrits</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
