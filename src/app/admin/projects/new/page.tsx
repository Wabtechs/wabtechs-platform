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

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  });

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

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight">Nouveau projet</h1>

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
                <Label htmlFor="description">Description courte</Label>
                <Textarea id="description" value={form.description} onChange={(e) => updateForm("description", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longDescription">Description longue</Label>
                <Textarea id="longDescription" rows={6} value={form.longDescription} onChange={(e) => updateForm("longDescription", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input id="githubUrl" value={form.githubUrl} onChange={(e) => updateForm("githubUrl", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demoUrl">Demo URL</Label>
                  <Input id="demoUrl" value={form.demoUrl} onChange={(e) => updateForm("demoUrl", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="techStack">Stack technique (séparé par virgules)</Label>
                <Input id="techStack" value={form.techStack} onChange={(e) => updateForm("techStack", e.target.value)} placeholder="Next.js, TypeScript, Prisma" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverImage">Image de couverture</Label>
                <FileUpload value={form.coverImage} onChange={(url) => updateForm("coverImage", url)} label="l'image de couverture" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={(e) => updateForm("featured", e.target.checked)} className="rounded" />
                Featured
              </label>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {loading ? "Création..." : "Créer le projet"}
          </Button>
        </form>
      </div>
    </div>
  );
}
