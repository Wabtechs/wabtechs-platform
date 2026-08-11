import { createOsCrud } from "@/lib/os-crud";
import { db } from "@/lib/prisma";
import { safeHandler } from "@/lib/safe-handler";

const crud = createOsCrud({
  model: db.osProject as never,
  label: "Projet OS",
  writable: [
    "slug",
    "name",
    "description",
    "logo",
    "color",
    "type",
    "status",
    "version",
    "environment",
    "repoUrl",
    "docsUrl",
    "websiteUrl",
    "technologies",
    "githubStars",
    "githubForks",
    "githubIssues",
    "githubPrs",
    "githubCommits",
    "healthScore",
    "mrr",
  ],
  filterKeys: ["type", "status"],
  defaultOrderBy: { name: "asc" },
  include: {
    owner: { select: { id: true, name: true, email: true } },
    _count: {
      select: {
        features: true,
        bugs: true,
        objectives: true,
        modules: true,
        sprints: true,
        members: true,
      },
    },
  },
  defaults: (_data, user) => ({ ownerId: user.id }),
});

export const GET = safeHandler(crud.GET);
export const POST = safeHandler(crud.POST);
export const PATCH = safeHandler(crud.PATCH);
export const DELETE = safeHandler(crud.DELETE);
