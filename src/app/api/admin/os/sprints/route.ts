import { createOsCrud } from "@/lib/os-crud";
import { db } from "@/lib/prisma";

const crud = createOsCrud({
  model: db.sprint as never,
  label: "Sprint",
  filterKeys: ["projectId", "status"],
  include: {
    project: { select: { id: true, slug: true, name: true, color: true } },
    _count: { select: { features: true } },
  },
});

export const GET = crud.GET;
export const POST = crud.POST;
export const DELETE = crud.DELETE;
