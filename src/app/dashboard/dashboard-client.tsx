"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Headphones,
  Layers,
  Users,
  Eye,
  Settings,
  Mail,
  MessageSquare,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface Stats {
  postCount: number;
  podcastCount: number;
  projectCount: number;
  subscriberCount: number;
  userPostCount: number;
  userCommentCount: number;
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

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  post: { id: string; title: string; slug: string };
}

interface Props {
  stats: Stats;
  recentPosts: Post[];
  recentComments: Comment[];
  userName: string;
  userRole: string;
  userEmail: string;
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
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

  const primaryMetrics = [
    { label: "Articles", value: stats.postCount, icon: FileText, color: "#842ae3", href: "/blog" },
    { label: "Podcasts", value: stats.podcastCount, icon: Headphones, color: "#3b82f6", href: "/podcast" },
    { label: "Projets", value: stats.projectCount, icon: Layers, color: "#10b981", href: "/projects" },
    { label: "Vues totales", value: stats.totalViews, icon: Eye, color: "#f59e0b" },
  ];

  const secondaryMetrics = [
    { label: "Abonnés", value: stats.subscriberCount, icon: Users, color: "#ec4899" },
    { label: "Vos articles", value: stats.userPostCount, icon: FileText, color: "#8b5cf6" },
    { label: "Vos commentaires", value: stats.userCommentCount, icon: MessageSquare, color: "#06b6d4" },
  ];

