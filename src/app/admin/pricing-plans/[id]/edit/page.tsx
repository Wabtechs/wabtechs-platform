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

interface PricingPlanData {
  id: string;
  name: string;
  save: string | null;
  price: string;
  features: string[];
  disabled: string[];
  featured: boolean;
  order: number;
}

export default function EditPricingPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    name: "",
    save: "",
    price: "",
    features: "",
    disabled: "",
    featured: false,
    order: 0,
  });

  useEffect(() => {
    fetch(`/api/admin/pricing-plans`)
      .then((r) => r.json())
      .then((plans: PricingPlanData[]) => {
        const plan = plans.find((p) => p.id === id);
        if (plan) {
          setForm({
            name: plan.name,
            save: plan.save ?? "",
            price: plan.price,
            features: plan.features.join(", "),
            disabled: plan.disabled.join(", "),
            featured: plan.featured,
            order: plan.order,
          });
        }
      })
      .finally(() => setFetching(false));
  }, [id]);

  function updateForm(field: string, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pricing-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...form,
          features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
          disabled: form.disabled.split(",").map((s) => s.trim()).filter(Boolean),
          order: Number(form.order),
        }),
      });
      if (res.ok) router.push("/admin/pricing-plans");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/admin/pricing-plans">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">Modifier le plan</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Card className="border-gray-200 bg-white dark:border-border dark:bg-card">
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
                <Label className="text-gray-900 dark:text-foreground">Économie</Label>
                <Input
                  value={form.save}
                  onChange={(e) => updateForm("save", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Prix</Label>
                <Input
                  value={form.price}
                  onChange={(e) => updateForm("price", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Fonctionnalités (séparées par des virgules)</Label>
                <Textarea
                  value={form.features}
                  onChange={(e) => updateForm("features", e.target.value)}
                  placeholder="Feature 1, Feature 2, Feature 3"
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Fonctionnalités désactivées (séparées par des virgules)</Label>
                <Textarea
                  value={form.disabled}
                  onChange={(e) => updateForm("disabled", e.target.value)}
                  placeholder="Disabled 1, Disabled 2"
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

          <Card className="border-gray-200 bg-white dark:border-border dark:bg-card">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-foreground">Mise en avant</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-foreground">
                <input type="checkbox" checked={form.featured} onChange={(e) => updateForm("featured", e.target.checked)} className="rounded" />
                Mis en avant
              </label>
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
