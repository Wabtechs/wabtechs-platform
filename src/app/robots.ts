import type { MetadataRoute } from "next";

const SITEMAP_URL = "https://wabtechs.com/sitemap.xml";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block admin panel and internal API routes from crawling
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: SITEMAP_URL,
  };
}
