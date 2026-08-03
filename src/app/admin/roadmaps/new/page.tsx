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

export default function NewRoadmapPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    status: "planned",
    quarter: "",
    year: "",
    order: "",
    published: false,
  });

  function updateForm(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: form.year ? Number(form.year) : null,
          order: form.order ? Number(form.order) : null,
        }),
      });
      if (res.ok) router.push("/admin/roadmaps");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/roadmaps">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">Nouvelle roadmap</h1>

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
                <Label className="text-gray-900 dark:text-foreground">Statut</Label>
                <select
                  value={form.status}
                  onChange={(e) => updateForm("status", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="planned">Planifié</option>
                  <option value="in-progress">En cours</option>
                  <option value="completed">Terminé</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Trimestre</Label>
                <Input
                  value={form.quarter}
                  onChange={(e) => updateForm("quarter", e.target.value)}
                  placeholder="Q1 2024"
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Année</Label>
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) => updateForm("year", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Ordre</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => updateForm("order", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-foreground">Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-foreground">
                <input type="checkbox" checked={form.published} onChange={(e) => updateForm("published", e.target.checked)} className="rounded" />
                Publié
              </label>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} className="bg-primary text-white hover:bg-[#7323c4]">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {loading ? "Création..." : "Créer la roadmap"}
          </Button>
        </form>
      </div>
    </div>
  );
}
