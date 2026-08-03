import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();

  const [totalPosts, totalPodcasts, totalProjects, totalSubscribers, totalMessages, unreadMessages, totalViews] =
    await Promise.all([
      db.post.count(),
      db.podcast.count(),
      db.project.count(),
      db.newsletter.count({ where: { active: true } }),
      db.contactMessage.count(),
      db.contactMessage.count({ where: { read: false } }),
      db.pageView.count(),
    ]);

  const recentPosts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, slug: true, published: true, views: true, createdAt: true },
  });

  return NextResponse.json({
    totalPosts,
    totalPodcasts,
    totalProjects,
    totalSubscribers,
    totalMessages,
    unreadMessages,
    totalViews,
    recentPosts,
  });
});