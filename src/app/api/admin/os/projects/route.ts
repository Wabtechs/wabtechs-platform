import { createOsCrud } from "@/lib/os-crud";
import { db } from "@/lib/prisma";

const crud = createOsCrud({
  model: db.osProject as never,
  label: "Projet OS",
  filterKeys: ["type", "status"],
  defaultOrderBy: { name: "asc" },
  stripKeys: ["owner", "members", "epics", "sprints", "modules", "features", "bugs", "objectives", "releases", "milestones", "roadmapItems", "metricSnapshots"],
  include: {
    owner: { select: { id: true, name: true, email: true } },
    _count: {
      select: { features: true, bugs: true, objectives: true, modules: true, sprints: true, members: true },
    },
  },
  defaults: (_data, session) => ({ ownerId: session.user.id }),
});

export const GET = crud.GET;
export const POST = crud.POST;
export const DELETE = crud.DELETE;
