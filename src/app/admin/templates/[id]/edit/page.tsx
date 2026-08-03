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

const CATEGORIES = ["starter", "dashboard", "landing", "blog", "portfolio", "saas"];

interface TemplateData {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string | null;
  image: string | null;
  price: { toString(): string } | number;
  category: string;
  stack: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  downloadUrl: string | null;
  version: string;
  published: boolean;
  featured: boolean;
}

export default function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    image: "",
    price: "0",
    category: "starter",
    stack: "",
    demoUrl: "",
    repoUrl: "",
    downloadUrl: "",
    version: "1.0.0",
    published: false,
    featured: false,
  });

  useEffect(() => {
    fetch("/api/admin/templates")
      .then((res) => res.json())
      .then((data: TemplateData[]) => {
        const template = data.find((t) => t.id === id);
        if (template) {
          setForm({
            name: template.name,
            slug: template.slug,
            description: template.description,
            longDescription: template.longDescription ?? "",
            image: template.image ?? "",
            price: String(template.price),
            category: template.category,
            stack: template.stack ?? "",
            demoUrl: template.demoUrl ?? "",
            repoUrl: template.repoUrl ?? "",
            downloadUrl: template.downloadUrl ?? "",
            version: template.version,
            published: template.published,
            featured: template.featured,
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
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form, price: parseFloat(form.price) || 0 }),
      });
      if (res.ok) router.push("/admin/templates");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Chargement...</p>;
  }

  return (
    <div className="min-h-screen">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/admin/templates">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Link>
      </Button>

      <h1 className="text-3xl font-bold tracking-tight">Modifier le template</h1>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" value={form.name} onChange={(e) => updateForm("name", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={form.slug} onChange={(e) => updateForm("slug", e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description courte</Label>
              <Input id="description" value={form.description} onChange={(e) => updateForm("description", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longDescription">Description longue (Markdown)</Label>
              <Textarea id="longDescription" rows={5} value={form.longDescription} onChange={(e) => updateForm("longDescription", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Capture d&apos;écran</Label>
              <FileUpload value={form.image} onChange={(url) => updateForm("image", url)} label="la capture du template" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input id="price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => updateForm("price", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stack">Stack technique</Label>
              <Input id="stack" value={form.stack} onChange={(e) => updateForm("stack", e.target.value)} placeholder="Next.js, Tailwind, Prisma" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="demoUrl">URL de démo</Label>
                <Input id="demoUrl" value={form.demoUrl} onChange={(e) => updateForm("demoUrl", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repoUrl">URL du dépôt GitHub</Label>
                <Input id="repoUrl" value={form.repoUrl} onChange={(e) => updateForm("repoUrl", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="downloadUrl">URL de téléchargement</Label>
                <Input id="downloadUrl" value={form.downloadUrl} onChange={(e) => updateForm("downloadUrl", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input id="version" value={form.version} onChange={(e) => updateForm("version", e.target.value)} />
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.published} onChange={(e) => updateForm("published", e.target.checked)} className="rounded" />
                Publié
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={(e) => updateForm("featured", e.target.checked)} className="rounded" />
                Mis en avant
              </label>
            </div>
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
