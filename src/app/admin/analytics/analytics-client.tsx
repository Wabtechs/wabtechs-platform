"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { BarChart3, Eye, Calendar, TrendingUp, Globe, Loader2 } from "lucide-react";
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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export function AnalyticsClient() {
  const { theme } = useTheme();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("30d");
  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

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
        <Loader2 className="h-6 w-6 animate-spin text-[#842ae3]" />
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
    { label: "Total vues", value: data.totalViews.toLocaleString(), icon: Eye, color: "#3b82f6" },
    { label: "Aujourd'hui", value: data.todayViews.toLocaleString(), icon: Calendar, color: "#842ae3" },
    { label: "7 derniers jours", value: data.views7d.toLocaleString(), icon: TrendingUp, color: "#10b981" },
    { label: "Pages uniques", value: data.uniquePages.toLocaleString(), icon: Globe, color: "#f59e0b" },
  ];

  const chartData = data.viewsByDay.map((d) => ({
    date: new Date(d.date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    }),
    vues: d.count,
  }));

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Suivez les performances de votre plateforme.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-white/10 dark:bg-[#1a1a1a]">
          {(["7d", "30d", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-all ${
                period === p
                  ? "bg-white text-gray-900 shadow-sm dark:bg-[#111] dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              {p === "7d" ? "7 jours" : p === "30d" ? "30 jours" : "Tous"}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card
            key={m.label}
            className="border-gray-200 bg-white dark:border-white/[0.06] dark:bg-[#111]"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400">{m.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {m.value}
                  </p>
                </div>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${m.color}15` }}
                >
                  <m.icon className="h-4 w-4" style={{ color: m.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item} className="mb-8">
        <Card className="border-gray-200 bg-white dark:border-white/[0.06] dark:bg-[#111]">
          <CardHeader>
            <CardTitle className="text-[15px] font-semibold text-gray-900 dark:text-white">
              Vues dans le temps
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#111" : "#fff",
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: isDark ? "#fff" : "#111",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="vues"
                      stroke="#842ae3"
                      strokeWidth={2}
                      dot={{ fill: "#842ae3", strokeWidth: 0, r: 3 }}
                      activeDot={{ r: 5, fill: "#842ae3" }}
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

      <motion.div variants={item}>
        <Card className="border-gray-200 bg-white dark:border-white/[0.06] dark:bg-[#111]">
          <CardHeader>
            <CardTitle className="text-[15px] font-semibold text-gray-900 dark:text-white">
              Pages les plus visitées
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data.topPages.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                {data.topPages.map((page, i) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-[12px] font-medium text-gray-400">{i + 1}</span>
                      <span className="font-mono text-[13px] font-medium text-gray-900 dark:text-white">
                        {page.path}
                      </span>
                    </div>
                    <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
                      {page.views} vues
                    </span>
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