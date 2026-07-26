import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { AdminDashboardClient } from "./dashboard-client";

export const metadata: Metadata = { title: "Dashboard | Admin" };

const mockAnalytics = {
  monthlyViews: [
    { month: "Jan", total: 1820 },
    { month: "Fév", total: 2340 },
    { month: "Mar", total: 3120 },
    { month: "Avr", total: 2780 },
    { month: "Mai", total: 3650 },
    { month: "Jun", total: 4210 },
    { month: "Jul", total: 3890 },
    { month: "Aoû", total: 4560 },
    { month: "Sep", total: 3980 },
    { month: "Oct", total: 5120 },
    { month: "Nov", total: 4750 },
    { month: "Déc", total: 5340 },
  ],
  weeklyTraffic: [
    { day: "Lun", clicks: 720, visitors: 580 },
    { day: "Mar", clicks: 845, visitors: 620 },
    { day: "Mer", clicks: 690, visitors: 510 },
    { day: "Jeu", clicks: 930, visitors: 710 },
    { day: "Ven", clicks: 1050, visitors: 820 },
    { day: "Sam", clicks: 480, visitors: 390 },
    { day: "Dim", clicks: 360, visitors: 290 },
  ],
  totalClicks: 48720,
  uniqueVisitors: 12340,
  bounceRate: 32,
  avgSession: "4m 32s",
  referrers: [
    { name: "google.com", visits: 8420 },
    { name: "twitter.com", visits: 3150 },
    { name: "github.com", visits: 2780 },
    { name: "linkedin.com", visits: 1940 },
    { name: "Direct", visits: 1560 },
  ],
  devices: [
    { name: "Desktop", percentage: 52 },
    { name: "Mobile", percentage: 38 },
    { name: "Tablet", percentage: 10 },
  ],
};

const mockActivities = [
  { id: "1", action: "Article publié", target: "Guide complet de Next.js 16", time: "Il y a 2 heures" },
  { id: "2", action: "Nouvel abonné", target: "jean.dupont@email.com", time: "Il y a 5 heures" },
  { id: "3", action: "Commentaire reçu", target: "Sur \"React Server Components\"", time: "Il y a 8 heures" },
  { id: "4", action: "Podcast mis à jour", target: "Épisode 12 - Tailwind CSS v4", time: "Hier" },
  { id: "5", action: "Projet terminé", target: "Refonte du portfolio", time: "Il y a 2 jours" },
];

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  const [postCount, podcastCount, projectCount, subscriberCount, messageCount, unreadMessages, userCount, totalViews] =
    await Promise.all([
      db.post.count(),
      db.podcast.count(),
      db.project.count(),
      db.newsletter.count({ where: { active: true } }),
      db.contactMessage.count(),
      db.contactMessage.count({ where: { read: false } }),
      db.user.count(),
      db.pageView.count().catch(() => 0),
    ]);

  const recentPosts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, slug: true, published: true, createdAt: true, views: true, author: { select: { name: true } } },
  });

  const recentMessages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, subject: true, read: true, createdAt: true },
  });

  return (
    <AdminDashboardClient
      stats={{
        postCount,
        podcastCount,
        projectCount,
        subscriberCount,
        messageCount,
        unreadMessages,
        userCount,
        totalViews,
      }}
      recentPosts={recentPosts}
      recentMessages={recentMessages}
      userName={(session.user as { name?: string }).name ?? "Admin"}
      analytics={mockAnalytics}
      activities={mockActivities}
    />
  );
}
