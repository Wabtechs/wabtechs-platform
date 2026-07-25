"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Headphones,
  Layers,
  Users,
  Bookmark,
  MessageSquare,
  Eye,
  Settings,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface Stats {
  postCount: number;
  podcastCount: number;
  projectCount: number;
  subscriberCount: number;
  userPostCount: number;
  userCommentCount: number;
  userBookmarkCount: number;
  totalViews: number;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  views: number;
  tags: { name: string }[];
}

interface BookmarkItem {
  id: string;
  post: {
    id: string;
    title: string;
    slug: string;
    createdAt: Date;
  };
  createdAt: Date;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  post: {
    id: string;
    title: string;
    slug: string;
  };
}

interface Props {
  stats: Stats;
  recentPosts: Post[];
  userBookmarks: BookmarkItem[];
  recentComments: Comment[];
  userName: string;
  userRole: string;
  userEmail: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "à l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

export function DashboardClient({
  stats,
  recentPosts,
  userBookmarks,
  recentComments,
  userName,
  userRole,
  userEmail,
}: Props) {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const initial = (userName ?? "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Profile Header */}
          <motion.div variants={item} className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#842ae3] text-xl font-bold text-white">
              {initial}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Bonjour, {userName}
              </h1>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {today} — {userRole === "ADMIN" ? "Administrateur" : "Membre"}
              </p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item} className="mb-8 flex flex-wrap gap-3">
            <Button asChild size="sm" className="bg-[#842ae3] text-white hover:bg-[#7323c4]">
              <Link href="/blog">
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                Lire le blog
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-[#842ae3] text-white hover:bg-[#7323c4]">
              <Link href="/podcast">
                <Headphones className="mr-1.5 h-3.5 w-3.5" />
                Écouter le podcast
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-[#842ae3] text-white hover:bg-[#7323c4]">
              <Link href="/projects">
                <Layers className="mr-1.5 h-3.5 w-3.5" />
                Voir les projets
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="border-gray-200 dark:border-white/10">
              <Link href="/contact">
                <Mail className="mr-1.5 h-3.5 w-3.5" />
                Contact
              </Link>
            </Button>
            {userRole === "ADMIN" && (
              <Button asChild size="sm" variant="outline" className="border-gray-200 dark:border-white/10">
                <Link href="/admin">
                  <Settings className="mr-1.5 h-3.5 w-3.5" />
                  Administration
                </Link>
              </Button>
            )}
          </motion.div>

          {/* Platform Stats */}
          <motion.div variants={item} className="mb-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Vue d&apos;ensemble
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { label: "Articles", value: stats.postCount, icon: FileText, color: "#842ae3" },
                { label: "Podcasts", value: stats.podcastCount, icon: Headphones, color: "#3b82f6" },
                { label: "Projets", value: stats.projectCount, icon: Layers, color: "#10b981" },
                { label: "Abonnés", value: stats.subscriberCount, icon: Users, color: "#f59e0b" },
                { label: "Vues totales", value: stats.totalViews, icon: Eye, color: "#ef4444" },
                { label: "Vos articles", value: stats.userPostCount, icon: FileText, color: "#8b5cf6" },
              ].map((stat) => (
                <Card key={stat.label} className="border-gray-200 bg-white transition-all hover:shadow-md dark:border-white/[0.06] dark:bg-[#111]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${stat.color}15` }}
                      >
                        <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Your Posts */}
            <motion.div variants={item} className="lg:col-span-2">
              <Card className="border-gray-200 bg-white dark:border-white/[0.06] dark:bg-[#111]">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-[15px] font-semibold text-gray-900 dark:text-white">
                    Articles récents
                  </CardTitle>
                  <Link
                    href="/blog"
                    className="text-[13px] font-medium text-[#842ae3] hover:text-[#7323c4] transition-colors"
                  >
                    Tout voir
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                    {recentPosts.length === 0 ? (
                      <p className="px-6 py-8 text-center text-sm text-gray-500">Aucun article.</p>
                    ) : (
                      recentPosts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-medium text-gray-900 dark:text-white">
                              {post.title}
                            </p>
                            <div className="mt-0.5 flex items-center gap-2">
                              <span className="text-[12px] text-gray-500 dark:text-gray-400">
                                {formatDate(post.createdAt)}
                              </span>
                              {post.tags.length > 0 && (
                                <div className="flex gap-1">
                                  {post.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag.name} variant="secondary" className="text-[10px] px-1.5 py-0">
                                      {tag.name}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[11px] text-gray-400">
                              <Eye className="h-3 w-3" />
                              {post.views}
                            </span>
                            <Badge variant={post.published ? "default" : "secondary"} className="text-[11px]">
                              {post.published ? "Publié" : "Brouillon"}
                            </Badge>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div variants={item} className="space-y-6">
              {/* Bookmarks */}
              <Card className="border-gray-200 bg-white dark:border-white/[0.06] dark:bg-[#111]">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-[15px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    Signets
                  </CardTitle>
                  <span className="text-[11px] text-gray-500">{stats.userBookmarkCount}</span>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                    {userBookmarks.length === 0 ? (
                      <p className="px-6 py-6 text-center text-[13px] text-gray-500">Aucun signet.</p>
                    ) : (
                      userBookmarks.map((bm) => (
                        <Link
                          key={bm.id}
                          href={`/blog/${bm.post.slug}`}
                          className="block px-6 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                        >
                          <p className="truncate text-[13px] font-medium text-gray-900 dark:text-white">
                            {bm.post.title}
                          </p>
                          <p className="mt-0.5 text-[11px] text-gray-400">{timeAgo(bm.createdAt)}</p>
                        </Link>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Comments */}
              <Card className="border-gray-200 bg-white dark:border-white/[0.06] dark:bg-[#111]">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-[15px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Commentaires récents
                  </CardTitle>
                  <span className="text-[11px] text-gray-500">{stats.userCommentCount}</span>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                    {recentComments.length === 0 ? (
                      <p className="px-6 py-6 text-center text-[13px] text-gray-500">Aucun commentaire.</p>
                    ) : (
                      recentComments.map((c) => (
                        <div key={c.id} className="px-6 py-3">
                          <p className="truncate text-[13px] text-gray-900 dark:text-white">{c.content}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[11px] text-gray-400">
                              sur <span className="font-medium text-gray-600 dark:text-gray-300">{c.post.title}</span>
                            </span>
                            <span className="text-[11px] text-gray-400">· {timeAgo(c.createdAt)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Profile Card */}
              <Card className="border-gray-200 bg-white dark:border-white/[0.06] dark:bg-[#111]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[15px] font-semibold text-gray-900 dark:text-white">
                    Mon profil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">Email</span>
                    <span className="text-[13px] font-medium text-gray-900 dark:text-white">{userEmail}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">Rôle</span>
                    <Badge variant={userRole === "ADMIN" ? "destructive" : "secondary"}>
                      {userRole}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">Articles écrits</span>
                    <span className="text-[13px] font-medium text-gray-900 dark:text-white">{stats.userPostCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">Commentaires</span>
                    <span className="text-[13px] font-medium text-gray-900 dark:text-white">{stats.userCommentCount}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
