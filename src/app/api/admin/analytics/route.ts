import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async (req: Request) => {
  await requireAdmin();

  const url = new URL(req.url);
  const period = url.searchParams.get("period") ?? "30d";

  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const rangeDays = period === "7d" ? 7 : period === "all" ? null : 30;
  const start =
    rangeDays === null ? null : new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000);
  const where = start ? { createdAt: { gte: start } } : {};

  const [totalViews, views30d, views7d, todayViews, topPages, viewsByDay] = await Promise.all([
    db.pageView.count({ where }),
    db.pageView.count({
      where: { createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } },
    }),
    db.pageView.count({
      where: { createdAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } },
    }),
    db.pageView.count({ where: { createdAt: { gte: dayStart } } }),
    db.pageView.groupBy({
      by: ["path"],
      _count: { path: true },
      where,
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    db.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "page_views"
      WHERE "createdAt" >= ${start ?? new Date(0)}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    ` as Promise<{ date: Date; count: number }[]>,
  ]);

  return NextResponse.json({
    totalViews,
    views30d,
    views7d,
    todayViews,
    uniquePages: topPages.length,
    topPages: topPages.map((p: { path: string; _count: { path: number } }) => ({
      path: p.path,
      views: p._count.path,
    })),
    viewsByDay,
  });
});