  return (
    <div className="min-h-screen">
      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* Profile Header */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#842ae3] text-lg font-bold text-white shadow-lg shadow-[#842ae3]/20">
              {initial}
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Bonjour, {userName}
              </h1>
              <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                {today} &middot; {userRole === "ADMIN" ? "Administrateur" : "Membre"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp} className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#842ae3] px-3 text-[13px] font-medium text-white shadow-sm shadow-[#842ae3]/20 transition-all hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
          >
            <FileText className="h-3.5 w-3.5" />
            Blog
          </Link>
          <Link
            href="/podcast"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#842ae3] px-3 text-[13px] font-medium text-white shadow-sm shadow-[#842ae3]/20 transition-all hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
          >
            <Headphones className="h-3.5 w-3.5" />
            Podcast
          </Link>
          <Link
            href="/projects"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#842ae3] px-3 text-[13px] font-medium text-white shadow-sm shadow-[#842ae3]/20 transition-all hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
          >
            <Layers className="h-3.5 w-3.5" />
            Projets
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200/80 px-3 text-[13px] font-medium text-gray-600 transition-all hover:bg-gray-50 dark:border-white/[0.06] dark:text-gray-400 dark:hover:bg-white/[0.04]"
          >
            <Mail className="h-3.5 w-3.5" />
            Contact
          </Link>
          {userRole === "ADMIN" && (
            <Link
              href="/admin"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200/80 px-3 text-[13px] font-medium text-gray-600 transition-all hover:bg-gray-50 dark:border-white/[0.06] dark:text-gray-400 dark:hover:bg-white/[0.04]"
            >
              <Settings className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
        </motion.div>

        {/* Primary Metrics */}
        <motion.div variants={fadeUp} className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {primaryMetrics.map((m) => (
            <Card
              key={m.label}
              className="group relative overflow-hidden border-gray-200/80 bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 dark:border-white/[0.06] dark:bg-[#111] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{m.label}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white leading-none">
                      {m.value.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${m.color}12` }}
                  >
                    <m.icon className="h-4 w-4" style={{ color: m.color }} />
                  </div>
                </div>
                {m.href && (
                  <Link
                    href={m.href}
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#842ae3] hover:underline"
                  >
                    Voir
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Secondary Metrics */}
        <motion.div variants={fadeUp} className="mb-8 grid grid-cols-3 gap-3">
          {secondaryMetrics.map((m) => (
            <Card
              key={m.label}
              className="border-gray-200/80 bg-white transition-all duration-300 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-[#111] dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.15)]"
            >
              <CardContent className="flex items-center gap-3 p-3.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${m.color}12` }}
                >
                  <m.icon className="h-4 w-4" style={{ color: m.color }} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{m.value}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{m.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Posts */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <Card className="border-gray-200/80 bg-white dark:border-white/[0.06] dark:bg-[#111]">
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#842ae3]/10">
                    <FileText className="h-3.5 w-3.5 text-[#842ae3]" />
                  </div>
                  <span className="text-[14px] font-semibold text-gray-900 dark:text-white">
                    Articles récents
                  </span>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-[#842ae3] transition-colors hover:bg-[#842ae3]/5"
                >
                  Tout voir
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <CardContent className="p-0 pb-2">
                <div className="divide-y divide-gray-100/80 dark:divide-white/[0.04]">
                  {recentPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <FileText className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
                      <p className="text-[13px] text-gray-500">Aucun article</p>
                    </div>
                  ) : (
                    recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-gray-900 dark:text-white">
                            {post.title}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[11px] text-gray-400">{formatDate(post.createdAt)}</span>
                            {post.tags.length > 0 && (
                              <>
                                <span className="text-gray-300 dark:text-gray-600">&middot;</span>
                                <span className="text-[11px] text-gray-400">
                                  {post.tags.slice(0, 2).map((t) => t.name).join(", ")}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Eye className="h-3 w-3" />
                            {post.views}
                          </span>
                          {post.published ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                              Publié
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
                              Brouillon
                            </span>
                          )}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column */}
          <motion.div variants={fadeUp} className="space-y-5">
            {/* Comments */}
            <Card className="border-gray-200/80 bg-white dark:border-white/[0.06] dark:bg-[#111]">
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
                    <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <span className="text-[14px] font-semibold text-gray-900 dark:text-white">
                    Commentaires
                  </span>
                </div>
              </div>
              <CardContent className="p-0 pb-2">
                <div className="divide-y divide-gray-100/80 dark:divide-white/[0.04]">
                  {recentComments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <MessageSquare className="mb-3 h-7 w-7 text-gray-300 dark:text-gray-600" />
                      <p className="text-[13px] text-gray-500">Aucun commentaire</p>
                    </div>
                  ) : (
                    recentComments.map((c) => (
                      <div key={c.id} className="px-5 py-3">
                        <p className="truncate text-[13px] text-gray-900 dark:text-white">{c.content}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[11px] text-gray-400">
                            sur <span className="font-medium text-gray-600 dark:text-gray-300">{c.post.title}</span>
                          </span>
                          <span className="text-[11px] text-gray-400">&middot; {timeAgo(c.createdAt)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Profile Card */}
            <Card className="border-gray-200/80 bg-white dark:border-white/[0.06] dark:bg-[#111]">
              <div className="flex items-center gap-2 px-5 pt-5 pb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
                  <Zap className="h-3.5 w-3.5 text-violet-500" />
                </div>
                <span className="text-[14px] font-semibold text-gray-900 dark:text-white">
                  Mon profil
                </span>
              </div>
              <CardContent className="space-y-3 px-5 pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500 dark:text-gray-400">Email</span>
                  <span className="text-[12px] font-medium text-gray-900 dark:text-white truncate max-w-[160px]">
                    {userEmail}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500 dark:text-gray-400">Rôle</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    userRole === "ADMIN"
                      ? "bg-[#842ae3]/10 text-[#842ae3]"
                      : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400"
                  }`}>
                    {userRole === "ADMIN" ? "Admin" : "Membre"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500 dark:text-gray-400">Articles</span>
                  <span className="text-[12px] font-medium text-gray-900 dark:text-white">{stats.userPostCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500 dark:text-gray-400">Commentaires</span>
                  <span className="text-[12px] font-medium text-gray-900 dark:text-white">{stats.userCommentCount}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
