import type { MetadataRoute } from "next";

const BASE_URL = "https://wabtechs.com";

const routes = [
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

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
