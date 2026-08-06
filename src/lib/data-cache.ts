import { unstable_cache } from "next/cache";
import { db } from "@/lib/prisma";

export const getHomeData = unstable_cache(
  async () => {
    const [services, skills, resumeItems, pricingPlans, testimonials, clients] = await Promise.all([
      db.service.findMany({ orderBy: { order: "asc" } }),
      db.skill.findMany({ orderBy: { order: "asc" } }),
      db.resumeItem.findMany({ orderBy: { order: "asc" } }),
      db.pricingPlan.findMany({ orderBy: { order: "asc" } }),
      db.testimonial.findMany({ orderBy: { order: "asc" } }),
      db.client.findMany({ orderBy: { order: "asc" } }),
    ]);
    return { services, skills, resumeItems, pricingPlans, testimonials, clients };
  },
  ["home"],
  { revalidate: 300, tags: ["home-data"] },
);

export const getPublicProjects = unstable_cache(
  async () =>
    db.project.findMany({
      where: { archived: false },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
  ["public-projects"],
  { revalidate: 60, tags: ["public-projects"] },
);
