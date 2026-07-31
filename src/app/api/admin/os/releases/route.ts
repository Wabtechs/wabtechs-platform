import { createOsCrud } from "@/lib/os-crud";
import { db } from "@/lib/prisma";

const crud = createOsCrud({
  model: db.release as never,
  label: "Release",
  filterKeys: ["projectId"],
  include: {
    project: { select: { id: true, slug: true, name: true, color: true } },
  },
});

export const GET = crud.GET;
export const POST = crud.POST;
export const DELETE = crud.DELETE;
