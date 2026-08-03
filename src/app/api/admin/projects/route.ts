import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();

  const projects = await db.project.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(projects);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const body = await req.json();
  const { id, ...data } = body;

  if (id) {
    const updated = await db.project.update({ where: { id }, data });
    await createAuditLog({ action: "UPDATE", entity: "Projet", entityId: updated.id, userId: user.id as string, details: JSON.stringify(data) });
    return NextResponse.json(updated);
  }

  const project = await db.project.create({
    data: {
      title: data.title,
      description: data.description ?? "",
      slug: data.slug,
      longDescription: data.longDescription ?? null,
      coverImage: data.coverImage ?? null,
      githubUrl: data.githubUrl ?? null,
      demoUrl: data.demoUrl ?? null,
      techStack: data.techStack ?? [],
      featured: data.featured ?? false,
      metaTitle: data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,
      ogImage: data.ogImage ?? null,
    },
  });
  await createAuditLog({ action: "CREATE", entity: "Projet", entityId: project.id, userId: user.id as string });
  return NextResponse.json(project, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.project.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Projet", entityId: id, userId: user.id as string });
  return NextResponse.json({ success: true });
});