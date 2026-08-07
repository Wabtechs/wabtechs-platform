import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async (req: Request) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const published = searchParams.get("published");

  const templates = await db.template.findMany({
    where: published ? { published: published === "true" } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(templates);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

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
        stripePriceId: data.stripePriceId ?? null,
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
    await createAuditLog({
      action: "UPDATE",
      entity: "Template",
      entityId: updated.id,
      userId: user.id as string,
    });
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
      stripePriceId: data.stripePriceId ?? null,
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
  await createAuditLog({
    action: "CREATE",
    entity: "Template",
    entityId: template.id,
    userId: user.id as string,
  });
  return NextResponse.json(template, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.template.delete({ where: { id } });
  await createAuditLog({
    action: "DELETE",
    entity: "Template",
    entityId: id,
    userId: user.id as string,
  });
  return NextResponse.json({ success: true });
});
