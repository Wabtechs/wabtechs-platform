import { createOsCrud } from "@/lib/os-crud";
import { db } from "@/lib/prisma";

const crud = createOsCrud({
  model: db.roadmapItem as never,
  label: "Roadmap Item",
  filterKeys: ["projectId"],
  include: {
    project: { select: { id: true, slug: true, name: true, color: true } },
  },
});

export const GET = crud.GET;
export const POST = crud.POST;
export const DELETE = crud.DELETE;
