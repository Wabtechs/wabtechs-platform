import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { SITE_CONFIG } from "@/lib/utils";
import { db } from "@/lib/prisma";

const STATIC_ROUTES = [
  "",
  "/about",
  "/academy",
  "/blog",
  "/changelog",
  "/community",
  "/contact",
  "/docs",
  "/downloads",
  "/events",
  "/faq",
  "/newsletter",
  "/open-source",
  "/podcast",
  "/pricing",
  "/privacy",
  "/projects",
  "/resources",
  "/roadmaps",
  "/snippets",
  "/sponsors",
  "/support",
  "/templates",
  "/terms",
  "/tutorials",
  "/videos",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  const [posts, templates, courses, projects] = await Promise.all([
    db.post.findMany({
      where: { published: true },
      select: { slug: true, publishedAt: true, updatedAt: true },
    }),
    db.template.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    db.course.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    db.project.findMany({
      where: { archived: false },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_CONFIG.url}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    lastModified: post.publishedAt ?? post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const templateEntries: MetadataRoute.Sitemap = templates.map((t) => ({
    url: `${SITE_CONFIG.url}/templates/${t.slug}`,
    lastModified: t.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const courseEntries: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${SITE_CONFIG.url}/academy/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_CONFIG.url}/projects/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...postEntries,
    ...templateEntries,
    ...courseEntries,
    ...projectEntries,
  ];
}
