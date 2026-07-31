import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const published = searchParams.get("published");

  try {
    const templates = await db.template.findMany({
      where: published ? { published: published === "true" } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(templates);
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
      const updated = await db.template.update({
        where: { id },
        data: {
          slug: data.slug,
          name: data.name,
          description: data.description,
          longDescription: data.longDescription ?? null,
          image: data.image ?? null,
          price: data.price ?? 0,
          category: data.category ?? "starter",
          stack: data.stack ?? null,
          demoUrl: data.demoUrl ?? null,
          repoUrl: data.repoUrl ?? null,
          downloadUrl: data.downloadUrl ?? null,
          version: data.version ?? "1.0.0",
          published: data.published ?? false,
          featured: data.featured ?? false,
        },
      });
      await createAuditLog({ action: "UPDATE", entity: "Template", entityId: updated.id, userId: session.user.id as string });
      return NextResponse.json(updated);
    }

    const template = await db.template.create({
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        longDescription: data.longDescription ?? null,
        image: data.image ?? null,
        price: data.price ?? 0,
        category: data.category ?? "starter",
        stack: data.stack ?? null,
        demoUrl: data.demoUrl ?? null,
        repoUrl: data.repoUrl ?? null,
        downloadUrl: data.downloadUrl ?? null,
        version: data.version ?? "1.0.0",
        published: data.published ?? false,
        featured: data.featured ?? false,
      },
    });
    await createAuditLog({ action: "CREATE", entity: "Template", entityId: template.id, userId: session.user.id as string });
    return NextResponse.json(template, { status: 201 });
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
    await db.template.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "Template", entityId: id, userId: session.user.id as string });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
