import { createOsCrud } from "@/lib/os-crud";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";

const crud = createOsCrud({
  model: db.feature as never,
  label: "Feature",
  writable: [
    "projectId",
    "moduleId",
    "epicId",
    "sprintId",
    "assigneeId",
    "title",
    "description",
    "priority",
    "status",
    "points",
  ],
  filterKeys: ["projectId", "moduleId", "sprintId", "status", "epicId"],
  include: {
    project: { select: { id: true, slug: true, name: true, color: true } },
    module: { select: { id: true, name: true } },
    epic: { select: { id: true, name: true } },
    assignee: { select: { id: true, name: true, email: true } },
  },
});

export const GET = safeHandler(crud.GET);
export const POST = safeHandler(crud.POST);
export const PATCH = safeHandler(crud.PATCH);
export const DELETE = safeHandler(crud.DELETE);
