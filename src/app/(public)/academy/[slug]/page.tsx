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
import { Clock, Users, PlayCircle, CheckCircle2, Lock, ArrowLeft, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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
            Retour à l&apos;Academy
          </Link>
        </Button>

        <PageHeader
          badge={`Niveau : ${course.level}`}
          title={course.title}
          highlight=""
          description={course.description}
        />

        <div className="text-muted-foreground mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-3 text-sm">
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
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-sm">
                <div className="text-muted-foreground mb-1.5 flex items-center justify-between text-[12px]">
                  <span>Progression</span>
                  <span className="font-medium">{enrollment?.progress ?? 0}%</span>
                </div>
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${enrollment?.progress ?? 0}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                  <Link href={`/academy/${course.slug}/lessons`}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Continuer le cours
                  </Link>
                </Button>
                {enrollment?.completed && (
                  <Button asChild size="lg" variant="outline">
                    <Link href={`/api/academy/certificate?courseId=${course.id}`}>
                      <Award className="text-primary mr-2 h-4 w-4" />
                      Télécharger le certificat
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <EnrollButton courseId={course.id} />
          )}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Programme</h2>
          <div className="mt-6 space-y-3">
            {course.lessons.length === 0 ? (
              <Card className="dark:border-border dark:bg-card border-gray-200/80 bg-white">
                <CardContent className="text-muted-foreground py-12 text-center text-sm">
                  Les leçons de ce cours seront bientôt disponibles.
                </CardContent>
              </Card>
            ) : (
              course.lessons.map((lesson, i) => {
                const locked = !lesson.free && !isEnrolled;
                return (
                  <div
                    key={lesson.id}
                    className="dark:border-border dark:bg-card flex items-center justify-between rounded-xl border border-gray-200/80 bg-white px-5 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[12px] font-semibold">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="dark:text-foreground truncate text-[14px] font-medium text-gray-900">
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
                        className="dark:hover:text-foreground h-8 w-8 text-gray-400 hover:text-gray-900"
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
