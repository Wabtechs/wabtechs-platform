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

interface ProjectData {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string | null;
  coverImage: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  techStack: string[];
  featured: boolean;
  archived: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    longDescription: "",
    coverImage: "",
    githubUrl: "",
    demoUrl: "",
    techStack: "",
    featured: false,
    archived: false,
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
  });

  useEffect(() => {
    fetch(`/api/admin/projects`)
      .then((r) => r.json())
      .then((projects: ProjectData[]) => {
        const proj = projects.find((p) => p.id === id);
        if (proj) {
          setForm({
            title: proj.title,
            slug: proj.slug,
            description: proj.description,
            longDescription: proj.longDescription ?? "",
            coverImage: proj.coverImage ?? "",
            githubUrl: proj.githubUrl ?? "",
            demoUrl: proj.demoUrl ?? "",
            techStack: proj.techStack.join(", "),
            featured: proj.featured,
            archived: proj.archived,
            metaTitle: proj.metaTitle ?? "",
            metaDescription: proj.metaDescription ?? "",
            ogImage: proj.ogImage ?? "",
          });
        }
      })
      .finally(() => setFetching(false));
  }, [id]);

  function updateForm(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...form,
          techStack: form.techStack
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      if (res.ok) router.push("/admin/projects");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">Modifier le projet</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Card className="border-gray-200 bg-white dark:border-border dark:bg-card">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-foreground">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Titre</Label>
                <Input value={form.title} onChange={(e) => updateForm("title", e.target.value)} className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" required />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Slug</Label>
                <Input value={form.slug} onChange={(e) => updateForm("slug", e.target.value)} className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" required />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Description courte</Label>
                <Textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" required />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Description longue</Label>
                <Textarea rows={6} value={form.longDescription} onChange={(e) => updateForm("longDescription", e.target.value)} className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-foreground">GitHub URL</Label>
                  <Input value={form.githubUrl} onChange={(e) => updateForm("githubUrl", e.target.value)} className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-foreground">Demo URL</Label>
                  <Input value={form.demoUrl} onChange={(e) => updateForm("demoUrl", e.target.value)} className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Stack technique (virgules)</Label>
                <Input value={form.techStack} onChange={(e) => updateForm("techStack", e.target.value)} placeholder="Next.js, TypeScript, Prisma" className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Image de couverture (URL)</Label>
                <Input value={form.coverImage} onChange={(e) => updateForm("coverImage", e.target.value)} className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-foreground">
                  <input type="checkbox" checked={form.featured} onChange={(e) => updateForm("featured", e.target.checked)} className="rounded" />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-foreground">
                  <input type="checkbox" checked={form.archived} onChange={(e) => updateForm("archived", e.target.checked)} className="rounded" />
                  Archivé
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white dark:border-border dark:bg-card">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-foreground">SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Meta Title</Label>
                <Input value={form.metaTitle} onChange={(e) => updateForm("metaTitle", e.target.value)} placeholder="Titre pour les moteurs de recherche" className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Meta Description</Label>
                <Textarea value={form.metaDescription} onChange={(e) => updateForm("metaDescription", e.target.value)} placeholder="Description pour les moteurs de recherche" rows={3} className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">OG Image (URL)</Label>
                <Input value={form.ogImage} onChange={(e) => updateForm("ogImage", e.target.value)} placeholder="Image pour les réseaux sociaux" className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} className="bg-primary text-white hover:bg-[#7323c4]">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {loading ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </form>
      </div>
    </div>
  );
}
