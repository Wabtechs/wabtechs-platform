"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  MessageSquare,
  Users,
  Eye,
  Plus,
  ExternalLink,
  Headphones,
  Layers,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface Stats {
  postCount: number;
  podcastCount: number;
  projectCount: number;
  subscriberCount: number;
  messageCount: number;
  unreadMessages: number;
  userCount: number;
  totalViews: number;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  views: number;
  author: { name: string | null } | null;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  read: boolean;
  createdAt: Date;
}

interface Props {
  stats: Stats;
  recentPosts: Post[];
  recentMessages: Message[];
  userName: string;
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
  if (days < 7) return `il y a ${days}j`;
  return formatDate(date);
}

export function AdminDashboardClient({ stats, recentPosts, recentMessages, userName }: Props) {
  const now = new Date();
  const today = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const primaryMetrics = [
    {
      label: "Vues totales",
      value: stats.totalViews,
      icon: Eye,
      color: "#3b82f6",
      gradient: "from-blue-500/10 to-blue-600/5",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Articles",
      value: stats.postCount,
      icon: FileText,
      color: "#842ae3",
      gradient: "from-purple-500/10 to-purple-600/5",
      trend: `${stats.postCount}`,
      trendUp: true,
    },
    {
      label: "Abonnés",
      value: stats.subscriberCount,
      icon: Users,
      color: "#10b981",
      gradient: "from-emerald-500/10 to-emerald-600/5",
      trend: `${stats.subscriberCount}`,
      trendUp: true,
    },
    {
      label: "Messages",
      value: stats.messageCount,
      icon: MessageSquare,
      color: "#f59e0b",
      gradient: "from-amber-500/10 to-amber-600/5",
      trend: `${stats.unreadMessages} non lus`,
      trendUp: stats.unreadMessages === 0,
    },
  ];

  const secondaryMetrics = [
    { label: "Podcasts", value: stats.podcastCount, icon: Headphones, color: "#ec4899" },
    { label: "Projets", value: stats.projectCount, icon: Layers, color: "#06b6d4" },
    { label: "Utilisateurs", value: stats.userCount, icon: Users, color: "#8b5cf6" },
  ];

  return (
    <div className="min-h-screen">
      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#842ae3]/10">
              <Zap className="h-5 w-5 text-[#842ae3]" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Bonjour, {userName}
              </h1>
              <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                {today}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Primary Metrics */}
        <motion.div variants={fadeUp} className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {primaryMetrics.map((metric) => (
            <Card
              key={metric.label}
              className="group relative overflow-hidden border-gray-200/80 bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 dark:border-white/[0.06] dark:bg-[#111] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-[28px] font-semibold tracking-tight text-gray-900 dark:text-white leading-none">
                      {metric.value.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${metric.color}12` }}
                  >
                    <metric.icon className="h-5 w-5" style={{ color: metric.color }} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  {metric.trendUp ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-[11px] font-medium ${metric.trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                    {metric.trend}
                  </span>
                  <span className="text-[11px] text-gray-400">ce mois</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Secondary Metrics + Quick Actions */}
        <motion.div variants={fadeUp} className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {secondaryMetrics.map((metric) => (
            <Card
              key={metric.label}
              className="border-gray-200/80 bg-white transition-all duration-300 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-[#111] dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.15)]"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${metric.color}12` }}
                >
                  <metric.icon className="h-5 w-5" style={{ color: metric.color }} />
                </div>
                <div>
                  <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" className="h-8 bg-[#842ae3] text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25">
              <Link href="/admin/posts/new">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Nouvel Article
              </Link>
            </Button>
            <Button asChild size="sm" className="h-8 bg-[#842ae3] text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25">
              <Link href="/admin/podcasts/new">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Nouveau Podcast
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="h-8 border-gray-200/80 dark:border-white/10">
              <a href="/" target="_blank">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Voir le site
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Posts */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <Card className="border-gray-200/80 bg-white dark:border-white/[0.06] dark:bg-[#111]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#842ae3]/10">
                      <FileText className="h-3.5 w-3.5 text-[#842ae3]" />
                    </div>
                    <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-white">
                      Articles récents
                    </CardTitle>
                  </div>
                  <Link
                    href="/admin/posts"
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-[#842ae3] transition-colors hover:bg-[#842ae3]/5"
                  >
                    Tout voir
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100/80 dark:divide-white/[0.04]">
                  {recentPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <FileText className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
                      <p className="text-[13px] text-gray-500">Aucun article</p>
                      <Link href="/admin/posts/new" className="mt-2 text-[12px] font-medium text-[#842ae3] hover:underline">
                        Créer un article
                      </Link>
                    </div>
                  ) : (
                    recentPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-gray-900 dark:text-white">
                            {post.title}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[11px] text-gray-400">
                              {post.author?.name ?? "Inconnu"}
                            </span>
                            <span className="text-gray-300 dark:text-gray-600">·</span>
                            <span className="text-[11px] text-gray-400">
                              {timeAgo(post.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center gap-3">
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
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column */}
          <motion.div variants={fadeUp} className="space-y-5">
            {/* Messages */}
            <Card className="border-gray-200/80 bg-white dark:border-white/[0.06] dark:bg-[#111]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
                      <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-white">
                      Messages
                    </CardTitle>
                  </div>
                  <Link
                    href="/admin/messages"
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-[#842ae3] transition-colors hover:bg-[#842ae3]/5"
                  >
                    Tout voir
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100/80 dark:divide-white/[0.04]">
                  {recentMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <MessageSquare className="mb-3 h-7 w-7 text-gray-300 dark:text-gray-600" />
                      <p className="text-[13px] text-gray-500">Aucun message</p>
                    </div>
                  ) : (
                    recentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                      >
                        <div className="mt-1.5 flex-shrink-0">
                          <div className={`h-2 w-2 rounded-full ${msg.read ? "bg-gray-200 dark:bg-gray-700" : "bg-[#842ae3] shadow-sm shadow-[#842ae3]/30"}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="truncate text-[13px] font-medium text-gray-900 dark:text-white">
                              {msg.name}
                            </p>
                            <span className="ml-2 flex-shrink-0 text-[10px] text-gray-400">
                              {timeAgo(msg.createdAt)}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-[12px] text-gray-500 dark:text-gray-400">
                            {msg.subject}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System */}
            <Card className="border-gray-200/80 bg-white dark:border-white/[0.06] dark:bg-[#111]">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-white">
                    Système
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Base de données", value: "Connecté", ok: true },
                  { label: "Utilisateurs", value: stats.userCount, ok: true },
                  { label: "Projets", value: stats.projectCount, ok: true },
                  { label: "Podcasts", value: stats.podcastCount, ok: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-500 dark:text-gray-400">{item.label}</span>
                    {typeof item.value === "string" ? (
                      <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {item.value}
                      </span>
                    ) : (
                      <span className="text-[12px] font-medium text-gray-900 dark:text-white">{item.value}</span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
