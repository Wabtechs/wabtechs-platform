import { createOsCrud } from "@/lib/os-crud";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";

const crud = createOsCrud({
  model: db.roadmapItem as never,
  label: "Roadmap Item",
  writable: [
    "projectId",
    "title",
    "description",
    "type",
    "status",
    "priority",
    "progress",
    "startDate",
    "endDate",
    "estimatedHours",
    "actualHours",
    "roi",
    "impact",
    "dependencies",
    "risks",
  ],
  filterKeys: ["projectId"],
  include: {
    project: { select: { id: true, slug: true, name: true, color: true } },
  },
});

export const GET = safeHandler(crud.GET);
export const POST = safeHandler(crud.POST);
export const PATCH = safeHandler(crud.PATCH);
export const DELETE = safeHandler(crud.DELETE);
