import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Clock, PlayCircle, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Academy",
  description: "Apprenez à créer des projets open source avec les cours et tutoriels Wabtechs.",
};

export const dynamic = "force-dynamic";

export default async function AcademyPage() {
  const courses = await db.course.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: { _count: { select: { lessons: true, enrollments: true } } },
  });

  const totalLessons = courses.reduce((sum, c) => sum + c._count.lessons, 0);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Academy"
          title="Apprenez,"
          highlight="construisez"
          description="Des cours pratiques pour maîtriser le développement open source : React, Next.js, DevOps et plus encore. Parfait pour les débutants comme pour les développeurs confirmés."
        />

        <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <span>{courses.length} cours</span>
          <span className="text-white/10">·</span>
          <span>{totalLessons} leçons</span>
          <span className="text-white/10">·</span>
          <span>Gratuit et premium</span>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.length === 0 ? (
            <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card md:col-span-2 lg:col-span-3">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <PlayCircle className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
                <p className="text-[13px] text-gray-500">Les cours arrivent bientôt</p>
              </CardContent>
            </Card>
          ) : (
            courses.map((course) => (
              <Card
                key={course.id}
                className="group flex flex-col overflow-hidden border-gray-200/80 bg-white transition-all hover:shadow-lg dark:border-border dark:bg-card"
              >
                <div className="relative h-40 bg-gradient-to-br from-[#1F1F1F] to-[#2a2a2a]">
                  {course.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <PlayCircle className="h-10 w-10 text-primary/60" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <Badge className="capitalize bg-black/40 backdrop-blur-sm">{course.level}</Badge>
                    {Number(course.price) === 0 ? (
                      <Badge className="bg-emerald-500/80 backdrop-blur-sm">Gratuit</Badge>
                    ) : (
                      <Badge className="bg-primary/80 backdrop-blur-sm">{Number(course.price)}€</Badge>
                    )}
                  </div>
                </div>
                <CardContent className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight">
                    {course.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                    {course.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="h-3.5 w-3.5" />
                      {course._count.lessons} leçons
                    </span>
                    {course.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {course.duration}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {course._count.enrollments}
                    </span>
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-5 w-full">
                    <Link href={`/academy/${course.slug}`}>
                      Voir le cours
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
