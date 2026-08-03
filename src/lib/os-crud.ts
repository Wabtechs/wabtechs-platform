import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";

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

  const GET = safeHandler(async (req: Request) => {
    await requireAdmin();

    const url = new URL(req.url);
    const where: Record<string, unknown> = {};
    for (const key of filterKeys) {
      const value = url.searchParams.get(key);
      if (value) where[key] = value;
    }
    const items = await model.findMany({
      where,
      orderBy: defaultOrderBy,
      ...(include ? { include } : {}),
    });
    return NextResponse.json(items);
  });

  const POST = safeHandler(async (req: Request) => {
    const user = await requireAdmin();
    const session = await auth();

    const body = await req.json();
    const data = sanitize(body, stripKeys);
    const extra = defaults?.(body, session as { user: { id: string } }) ?? {};

    if (body.id) {
      const updated = (await model.update({
        where: { id: body.id },
        data,
      })) as { id: string };
      await createAuditLog({ action: "UPDATE", entity: label, entityId: updated.id, userId: user.id as string, details: JSON.stringify(data) });
      return NextResponse.json(updated);
    }

    const created = (await model.create({ data: { ...data, ...extra } })) as { id: string };
    await createAuditLog({ action: "CREATE", entity: label, entityId: created.id, userId: user.id as string });
    return NextResponse.json(created, { status: 201 });
  });

  const DELETE = safeHandler(async (req: Request) => {
    const user = await requireAdmin();

    const { id } = await req.json();
    await model.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: label, entityId: id, userId: user.id as string });
    return NextResponse.json({ success: true });
  });

  return { GET, POST, DELETE };
}