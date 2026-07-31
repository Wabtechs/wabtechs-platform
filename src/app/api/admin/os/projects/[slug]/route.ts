import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const project = await db.osProject.findUnique({
      where: { slug },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        modules: true,
        epics: { include: { _count: { select: { features: true } } } },
        sprints: { include: { _count: { select: { features: true } } } },
        releases: true,
        milestones: true,
        roadmapItems: true,
        features: {
          include: {
            module: { select: { id: true, name: true } },
            epic: { select: { id: true, name: true } },
            assignee: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        bugs: {
          include: { assignee: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
        objectives: {
          include: { keyResults: true, assignee: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
        metricSnapshots: { orderBy: { date: "asc" } },
      },
    });

    if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await req.json();
    const strip = new Set(["id", "createdAt", "updatedAt", "owner", "members", "epics", "sprints", "modules", "features", "bugs", "objectives", "releases", "milestones", "roadmapItems", "metricSnapshots"]);
    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (!strip.has(key) && value !== undefined) data[key] = value;
    }

    const project = await db.osProject.update({ where: { slug }, data });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
