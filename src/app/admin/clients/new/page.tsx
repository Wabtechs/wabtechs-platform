"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    logo: "",
    url: "",
    order: 0,
  });

  function updateForm(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      });
      if (res.ok) router.push("/admin/clients");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/clients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">Nouveau client</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-foreground">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Nom</Label>
                <Input
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Logo (URL)</Label>
                <Input
                  value={form.logo}
                  onChange={(e) => updateForm("logo", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">URL</Label>
                <Input
                  value={form.url}
                  onChange={(e) => updateForm("url", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Ordre</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => updateForm("order", e.target.valueAsNumber || 0)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} className="bg-primary text-white hover:bg-[#7323c4]">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {loading ? "Création..." : "Créer le client"}
          </Button>
        </form>
      </div>
    </div>
  );
}
