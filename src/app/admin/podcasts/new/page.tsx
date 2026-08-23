"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPodcastPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  });

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

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin/podcasts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight">Nouvel épisode</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => {
                    updateForm("title", e.target.value);
                    if (!form.slug) updateForm("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={form.slug} onChange={(e) => updateForm("slug", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={(e) => updateForm("description", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audioUrl">URL audio</Label>
                <Input id="audioUrl" value={form.audioUrl} onChange={(e) => updateForm("audioUrl", e.target.value)} required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée (sec)</Label>
                  <Input id="duration" type="number" value={form.duration} onChange={(e) => updateForm("duration", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="episode">Épisode</Label>
                  <Input id="episode" type="number" value={form.episode} onChange={(e) => updateForm("episode", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="season">Saison</Label>
                  <Input id="season" type="number" value={form.season} onChange={(e) => updateForm("season", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverImage">Image de couverture (URL)</Label>
                <Input id="coverImage" value={form.coverImage} onChange={(e) => updateForm("coverImage", e.target.value)} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.published} onChange={(e) => updateForm("published", e.target.checked)} className="rounded" />
                Publié
              </label>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {loading ? "Création..." : "Créer l'épisode"}
          </Button>
        </form>
      </div>
    </div>
  );
}
