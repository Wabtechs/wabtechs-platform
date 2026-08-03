"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Course {
  id: string;
  title: string;
}

interface LessonData {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number;
  order: number;
  content: string | null;
  free: boolean;
}

export default function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    videoUrl: "",
    duration: "10",
    order: "1",
    content: "",
    free: false,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/lessons").then((res) => res.json()),
      fetch("/api/admin/courses").then((res) => res.json()),
    ]).then(([lessons, coursesData]: [LessonData[], Course[]]) => {
      const lesson = lessons.find((l) => l.id === id);
      setCourses(coursesData);
      if (lesson) {
        setForm({
          courseId: lesson.courseId,
          title: lesson.title,
          description: lesson.description ?? "",
          videoUrl: lesson.videoUrl ?? "",
          duration: String(lesson.duration),
          order: String(lesson.order),
          content: lesson.content ?? "",
          free: lesson.free,
        });
      }
      setFetching(false);
    });
  }, [id]);

  function updateForm(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form, duration: parseInt(form.duration) || 0, order: parseInt(form.order) || 0 }),
      });
      if (res.ok) router.push(`/admin/lessons?courseId=${form.courseId}`);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Chargement...</p>;
  }

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/admin/lessons">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Link>
      </Button>

      <h1 className="text-3xl font-bold tracking-tight">Modifier la leçon</h1>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="courseId">Cours</Label>
              <select
                id="courseId"
                value={form.courseId}
                onChange={(e) => updateForm("courseId", e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
              >
                <option value="">Sélectionner un cours</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" value={form.title} onChange={(e) => updateForm("title", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} value={form.description} onChange={(e) => updateForm("description", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoUrl">URL de la vidéo</Label>
              <Input id="videoUrl" value={form.videoUrl} onChange={(e) => updateForm("videoUrl", e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input id="duration" type="number" min="0" value={form.duration} onChange={(e) => updateForm("duration", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Ordre</Label>
                <Input id="order" type="number" min="0" value={form.order} onChange={(e) => updateForm("order", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Contenu (Markdown)</Label>
              <Textarea id="content" rows={6} value={form.content} onChange={(e) => updateForm("content", e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.free} onChange={(e) => updateForm("free", e.target.checked)} className="rounded" />
              Leçon gratuite (aperçu)
            </label>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </div>
  );
}
