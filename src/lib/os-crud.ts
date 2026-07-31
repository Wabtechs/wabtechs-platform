import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";

type Delegate = {
  findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
  findUnique: (args: Record<string, unknown>) => Promise<unknown>;
  create: (args: Record<string, unknown>) => Promise<unknown>;
  update: (args: Record<string, unknown>) => Promise<unknown>;
  delete: (args: Record<string, unknown>) => Promise<unknown>;
};

export interface OsCrudConfig {
  model: Delegate;
  label: string;
  filterKeys?: string[];
  defaultOrderBy?: Record<string, "asc" | "desc">;
  include?: Record<string, unknown>;
  stripKeys?: string[];
  defaults?: (data: Record<string, unknown>, session: { user: { id: string } }) => Record<string, unknown>;
}

function sanitize(data: Record<string, unknown>, stripKeys: string[]): Record<string, unknown> {
  const strip = new Set(["id", "createdAt", "updatedAt", ...stripKeys]);
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (strip.has(key) || value === undefined) continue;
    clean[key] = value;
  }
  return clean;
}

export function createOsCrud(config: OsCrudConfig) {
  const {
    model,
    label,
    filterKeys = [],
    defaultOrderBy = { createdAt: "desc" },
    include,
    stripKeys = [],
    defaults,
  } = config;

  async function guard() {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") return null;
    return session;
  }

  async function GET(req: Request) {
    const session = await guard();
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    try {
      const url = new URL(req.url);
      const where: Record<string, unknown> = {};
      for (const key of filterKeys) {
        const value = url.searchParams.get(key);
        if (value) where[key] = value;
      }
      const items = await model.findMany({
        where: { ...where },
        orderBy: defaultOrderBy,
        ...(include ? { include } : {}),
      });
      return NextResponse.json(items);
    } catch {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }

  async function POST(req: Request) {
    const session = await guard();
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    try {
      const body = await req.json();
      const data = sanitize(body, stripKeys);
      const extra = defaults?.(body, session as { user: { id: string } }) ?? {};
      const userId = session.user?.id ?? "";

      if (body.id) {
        const updated = (await model.update({
          where: { id: body.id },
          data,
        })) as { id: string };
        await createAuditLog({ action: "UPDATE", entity: label, entityId: updated.id, userId, details: JSON.stringify(data) });
        return NextResponse.json(updated);
      }

      const created = (await model.create({ data: { ...data, ...extra } })) as { id: string };
      await createAuditLog({ action: "CREATE", entity: label, entityId: created.id, userId });
      return NextResponse.json(created, { status: 201 });
    } catch {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }

  async function DELETE(req: Request) {
    const session = await guard();
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    try {
      const { id } = await req.json();
      await model.delete({ where: { id } });
      await createAuditLog({ action: "DELETE", entity: label, entityId: id, userId: session.user?.id ?? "" });
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }

  return { GET, POST, DELETE };
}
