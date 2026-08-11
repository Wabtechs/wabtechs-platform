import { NextResponse } from "next/server";
import { z } from "zod";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { AppError, ErrorCode } from "@/lib/errors";

type Delegate = {
  findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
  findUnique: (args: Record<string, unknown>) => Promise<unknown>;
  create: (args: Record<string, unknown>) => Promise<unknown>;
  update: (args: Record<string, unknown>) => Promise<unknown>;
  delete: (args: Record<string, unknown>) => Promise<unknown>;
};

type SessionUser = { id: string };

export interface OsCrudConfig {
  model: Delegate;
  label: string;
  writable: string[];
  filterKeys?: string[];
  defaultOrderBy?: Record<string, "asc" | "desc">;
  include?: Record<string, unknown>;
  defaults?: (data: Record<string, unknown>, user: SessionUser) => Record<string, unknown>;
  schema?: z.ZodType<Record<string, unknown>>;
}

const bodyIdSchema = z.object({ id: z.string().min(1) });

function pickWritable(data: Record<string, unknown>, writable: string[]): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const key of writable) {
    if (key in data && data[key] !== undefined) clean[key] = data[key];
  }
  return clean;
}

async function readBody(req: Request): Promise<Record<string, unknown>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new AppError("Le corps JSON envoyé est invalide.", 400, ErrorCode.BAD_REQUEST);
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new AppError("Le corps JSON envoyé est invalide.", 400, ErrorCode.BAD_REQUEST);
  }
  return body as Record<string, unknown>;
}

export function createOsCrud(config: OsCrudConfig) {
  const {
    model,
    label,
    writable,
    filterKeys = [],
    defaultOrderBy = { createdAt: "desc" },
    include,
    defaults,
    schema,
  } = config;

  async function withInclude(record: unknown, id: string): Promise<unknown> {
    if (!include) return record;
    const full = await model.findUnique({ where: { id }, include });
    return full ?? record;
  }

  async function prepare(data: Record<string, unknown>, user: SessionUser) {
    const clean = pickWritable(data, writable);
    if (schema) schema.parse(clean);
    const extra = defaults?.(data, user) ?? {};
    return { ...clean, ...extra };
  }

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

    const body = await readBody(req);
    const data = await prepare(body, { id: user.id as string });

    if (body.id) {
      const parsed = bodyIdSchema.parse(body);
      const updated = (await model.update({
        where: { id: parsed.id },
        data,
      })) as { id: string };
      await createAuditLog({
        action: "UPDATE",
        entity: label,
        entityId: updated.id,
        userId: user.id as string,
        details: JSON.stringify(data),
      });
      return NextResponse.json(await withInclude(updated, updated.id));
    }

    const created = (await model.create({ data })) as { id: string };
    await createAuditLog({
      action: "CREATE",
      entity: label,
      entityId: created.id,
      userId: user.id as string,
    });
    return NextResponse.json(await withInclude(created, created.id), { status: 201 });
  });

  const PATCH = safeHandler(async (req: Request) => {
    const user = await requireAdmin();

    const body = await readBody(req);
    const parsed = bodyIdSchema.parse(body);
    const data = await prepare(body, { id: user.id as string });

    const updated = (await model.update({
      where: { id: parsed.id },
      data,
    })) as { id: string };
    await createAuditLog({
      action: "UPDATE",
      entity: label,
      entityId: updated.id,
      userId: user.id as string,
      details: JSON.stringify(data),
    });
    return NextResponse.json(await withInclude(updated, updated.id));
  });

  const DELETE = safeHandler(async (req: Request) => {
    const user = await requireAdmin();

    const body = await readBody(req);
    const parsed = bodyIdSchema.parse(body);
    await model.delete({ where: { id: parsed.id } });
    await createAuditLog({
      action: "DELETE",
      entity: label,
      entityId: parsed.id,
      userId: user.id as string,
    });
    return NextResponse.json({ success: true });
  });

  return { GET, POST, PATCH, DELETE };
}
