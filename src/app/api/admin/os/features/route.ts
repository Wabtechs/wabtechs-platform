import { createOsCrud } from "@/lib/os-crud";
import { db } from "@/lib/prisma";

const crud = createOsCrud({
  model: db.feature as never,
  label: "Feature",
  filterKeys: ["projectId", "moduleId", "sprintId", "status", "epicId"],
  include: {
    project: { select: { id: true, slug: true, name: true, color: true } },
    module: { select: { id: true, name: true } },
    epic: { select: { id: true, name: true } },
    assignee: { select: { id: true, name: true, email: true } },
  },
});

export const GET = crud.GET;
export const POST = crud.POST;
export const DELETE = crud.DELETE;
