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
import { FileUpload } from "@/components/admin/file-upload";

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    coverImage: "",
    price: "0",
    stripePriceId: "",
    level: "beginner",
    duration: "",
    published: false,
    featured: false,
  });

  function updateForm(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price) || 0,
          stripePriceId: form.stripePriceId?.trim() || null,
        }),
      });
      if (res.ok) router.push("/admin/courses");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/admin/courses">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Link>
      </Button>

      <h1 className="text-3xl font-bold tracking-tight">Nouveau cours</h1>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-6">
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
                  if (!form.slug)
                    updateForm("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => updateForm("slug", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Image de couverture</Label>
              <FileUpload
                value={form.coverImage}
                onChange={(url) => updateForm("coverImage", url)}
                label="l'image du cours"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => updateForm("price", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Niveau</Label>
                <select
                  id="level"
                  value={form.level}
                  onChange={(e) => updateForm("level", e.target.value)}
                  className="dark:border-border dark:bg-muted dark:text-foreground flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                >
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="advanced">Avancé</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripePriceId">Stripe Price ID (optionnel)</Label>
              <Input
                id="stripePriceId"
                value={form.stripePriceId}
                onChange={(e) => updateForm("stripePriceId", e.target.value)}
                placeholder="price_xxxxxxxxxxxx"
              />
              <p className="text-muted-foreground text-[12px]">
                Si renseigné, le checkout Stripe utilisera ce prix (recommandé). Sinon, le prix (€)
                est envoyé directement à Stripe.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Durée totale</Label>
              <Input
                id="duration"
                value={form.duration}
                onChange={(e) => updateForm("duration", e.target.value)}
                placeholder="10h"
              />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => updateForm("published", e.target.checked)}
                  className="rounded"
                />
                Publié
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateForm("featured", e.target.checked)}
                  className="rounded"
                />
                Mis en avant
              </label>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {loading ? "Création..." : "Créer le cours"}
        </Button>
      </form>
    </div>
  );
}
