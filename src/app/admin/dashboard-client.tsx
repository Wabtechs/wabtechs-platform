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
  Circle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

export function AdminDashboardClient({ stats, recentPosts, recentMessages, userName }: Props) {
  const statCards = [
    { label: "Total Vues", value: stats.totalViews.toLocaleString(), icon: Eye, color: "#3b82f6", change: "+12%" },
    { label: "Articles", value: stats.postCount, icon: FileText, color: "#842ae3", change: `+${stats.postCount}` },
    { label: "Abonnés", value: stats.subscriberCount, icon: Users, color: "#10b981", change: `+${stats.subscriberCount}` },
    { label: "Messages", value: `${stats.unreadMessages}/${stats.messageCount}`, icon: MessageSquare, color: "#f59e0b", change: `${stats.unreadMessages} non lus` },
  ];

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Header */}
          <motion.div variants={item} className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Bonjour, {userName}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {today} — Voici un aperçu de votre plateforme.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statCards.map((stat) => (
              <Card
                key={stat.label}
                className="group relative overflow-hidden border-gray-200 bg-white transition-all hover:shadow-md dark:border-white/[0.06] dark:bg-[#111]"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                      <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">{stat.change}</span>
                    <span className="text-[11px] text-gray-400">ce mois</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item} className="flex flex-wrap gap-3 mb-8">
            <Button asChild size="sm" className="bg-[#842ae3] text-white hover:bg-[#7323c4]">
              <Link href="/admin/posts/new">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Nouvel Article
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-[#842ae3] text-white hover:bg-[#7323c4]">
              <Link href="/admin/podcasts/new">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Nouveau Podcast
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="border-gray-200 dark:border-white/10">
              <a href="/" target="_blank">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Voir le site
              </a>
            </Button>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Posts Table */}
            <motion.div variants={item} className="lg:col-span-2">
              <Card className="border-gray-200 bg-white dark:border-white/[0.06] dark:bg-[#111]">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-[15px] font-semibold text-gray-900 dark:text-white">
                    Articles récents
                  </CardTitle>
                  <Link
                    href="/admin/posts"
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
                        <div
                          key={post.id}
                          className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-medium text-gray-900 dark:text-white">
                              {post.title}
                            </p>
                            <p className="mt-0.5 text-[12px] text-gray-500 dark:text-gray-400">
                              {post.author?.name ?? "Inconnu"} · {formatDate(post.createdAt)}
                            </p>
                          </div>
                          <div className="ml-4 flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[12px] text-gray-400">
                              <Eye className="h-3 w-3" />
                              {post.views}
                            </span>
                            <Badge
                              variant={post.published ? "default" : "secondary"}
                              className="text-[11px]"
                            >
                              {post.published ? "Publié" : "Brouillon"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity + Status */}
            <motion.div variants={item} className="space-y-6">
              {/* Messages */}
              <Card className="border-gray-200 bg-white dark:border-white/[0.06] dark:bg-[#111]">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-[15px] font-semibold text-gray-900 dark:text-white">
                    Messages récents
                  </CardTitle>
                  <Link
                    href="/admin/messages"
                    className="text-[13px] font-medium text-[#842ae3] hover:text-[#7323c4] transition-colors"
                  >
                    Tout voir
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                    {recentMessages.length === 0 ? (
                      <p className="px-6 py-8 text-center text-sm text-gray-500">Aucun message.</p>
                    ) : (
                      recentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className="flex items-start gap-3 px-6 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                        >
                          <Circle
                            className={`mt-1 h-2 w-2 flex-shrink-0 ${msg.read ? "text-gray-300 dark:text-gray-600" : "fill-[#842ae3] text-[#842ae3]"}`}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-[13px] font-medium text-gray-900 dark:text-white">
                                {msg.name}
                              </p>
                              <span className="flex-shrink-0 text-[11px] text-gray-400">
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

              {/* System Status */}
              <Card className="border-gray-200 bg-white dark:border-white/[0.06] dark:bg-[#111]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[15px] font-semibold text-gray-900 dark:text-white">
                    Système
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">Base de données</span>
                    <span className="flex items-center gap-1.5 text-[12px] text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Connecté
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">Utilisateurs</span>
                    <span className="text-[13px] font-medium text-gray-900 dark:text-white">{stats.userCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">Projets</span>
                    <span className="text-[13px] font-medium text-gray-900 dark:text-white">{stats.projectCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">Podcasts</span>
                    <span className="text-[13px] font-medium text-gray-900 dark:text-white">{stats.podcastCount}</span>
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
