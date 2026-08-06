import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { LessonCompleteButton } from "@/components/academy/lesson-complete-button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = await db.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return { title: "Leçon introuvable" };
  return { title: lesson.title };
}

function getYouTubeId(url: string | null) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const session = await auth();

  const course = await db.course.findUnique({ where: { slug } });
  if (!course) notFound();

  const lesson = await db.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson || lesson.courseId !== course.id) notFound();

  const enrollment = session?.user
    ? await db.enrollment.findUnique({
        where: {
          userId_courseId: { userId: session.user.id as string, courseId: course.id },
        },
      })
    : null;

  const isEnrolled = !!enrollment;
  const locked = !lesson.free && !isEnrolled;

  if (locked) redirect(`/academy/${slug}`);

  const lessons = await db.lesson.findMany({
    where: { courseId: course.id },
    orderBy: { order: "asc" },
  });
  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  const lessonProgress = session?.user
    ? await db.lessonProgress.findUnique({
        where: { userId_lessonId: { userId: session.user.id as string, lessonId: lesson.id } },
      })
    : null;

  const youtubeId = getYouTubeId(lesson.videoUrl);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href={`/academy/${slug}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {course.title}
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Leçon {idx + 1} sur {lessons.length}
          {lesson.duration > 0 ? ` · ${lesson.duration} min` : ""}
        </p>

        {youtubeId && (
          <div className="border-border mt-8 overflow-hidden rounded-2xl border bg-black">
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        {lesson.content && (
          <div className="prose prose-gray dark:prose-invert prose-headings:tracking-tight mt-10 max-w-none">
            {lesson.content.split(/\n\n+/).map((block, i) =>
              block.startsWith("# ") ? (
                <h2 key={i} className="text-2xl font-bold">
                  {block.slice(2)}
                </h2>
              ) : block.startsWith("## ") ? (
                <h3 key={i} className="text-xl font-bold">
                  {block.slice(3)}
                </h3>
              ) : (
                <p key={i} className="text-muted-foreground mb-4 text-[15px] leading-relaxed">
                  {block}
                </p>
              ),
            )}
          </div>
        )}

        <div className="mt-12 flex items-center justify-between">
          {prev ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/academy/${slug}/lessons/${prev.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Précédent
              </Link>
            </Button>
          ) : (
            <span />
          )}
          <LessonCompleteButton lessonId={lesson.id} initialWatched={!!lessonProgress} />
          {next ? (
            <Button size="sm" asChild>
              <Link href={`/academy/${slug}/lessons/${next.id}`}>
                Suivant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/academy/${slug}`}>
                Terminer le cours
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
