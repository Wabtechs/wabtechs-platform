import { createOsCrud } from "@/lib/os-crud";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";

const crud = createOsCrud({
  model: db.release as never,
  label: "Release",
  writable: ["projectId", "name", "version", "description", "status", "releasedAt"],
  filterKeys: ["projectId"],
  include: {
    project: { select: { id: true, slug: true, name: true, color: true } },
  },
});

export const GET = safeHandler(crud.GET);
export const POST = safeHandler(crud.POST);
export const PATCH = safeHandler(crud.PATCH);
export const DELETE = safeHandler(crud.DELETE);
