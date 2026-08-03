import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalViews, views30d, views7d, todayViews, uniquePaths, topPages, viewsByDay] = await Promise.all([
    db.pageView.count(),
    db.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    db.pageView.count({ where: { createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } } }),
    db.pageView.groupBy({ by: ["path"], _count: { path: true }, orderBy: { _count: { path: "desc" } }, take: 10 }),
    db.pageView.groupBy({ by: ["path"], _count: { path: true }, orderBy: { _count: { path: "desc" } }, take: 10 }),
    db.$queryRaw`
      SELECT DATE(created_at) as date, COUNT(*)::int as count
      FROM page_views
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    ` as Promise<{ date: Date; count: number }[]>,
  ]);

  return NextResponse.json({
    totalViews,
    views30d,
    views7d,
    todayViews,
    uniquePages: uniquePaths.length,
    topPages: topPages.map((p: { path: string; _count: { path: number } }) => ({ path: p.path, views: p._count.path })),
    viewsByDay,
  });
});