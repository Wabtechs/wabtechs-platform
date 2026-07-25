import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { AdminDashboardClient } from "./dashboard-client";

export const metadata: Metadata = { title: "Dashboard | Admin" };

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
    />
  );
}
