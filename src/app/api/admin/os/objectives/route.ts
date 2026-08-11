import { createOsCrud } from "@/lib/os-crud";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";

const crud = createOsCrud({
  model: db.objective as never,
  label: "Objectif",
  writable: [
    "projectId",
    "assigneeId",
    "title",
    "description",
    "method",
    "target",
    "current",
    "progress",
    "status",
    "deadline",
  ],
  filterKeys: ["projectId", "status"],
  include: {
    project: { select: { id: true, slug: true, name: true, color: true } },
    assignee: { select: { id: true, name: true, email: true } },
    keyResults: true,
  },
});

export const GET = safeHandler(crud.GET);
export const POST = safeHandler(crud.POST);
export const PATCH = safeHandler(crud.PATCH);
export const DELETE = safeHandler(crud.DELETE);
