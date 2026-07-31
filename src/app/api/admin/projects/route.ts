import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const projects = await db.project.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (id) {
      const updated = await db.project.update({ where: { id }, data });
      await createAuditLog({ action: "UPDATE", entity: "Projet", entityId: updated.id, userId: session.user.id as string, details: JSON.stringify(data) });
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
    await createAuditLog({ action: "CREATE", entity: "Projet", entityId: project.id, userId: session.user.id as string });
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await db.project.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "Projet", entityId: id, userId: session.user.id as string });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
