import type { MetadataRoute } from "next";
import { getAllPosts, getAllDocs } from "@/lib/mdx";
import { db } from "@/lib/prisma";

const BASE_URL = "https://wabtechs.com";

const staticRoutes = [
  "",
  "/about",
  "/blog",
  "/docs",
  "/projects",
  "/podcast",
  "/videos",
  "/snippets",
  "/resources",
  "/downloads",
  "/community",
  "/newsletter",
  "/faq",
  "/events",
  "/open-source",
  "/roadmaps",
  "/tutorials",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" as const : "monthly" as const,
    priority:
      route === "" ? 1.0 :
      route === "/blog" ? 0.8 :
      route === "/docs" || route === "/projects" ? 0.7 :
      0.5,
  }));

  const blogEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const docEntries: MetadataRoute.Sitemap = getAllDocs().map((doc) => ({
    url: `${BASE_URL}/docs/${doc.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  let projectEntries: MetadataRoute.Sitemap = [];
  try {
    const projects = await db.project.findMany({ select: { slug: true, updatedAt: true } });
    projectEntries = projects.map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {}

  let podcastEntries: MetadataRoute.Sitemap = [];
  try {
    const podcasts = await db.podcast.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
    podcastEntries = podcasts.map((p) => ({
      url: `${BASE_URL}/podcast/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {}

  let videoEntries: MetadataRoute.Sitemap = [];
  try {
    const videos = await db.video.findMany({ select: { slug: true, updatedAt: true } });
    videoEntries = videos.map((v) => ({
      url: `${BASE_URL}/videos/${v.slug}`,
      lastModified: v.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {}

  let tutorialEntries: MetadataRoute.Sitemap = [];
  try {
    const tutorials = await db.tutorial.findMany({ select: { slug: true, updatedAt: true } });
    tutorialEntries = tutorials.map((t) => ({
      url: `${BASE_URL}/tutorials/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {}

  let eventEntries: MetadataRoute.Sitemap = [];
  try {
    const events = await db.event.findMany({ select: { slug: true, updatedAt: true } });
    eventEntries = events.map((e) => ({
      url: `${BASE_URL}/events/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {}

  let changelogEntries: MetadataRoute.Sitemap = [];
  try {
    const changelogs = await db.changelog.findMany({ select: { slug: true, updatedAt: true } });
    changelogEntries = changelogs.map((c) => ({
      url: `${BASE_URL}/changelog/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {}

  return [...staticEntries, ...blogEntries, ...docEntries, ...projectEntries, ...podcastEntries, ...videoEntries, ...tutorialEntries, ...eventEntries, ...changelogEntries];
}
