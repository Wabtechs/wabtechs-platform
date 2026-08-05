import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationLinks } from "@/components/shared/pagination-links";
import { Plus, Pencil, Bookmark } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeleteResourceButton } from "./delete-button";

export const metadata: Metadata = { title: "Gestion des ressources" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageRaw } = await searchParams;

  const currentPage = Math.max(1, Number(pageRaw) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [total, items] = await Promise.all([
    db.resource.count(),
    db.resource.findMany({
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <Bookmark className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <h1 className="dark:text-foreground text-xl font-semibold tracking-tight text-gray-900">
                Ressources
              </h1>
              <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                {total} ressources au total
              </p>
            </div>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-primary h-8 text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
        >
          <Link href="/admin/resources/new">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nouvelle ressource
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bookmark className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
              <p className="text-[13px] text-gray-500">Aucune ressource</p>
              <Link
                href="/admin/resources/new"
                className="text-primary mt-2 text-[12px] font-medium hover:underline"
              >
                Créer votre première ressource
              </Link>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="group border-border bg-card flex items-center justify-between rounded-xl border px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="dark:text-foreground truncate text-[14px] font-medium text-gray-900">
                    {item.title}
                  </p>
                  {item.type && (
                    <span className="bg-primary/[0.06] text-primary inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium">
                      {item.type}
                    </span>
                  )}
                  {item.published ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      Publié
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
                      Brouillon
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[12px] text-gray-400">
                  <span>{item.slug}</span>
                  <span>·</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="dark:hover:text-foreground h-8 w-8 text-gray-400 hover:text-gray-900"
                >
                  <Link href={`/admin/resources/${item.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <DeleteResourceButton id={item.id} />
              </div>
            </div>
          ))
        )}
      </div>

      <PaginationLinks
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/admin/resources"
      />
    </div>
  );
}
