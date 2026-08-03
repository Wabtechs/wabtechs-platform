"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  BarChart3,
  Eye,
  Calendar,
  TrendingUp,
  Globe,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  totalViews: number;
  views30d: number;
  views7d: number;
  todayViews: number;
  uniquePages: number;
  topPages: { path: string; views: number }[];
  viewsByDay: { date: string; count: number }[];
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export function AnalyticsClient() {
  const { theme } = useTheme();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("30d");
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <BarChart3 className="h-12 w-12 text-gray-300 dark:text-gray-600" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Données analytics non disponibles
        </p>
      </div>
    );
  }

  const metrics = [
    {
      label: "Total vues",
      value: data.totalViews.toLocaleString(),
      icon: Eye,
      color: "#3b82f6",
      gradient: "from-blue-500/10 to-blue-600/5",
    },
    {
      label: "Aujourd'hui",
      value: data.todayViews.toLocaleString(),
      icon: Calendar,
      color: "#842ae3",
      gradient: "from-purple-500/10 to-purple-600/5",
    },
    {
      label: "7 derniers jours",
      value: data.views7d.toLocaleString(),
      icon: TrendingUp,
      color: "#10b981",
      gradient: "from-emerald-500/10 to-emerald-600/5",
    },
    {
      label: "Pages uniques",
      value: data.uniquePages.toLocaleString(),
      icon: Globe,
      color: "#f59e0b",
      gradient: "from-amber-500/10 to-amber-600/5",
    },
  ];

  const chartData = data.viewsByDay.map((d) => ({
    date: new Date(d.date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    }),
    vues: d.count,
  }));

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp} className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
            Analytics
          </h1>
          <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
            Suivez les performances de votre plateforme.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5 border-border bg-card">
          {(["7d", "30d", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-all duration-200 ${
                period === p
                  ? "bg-white text-gray-900 shadow-sm dark:bg-card dark:text-foreground"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {p === "7d" ? "7 jours" : p === "30d" ? "30 jours" : "Tous"}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card
            key={m.label}
            className="group relative overflow-hidden border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                    {m.label}
                  </p>
                  <p className="mt-2 text-[28px] font-semibold tracking-tight text-gray-900 dark:text-foreground leading-none">
                    {m.value}
                  </p>
                </div>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${m.color}12` }}
                >
                  <m.icon className="h-5 w-5" style={{ color: m.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="mb-6">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
              </div>
              <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-foreground">
                Vues dans le temps
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: isDark ? "#6b7280" : "#9ca3af" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: isDark ? "#6b7280" : "#9ca3af" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1a1a1a" : "#fff",
                        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
                        borderRadius: "10px",
                        fontSize: "12px",
                        boxShadow: "0 8px 30px rgb(0,0,0,0.12)",
                        color: isDark ? "#fff" : "#111",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="vues"
                      stroke="#842ae3"
                      strokeWidth={2}
                      dot={{ fill: "#842ae3", strokeWidth: 0, r: 3 }}
                      activeDot={{ r: 5, fill: "#842ae3", stroke: isDark ? "#111" : "#fff", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-sm text-gray-500">Pas encore de données</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                  <Globe className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <CardTitle className="text-[14px] font-semibold text-gray-900 dark:text-foreground">
                  Pages les plus visitées
                </CardTitle>
              </div>
              <span className="text-[12px] font-medium text-gray-400">
                {data.topPages.length} pages
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {data.topPages.length > 0 ? (
              <div className="divide-y divide-gray-100/80 dark:divide-white/[0.04]">
                {data.topPages.map((page, i) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-gray-50/80 dark:hover:bg-accent/[0.02]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-[11px] font-semibold text-gray-500 dark:bg-white/5 dark:text-gray-400">
                        {i + 1}
                      </span>
                      <span className="font-mono text-[13px] font-medium text-gray-900 dark:text-foreground">
                        {page.path}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
                        {page.views}
                      </span>
                      <ArrowUpRight className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-6 py-8 text-center text-sm text-gray-500">
                Aucune donnée de pages.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
