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
import { FileUpload } from "@/components/admin/file-upload";

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
  language: string;
  stars: number;
  forks: number;
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
    language: "TypeScript",
    stars: "",
    forks: "",
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
            language: proj.language,
            stars: proj.stars == null ? "" : String(proj.stars),
            forks: proj.forks == null ? "" : String(proj.forks),
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <h1 className="dark:text-foreground text-3xl font-bold tracking-tight text-gray-900">
          Modifier le projet
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="dark:text-foreground text-gray-900">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="dark:text-foreground text-gray-900">Titre</Label>
                <Input
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  className="dark:border-border dark:bg-muted dark:text-foreground border-gray-200 bg-gray-50 text-gray-900"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-foreground text-gray-900">Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => updateForm("slug", e.target.value)}
                  className="dark:border-border dark:bg-muted dark:text-foreground border-gray-200 bg-gray-50 text-gray-900"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-foreground text-gray-900">Description courte</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  className="dark:border-border dark:bg-muted dark:text-foreground border-gray-200 bg-gray-50 text-gray-900"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-foreground text-gray-900">Description longue</Label>
                <Textarea
                  rows={6}
                  value={form.longDescription}
                  onChange={(e) => updateForm("longDescription", e.target.value)}
                  className="dark:border-border dark:bg-muted dark:text-foreground border-gray-200 bg-gray-50 text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-foreground text-gray-900">GitHub URL</Label>
                  <Input
                    value={form.githubUrl}
                    onChange={(e) => updateForm("githubUrl", e.target.value)}
                    className="dark:border-border dark:bg-muted dark:text-foreground border-gray-200 bg-gray-50 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-foreground text-gray-900">Demo URL</Label>
                  <Input
                    value={form.demoUrl}
                    onChange={(e) => updateForm("demoUrl", e.target.value)}
                    className="dark:border-border dark:bg-muted dark:text-foreground border-gray-200 bg-gray-50 text-gray-900"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="dark:text-foreground text-gray-900">
                  Stack technique (virgules)
                </Label>
                <Input
                  value={form.techStack}
                  onChange={(e) => updateForm("techStack", e.target.value)}
                  placeholder="Next.js, TypeScript, Prisma"
                  className="dark:border-border dark:bg-muted dark:text-foreground border-gray-200 bg-gray-50 text-gray-900"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-foreground text-gray-900">Langage</Label>
                  <Input
                    value={form.language}
                    onChange={(e) => updateForm("language", e.target.value)}
                    placeholder="TypeScript"
                    className="dark:border-border dark:bg-muted dark:text-foreground border-gray-200 bg-gray-50 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-foreground text-gray-900">Stars GitHub</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.stars}
                    onChange={(e) => updateForm("stars", e.target.value)}
                    className="dark:border-border dark:bg-muted dark:text-foreground border-gray-200 bg-gray-50 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-foreground text-gray-900">Forks GitHub</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.forks}
                    onChange={(e) => updateForm("forks", e.target.value)}
                    className="dark:border-border dark:bg-muted dark:text-foreground border-gray-200 bg-gray-50 text-gray-900"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="dark:text-foreground text-gray-900">Image de couverture</Label>
                <FileUpload
                  value={form.coverImage}
                  onChange={(url) => updateForm("coverImage", url)}
                  label="l'image de couverture"
                />
              </div>
              <div className="flex gap-4">
                <label className="dark:text-foreground flex items-center gap-2 text-sm text-gray-900">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => updateForm("featured", e.target.checked)}
                    className="rounded"
                  />
                  Featured
                </label>
                <label className="dark:text-foreground flex items-center gap-2 text-sm text-gray-900">
                  <input
                    type="checkbox"
                    checked={form.archived}
                    onChange={(e) => updateForm("archived", e.target.checked)}
                    className="rounded"
                  />
                  Archivé
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="dark:text-foreground text-gray-900">SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="dark:text-foreground text-gray-900">Meta Title</Label>
                <Input
                  value={form.metaTitle}
                  onChange={(e) => updateForm("metaTitle", e.target.value)}
                  placeholder="Titre pour les moteurs de recherche"
                  className="dark:border-border dark:bg-muted dark:text-foreground border-gray-200 bg-gray-50 text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-foreground text-gray-900">Meta Description</Label>
                <Textarea
                  value={form.metaDescription}
                  onChange={(e) => updateForm("metaDescription", e.target.value)}
                  placeholder="Description pour les moteurs de recherche"
                  rows={3}
                  className="dark:border-border dark:bg-muted dark:text-foreground border-gray-200 bg-gray-50 text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-foreground text-gray-900">OG Image (URL)</Label>
                <Input
                  value={form.ogImage}
                  onChange={(e) => updateForm("ogImage", e.target.value)}
                  placeholder="Image pour les réseaux sociaux"
                  className="dark:border-border dark:bg-muted dark:text-foreground border-gray-200 bg-gray-50 text-gray-900"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={loading}
            className="bg-primary text-white hover:bg-[#7323c4]"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {loading ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </form>
      </div>
    </div>
  );
}
