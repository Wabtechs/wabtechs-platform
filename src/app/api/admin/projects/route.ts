import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

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
    const { id } = body;

    if (id) {
      const updated = await db.project.update({ where: { id }, data: body });
      return NextResponse.json(updated);
    }

    const project = await db.project.create({
      data: {
        title: body.title,
        description: body.description ?? "",
        slug: body.slug,
        longDescription: body.longDescription ?? null,
        coverImage: body.coverImage ?? null,
        githubUrl: body.githubUrl ?? null,
        demoUrl: body.demoUrl ?? null,
        techStack: body.techStack ?? [],
        featured: body.featured ?? false,
      },
    });
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
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
