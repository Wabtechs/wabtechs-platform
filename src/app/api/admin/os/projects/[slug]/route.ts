import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { AppError, ErrorCode } from "@/lib/errors";

function extractSlug(req: Request): string {
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/");
  const projectsIndex = pathParts.indexOf("projects");
  if (projectsIndex >= 0 && projectsIndex + 1 < pathParts.length) {
    const slug = pathParts[projectsIndex + 1];
    if (slug) return slug;
  }
  throw new AppError("Slug manquant", 400, ErrorCode.BAD_REQUEST);
}

export const GET = safeHandler(async (req: Request) => {
  await requireAdmin();

  const slug = extractSlug(req);
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

  if (!project) {
    throw new AppError("Projet introuvable", 404, ErrorCode.NOT_FOUND);
  }
  return NextResponse.json(project);
});

export const PATCH = safeHandler(async (req: Request) => {
  await requireAdmin();

  const slug = extractSlug(req);
  const body = await req.json();
  const strip = new Set(["id", "createdAt", "updatedAt", "owner", "members", "epics", "sprints", "modules", "features", "bugs", "objectives", "releases", "milestones", "roadmapItems", "metricSnapshots"]);
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (!strip.has(key) && value !== undefined) data[key] = value;
  }

  const project = await db.osProject.update({ where: { slug }, data });
  return NextResponse.json(project);
});
