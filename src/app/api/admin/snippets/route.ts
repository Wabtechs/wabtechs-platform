import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = safeHandler(async () => {
  await requireAdmin();

  const snippets = await db.snippet.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(snippets);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const body = await req.json();
  const { id, ...data } = body;

  if (id) {
    const updated = await db.snippet.update({ where: { id }, data });
    await createAuditLog({ action: "UPDATE", entity: "Snippet", entityId: updated.id, userId: user.id as string, details: JSON.stringify(data) });
    return NextResponse.json(updated);
  }

  const snippet = await db.snippet.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      language: data.language ?? null,
      code: data.code,
      published: data.published ?? false,
    },
  });
  await createAuditLog({ action: "CREATE", entity: "Snippet", entityId: snippet.id, userId: user.id as string });
  return NextResponse.json(snippet, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  const user = await requireAdmin();

  const { id } = await req.json();
  await db.snippet.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Snippet", entityId: id, userId: user.id as string });
  return NextResponse.json({ success: true });
});
