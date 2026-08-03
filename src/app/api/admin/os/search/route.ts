import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async (req: Request) => {
  await requireAdmin();

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ projects: [], features: [], bugs: [], roadmap: [] });

  const [projects, features, bugs, roadmap] = await Promise.all([
    db.osProject.findMany({ where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }] }, take: 5 }),
    db.feature.findMany({
      where: { title: { contains: q, mode: "insensitive" } },
      take: 8,
      include: { project: { select: { slug: true, name: true, color: true } } },
    }),
    db.bug.findMany({
      where: { title: { contains: q, mode: "insensitive" } },
      take: 8,
      include: { project: { select: { slug: true, name: true, color: true } } },
    }),
    db.roadmapItem.findMany({
      where: { title: { contains: q, mode: "insensitive" } },
      take: 8,
      include: { project: { select: { slug: true, name: true, color: true } } },
    }),
  ]);

  return NextResponse.json({ projects, features, bugs, roadmap });
});