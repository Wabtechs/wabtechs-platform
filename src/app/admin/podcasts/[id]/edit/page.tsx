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

interface PodcastData {
  id: string;
  title: string;
  slug: string;
  description: string;
  audioUrl: string;
  coverImage: string | null;
  duration: number;
  episode: number;
  season: number;
  published: boolean;
  publishedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
}

export default function EditPodcastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    audioUrl: "",
    coverImage: "",
    duration: "",
    episode: "1",
    season: "1",
    published: false,
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
  });

  useEffect(() => {
    fetch(`/api/admin/podcasts`)
      .then((r) => r.json())
      .then((podcasts: PodcastData[]) => {
        const pod = podcasts.find((p) => p.id === id);
        if (pod) {
          setForm({
            title: pod.title,
            slug: pod.slug,
            description: pod.description,
            audioUrl: pod.audioUrl,
            coverImage: pod.coverImage ?? "",
            duration: String(pod.duration),
            episode: String(pod.episode),
            season: String(pod.season),
            published: pod.published,
            metaTitle: pod.metaTitle ?? "",
            metaDescription: pod.metaDescription ?? "",
            ogImage: pod.ogImage ?? "",
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
      const res = await fetch("/api/admin/podcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...form,
          duration: parseInt(form.duration || "0", 10),
          episode: parseInt(form.episode, 10),
          season: parseInt(form.season, 10),
        }),
      });
      if (res.ok) router.push("/admin/podcasts");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin/podcasts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">Modifier l&apos;épisode</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Card className="border-border bg-card">
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
                <Label className="text-gray-900 dark:text-foreground">Description</Label>
                <Textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" required />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">URL audio</Label>
                <Input value={form.audioUrl} onChange={(e) => updateForm("audioUrl", e.target.value)} className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-foreground">Durée (sec)</Label>
                  <Input type="number" value={form.duration} onChange={(e) => updateForm("duration", e.target.value)} className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-foreground">Épisode</Label>
                  <Input type="number" value={form.episode} onChange={(e) => updateForm("episode", e.target.value)} className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-foreground">Saison</Label>
                  <Input type="number" value={form.season} onChange={(e) => updateForm("season", e.target.value)} className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Image de couverture</Label>
                <FileUpload value={form.coverImage} onChange={(url) => updateForm("coverImage", url)} label="l'image de couverture" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-foreground">
                <input type="checkbox" checked={form.published} onChange={(e) => updateForm("published", e.target.checked)} className="rounded" />
                Publié
              </label>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
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
