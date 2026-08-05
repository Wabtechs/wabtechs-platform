import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationLinks } from "@/components/shared/pagination-links";
import { Plus, Pencil, PlayCircle } from "lucide-react";
import { DeleteLessonButton } from "./delete-button";

export const metadata: Metadata = { title: "Gestion des leçons" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminLessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string; page?: string }>;
}) {
  const { courseId, page: pageRaw } = await searchParams;
  const courses = await db.course.findMany({ orderBy: { title: "asc" } });

  const currentPage = Math.max(1, Number(pageRaw) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [total, items] = await Promise.all([
    db.lesson.count({
      where: courseId ? { courseId } : undefined,
    }),
    db.lesson.findMany({
      where: courseId ? { courseId } : undefined,
      orderBy: [{ courseId: "asc" }, { order: "asc" }],
      include: { course: { select: { title: true } } },
      take: PAGE_SIZE,
      skip,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const title = courseId ? courses.find((c) => c.id === courseId)?.title : undefined;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <PlayCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h1 className="dark:text-foreground text-xl font-semibold tracking-tight text-gray-900">
                Leçons{title ? ` — ${title}` : ""}
              </h1>
              <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                {total} leçons au total
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={courseId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              window.location.href = v ? `/admin/lessons?courseId=${v}` : "/admin/lessons";
            }}
            className="dark:border-border dark:bg-muted dark:text-foreground h-8 rounded-md border border-gray-200 bg-gray-50 px-2 text-sm text-gray-900"
          >
            <option value="">Tous les cours</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <Button
            asChild
            size="sm"
            className="bg-primary h-8 text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
          >
            <Link href="/admin/lessons/new">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Nouvelle leçon
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <PlayCircle className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
              <p className="text-[13px] text-gray-500">Aucune leçon</p>
              <Link
                href="/admin/lessons/new"
                className="text-primary mt-2 text-[12px] font-medium hover:underline"
              >
                Créer votre première leçon
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
                  <span className="text-[12px] font-medium text-gray-400">#{item.order}</span>
                  <p className="dark:text-foreground truncate text-[14px] font-medium text-gray-900">
                    {item.title}
                  </p>
                  {item.free ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      Gratuite
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
                      Premium
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[12px] text-gray-400">
                  <span>{item.course?.title ?? "N/A"}</span>
                  <span>·</span>
                  <span>{item.duration} min</span>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="dark:hover:text-foreground h-8 w-8 text-gray-400 hover:text-gray-900"
                >
                  <Link href={`/admin/lessons/${item.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <DeleteLessonButton id={item.id} />
              </div>
            </div>
          ))
        )}
      </div>

      <PaginationLinks
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/admin/lessons"
        searchParams={{ courseId }}
      />
    </div>
  );
}
