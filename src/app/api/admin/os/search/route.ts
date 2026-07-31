import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
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
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
