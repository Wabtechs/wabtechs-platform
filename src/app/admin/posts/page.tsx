import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationLinks } from "@/components/shared/pagination-links";
import { Plus, Pencil, FileText, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeletePostButton } from "./delete-button";

export const metadata: Metadata = { title: "Gestion des articles" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageRaw } = await searchParams;

  const currentPage = Math.max(1, Number(pageRaw) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [total, posts] = await Promise.all([
    db.post.count(),
    db.post.findMany({
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
      include: { author: { select: { name: true } }, tags: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
              <FileText className="text-primary h-5 w-5" />
            </div>
            <div>
              <h1 className="dark:text-foreground text-xl font-semibold tracking-tight text-gray-900">
                Articles
              </h1>
              <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                {total} articles au total
              </p>
            </div>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-primary h-8 text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
        >
          <Link href="/admin/posts/new">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nouvel article
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        {posts.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
              <p className="text-[13px] text-gray-500">Aucun article</p>
              <Link
                href="/admin/posts/new"
                className="text-primary mt-2 text-[12px] font-medium hover:underline"
              >
                Créer votre premier article
              </Link>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="group border-border bg-card flex items-center justify-between rounded-xl border px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="dark:text-foreground truncate text-[14px] font-medium text-gray-900">
                    {post.title}
                  </p>
                  {post.published ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      Publié
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
                      Brouillon
                    </span>
                  )}
                  {post.featured && (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                      Featured
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[12px] text-gray-400">
                  <span>{post.author?.name ?? "Inconnu"}</span>
                  <span>·</span>
                  <span>{formatDate(post.createdAt)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views}
                  </span>
                </div>
                {post.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="bg-primary/[0.06] text-primary inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="ml-4 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="dark:hover:text-foreground h-8 w-8 text-gray-400 hover:text-gray-900"
                >
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <DeletePostButton id={post.id} />
              </div>
            </div>
          ))
        )}
      </div>

      <PaginationLinks currentPage={currentPage} totalPages={totalPages} basePath="/admin/posts" />
    </div>
  );
}
