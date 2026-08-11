import { createOsCrud } from "@/lib/os-crud";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";

const crud = createOsCrud({
  model: db.bug as never,
  label: "Bug",
  writable: [
    "projectId",
    "featureId",
    "assigneeId",
    "title",
    "description",
    "severity",
    "priority",
    "status",
    "version",
    "reproduce",
    "expected",
    "actual",
    "fix",
    "impact",
    "fixHours",
    "resolvedAt",
  ],
  filterKeys: ["projectId", "status", "severity"],
  include: {
    project: { select: { id: true, slug: true, name: true, color: true } },
    assignee: { select: { id: true, name: true, email: true } },
  },
});

export const GET = safeHandler(crud.GET);
export const POST = safeHandler(crud.POST);
export const PATCH = safeHandler(crud.PATCH);
export const DELETE = safeHandler(crud.DELETE);
