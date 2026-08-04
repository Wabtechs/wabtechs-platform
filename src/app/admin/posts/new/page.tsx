"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdxEditor } from "@/components/admin/mdx-editor";
import { FileUpload } from "@/components/admin/file-upload";
import { useDraftAutosave } from "@/hooks/use-draft-autosave";

const DRAFT_KEY = "new-post";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    tags: "",
    coverImage: "",
    published: false,
    featured: false,
  });

  const { hasDraft, loadDraft, clearDraft } = useDraftAutosave(DRAFT_KEY, form);

  useEffect(() => {
    const saved = loadDraft();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restauration du brouillon localStorage au montage
      setForm((prev) => ({
        title: String(saved.title ?? prev.title),
        slug: String(saved.slug ?? prev.slug),
        description: String(saved.description ?? prev.description),
        content: String(saved.content ?? prev.content),
        tags: String(saved.tags ?? prev.tags),
        coverImage: String(saved.coverImage ?? prev.coverImage),
        published: saved.published === true || saved.published === "true",
        featured: saved.featured === true || saved.featured === "true",
      }));
    }
  }, [loadDraft]);

  function updateForm(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      if (res.ok) {
        clearDraft();
        router.push("/admin/posts");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/posts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
          {hasDraft && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const saved = loadDraft();
                if (saved) {
                  setForm((prev) => ({
                    ...prev,
                    title: String(saved.title ?? prev.title),
                    slug: String(saved.slug ?? prev.slug),
                    description: String(saved.description ?? prev.description),
                    content: String(saved.content ?? prev.content),
                    tags: String(saved.tags ?? prev.tags),
                    coverImage: String(saved.coverImage ?? prev.coverImage),
                  }));
                }
              }}
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Brouillon sauvegardé
            </Button>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">Nouvel article</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-foreground">Contenu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Titre</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    updateForm("title", e.target.value);
                    if (!form.slug) updateForm("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => updateForm("slug", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Contenu (Markdown)</Label>
                <MdxEditor
                  value={form.content}
                  onChange={(v) => updateForm("content", v)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-foreground">Méta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Tags (séparés par des virgules)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => updateForm("tags", e.target.value)}
                  placeholder="Next.js, React, TypeScript"
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Image de couverture</Label>
                <FileUpload value={form.coverImage} onChange={(url) => updateForm("coverImage", url)} label="l'image de couverture" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-foreground">
                  <input type="checkbox" checked={form.published} onChange={(e) => updateForm("published", e.target.checked)} className="rounded" />
                  Publié
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-foreground">
                  <input type="checkbox" checked={form.featured} onChange={(e) => updateForm("featured", e.target.checked)} className="rounded" />
                  Featured
                </label>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} className="bg-primary text-white hover:bg-[#7323c4]">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {loading ? "Création..." : "Créer l'article"}
          </Button>
        </form>
      </div>
    </div>
  );
}
