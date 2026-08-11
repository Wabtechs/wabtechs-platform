import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { AppError, ErrorCode } from "@/lib/errors";
import { createAuditLog } from "@/lib/audit";

const nullableUrl = z
  .string()
  .trim()
  .url("L’URL doit être valide.")
  .nullable()
  .optional()
  .or(z.literal("").transform(() => null));

const projectPatchSchema = z
  .object({
    slug: z.string().min(2).max(120).optional(),
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).optional(),
    logo: z.string().max(500).nullable().optional(),
    color: z.string().max(40).optional(),
    type: z.enum(["PLATFORM", "APP", "LIBRARY", "TOOL", "SERVICE", "OTHER"]).optional(),
    status: z.enum(["PLANNING", "ACTIVE", "PAUSED", "MAINTENANCE", "ARCHIVED"]).optional(),
    version: z.string().max(40).optional(),
    environment: z.string().max(80).optional(),
    repoUrl: nullableUrl,
    docsUrl: nullableUrl,
    websiteUrl: nullableUrl,
    technologies: z.string().max(1000).nullable().optional(),
    githubStars: z.number().int().min(0).max(100000).optional(),
    githubForks: z.number().int().min(0).max(100000).optional(),
    githubIssues: z.number().int().min(0).max(100000).optional(),
    githubPrs: z.number().int().min(0).max(100000).optional(),
    githubCommits: z.number().int().min(0).max(10000000).optional(),
    healthScore: z.number().int().min(0).max(100).optional(),
    mrr: z.number().min(0).optional(),
  })
  .strict();

function extractSlug(req: Request): string {
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/");
  const projectsIndex = pathParts.indexOf("projects");
  if (projectsIndex >= 0 && projectsIndex + 1 < pathParts.length) {
    const slug = pathParts[projectsIndex + 1];
    if (slug) return slug;
  }
  throw new AppError("Identifiant du projet manquant.", 400, ErrorCode.BAD_REQUEST);
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
    throw new AppError("Projet introuvable ou supprimé.", 404, ErrorCode.NOT_FOUND);
  }
  return NextResponse.json(project);
});

export const PATCH = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const slug = extractSlug(req);
  const body = await req.json();
  const data = projectPatchSchema.parse(body);

  const existing = await db.osProject.findUnique({ where: { slug } });
  if (!existing) {
    throw new AppError("Projet introuvable ou supprimé.", 404, ErrorCode.NOT_FOUND);
  }

  const project = await db.osProject.update({ where: { slug }, data });
  await createAuditLog({
    action: "UPDATE",
    entity: "Projet OS",
    entityId: project.id,
    userId: user.id as string,
    details: JSON.stringify(data),
  });
  return NextResponse.json(project);
});
