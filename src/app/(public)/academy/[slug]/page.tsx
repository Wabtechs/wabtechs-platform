import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { EnrollButton } from "@/components/academy/enroll-button";
import { auth } from "@/auth";
import { Clock, Users, PlayCircle, CheckCircle2, Lock, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await db.course.findUnique({ where: { slug } });
  if (!course) return { title: "Cours introuvable" };
  return {
    title: course.title,
    description: course.description,
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      lessons: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });
  if (!course) notFound();

  const enrollment = session?.user
    ? await db.enrollment.findUnique({
        where: {
          userId_courseId: { userId: session.user.id as string, courseId: course.id },
        },
      })
    : null;

  const isEnrolled = !!enrollment;

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/academy">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'Academy
          </Link>
        </Button>

        <PageHeader
          badge={`Niveau : ${course.level}`}
          title={course.title}
          highlight=""
          description={course.description}
        />

        <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <PlayCircle className="h-4 w-4" />
            {course.lessons.length} leçons
          </span>
          {course.duration && (
            <>
              <span className="text-white/10">·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {course.duration}
              </span>
            </>
          )}
          <span className="text-white/10">·</span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {course._count.enrollments} inscrits
          </span>
          <span className="text-white/10">·</span>
          {Number(course.price) === 0 ? (
            <Badge className="bg-emerald-500/15 text-emerald-500">Gratuit</Badge>
          ) : (
            <Badge>{Number(course.price)}€</Badge>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          {isEnrolled ? (
            <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600">
              <Link href={`/academy/${course.slug}/lessons`}>
                <PlayCircle className="mr-2 h-4 w-4" />
                Continuer le cours
              </Link>
            </Button>
          ) : (
            <EnrollButton courseId={course.id} />
          )}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Programme</h2>
          <div className="mt-6 space-y-3">
            {course.lessons.length === 0 ? (
              <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                  Les leçons de ce cours seront bientôt disponibles.
                </CardContent>
              </Card>
            ) : (
              course.lessons.map((lesson, i) => {
                const locked = !lesson.free && !isEnrolled;
                return (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white px-5 py-4 dark:border-border dark:bg-card"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[12px] font-semibold text-primary">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-medium text-gray-900 dark:text-foreground">
                          {lesson.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-[12px] text-gray-400">
                          <span>{lesson.duration} min</span>
                          {lesson.free && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                              Gratuite
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {locked ? (
                      <Lock className="ml-4 h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
                    ) : isEnrolled && lesson.videoUrl ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-foreground"
                      >
                        <Link href={`/academy/${course.slug}/lessons/${lesson.id}`}>
                          <PlayCircle className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <CheckCircle2 className="ml-4 h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
