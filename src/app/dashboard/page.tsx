import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id as string;
  const userRole = (session.user as { role?: string }).role ?? "USER";
  const userName = session.user.name ?? "Utilisateur";
  const userEmail = session.user.email ?? "";

  const [
    postCount,
    podcastCount,
    projectCount,
    subscriberCount,
    userPostCount,
    userCommentCount,
    userBookmarkCount,
    totalViews,
  ] = await Promise.all([
    db.post.count(),
    db.podcast.count(),
    db.project.count(),
    db.newsletter.count({ where: { active: true } }),
    db.post.count({ where: { authorId: userId } }).catch(() => 0),
    db.comment.count({ where: { authorId: userId } }).catch(() => 0),
    db.bookmark.count({ where: { authorId: userId } }).catch(() => 0),
    db.pageView.count().catch(() => 0),
  ]);

  const recentPosts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      createdAt: true,
      views: true,
      tags: { select: { name: true } },
    },
  });

  const userBookmarks = await db.bookmark.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      createdAt: true,
      post: { select: { id: true, title: true, slug: true, createdAt: true } },
    },
  }).catch(() => []);

  const recentComments = await db.comment.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      content: true,
      createdAt: true,
      post: { select: { id: true, title: true, slug: true } },
    },
  }).catch(() => []);

  return (
    <DashboardClient
      stats={{
        postCount,
        podcastCount,
        projectCount,
        subscriberCount,
        userPostCount,
        userCommentCount,
        userBookmarkCount,
        totalViews,
      }}
      recentPosts={recentPosts}
      userBookmarks={userBookmarks}
      recentComments={recentComments}
      userName={userName}
      userRole={userRole}
      userEmail={userEmail}
    />
  );
}
