import { createOsCrud } from "@/lib/os-crud";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";

const crud = createOsCrud({
  model: db.sprint as never,
  label: "Sprint",
  writable: ["projectId", "name", "goal", "startDate", "endDate", "status", "velocity"],
  filterKeys: ["projectId", "status"],
  include: {
    project: { select: { id: true, slug: true, name: true, color: true } },
    _count: { select: { features: true } },
  },
});

export const GET = safeHandler(crud.GET);
export const POST = safeHandler(crud.POST);
export const PATCH = safeHandler(crud.PATCH);
export const DELETE = safeHandler(crud.DELETE);
