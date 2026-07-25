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

interface PostData {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  featured: boolean;
  tags: { id: string; name: string }[];
  publishedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    tags: "",
    coverImage: "",
    published: false,
    featured: false,
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
  });

  useEffect(() => {
    fetch(`/api/admin/posts`)
      .then((r) => r.json())
      .then((posts: PostData[]) => {
        const post = posts.find((p) => p.id === id);
        if (post) {
          setForm({
            title: post.title,
            slug: post.slug,
            description: post.description,
            content: post.content,
            tags: post.tags.map((t) => t.name).join(", "),
            coverImage: post.coverImage ?? "",
            published: post.published,
            featured: post.featured,
            metaTitle: post.metaTitle ?? "",
            metaDescription: post.metaDescription ?? "",
            ogImage: post.ogImage ?? "",
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
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...form,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      if (res.ok) router.push("/admin/posts");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#842ae3]" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin/posts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Modifier l&apos;article</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Card className="border-gray-200 bg-white dark:border-white/10 dark:bg-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Contenu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white">Titre</Label>
                <Input
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-[#131313] dark:text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white">Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => updateForm("slug", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-[#131313] dark:text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-[#131313] dark:text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white">Contenu (MDX)</Label>
                <Textarea
                  rows={15}
                  value={form.content}
                  onChange={(e) => updateForm("content", e.target.value)}
                  className="border-gray-200 bg-gray-50 font-mono text-sm text-gray-900 dark:border-white/10 dark:bg-[#131313] dark:text-white"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white dark:border-white/10 dark:bg-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Méta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white">Tags (séparés par des virgules)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => updateForm("tags", e.target.value)}
                  placeholder="Next.js, React, TypeScript"
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-[#131313] dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white">Image de couverture (URL)</Label>
                <Input
                  value={form.coverImage}
                  onChange={(e) => updateForm("coverImage", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-[#131313] dark:text-white"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                  <input type="checkbox" checked={form.published} onChange={(e) => updateForm("published", e.target.checked)} className="rounded" />
                  Publié
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                  <input type="checkbox" checked={form.featured} onChange={(e) => updateForm("featured", e.target.checked)} className="rounded" />
                  Featured
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white dark:border-white/10 dark:bg-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white">Meta Title</Label>
                <Input
                  value={form.metaTitle}
                  onChange={(e) => updateForm("metaTitle", e.target.value)}
                  placeholder="Titre pour les moteurs de recherche"
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-[#131313] dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white">Meta Description</Label>
                <Textarea
                  value={form.metaDescription}
                  onChange={(e) => updateForm("metaDescription", e.target.value)}
                  placeholder="Description pour les moteurs de recherche"
                  rows={3}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-[#131313] dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white">OG Image (URL)</Label>
                <Input
                  value={form.ogImage}
                  onChange={(e) => updateForm("ogImage", e.target.value)}
                  placeholder="Image pour les réseaux sociaux"
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-[#131313] dark:text-white"
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} className="bg-[#842ae3] text-white hover:bg-[#7323c4]">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {loading ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </form>
      </div>
    </div>
  );
}
