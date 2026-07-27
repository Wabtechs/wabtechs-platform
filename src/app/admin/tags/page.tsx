import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { TagsClient } from "./tags-client";

export const metadata: Metadata = { title: "Gestion des tags" };
export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const tags = await db.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true, podcasts: true } } },
  });

  return <TagsClient tags={tags} />;
}
