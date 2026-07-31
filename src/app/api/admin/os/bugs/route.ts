import { createOsCrud } from "@/lib/os-crud";
import { db } from "@/lib/prisma";

const crud = createOsCrud({
  model: db.bug as never,
  label: "Bug",
  filterKeys: ["projectId", "status", "severity"],
  include: {
    project: { select: { id: true, slug: true, name: true, color: true } },
    assignee: { select: { id: true, name: true, email: true } },
  },
});

export const GET = crud.GET;
export const POST = crud.POST;
export const DELETE = crud.DELETE;
