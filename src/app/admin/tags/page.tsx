import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { TagsClient } from "./tags-client";

export const metadata: Metadata = { title: "Gestion des tags" };

export default async function AdminTagsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  const tags = await db.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true, podcasts: true } } },
  });

  return <TagsClient tags={tags} />;
}
