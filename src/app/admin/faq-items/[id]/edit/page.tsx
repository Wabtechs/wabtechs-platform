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

interface FaqItemData {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order: number;
}

export default function EditFaqItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "",
    order: 0,
  });

  useEffect(() => {
    fetch(`/api/admin/faq-items`)
      .then((r) => r.json())
      .then((items: FaqItemData[]) => {
        const item = items.find((i) => i.id === id);
        if (item) {
          setForm({
            question: item.question,
            answer: item.answer,
            category: item.category ?? "",
            order: item.order,
          });
        }
      })
      .finally(() => setFetching(false));
  }, [id]);

  function updateForm(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/faq-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form, order: Number(form.order) }),
      });
      if (res.ok) router.push("/admin/faq-items");
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
          <Link href="/admin/faq-items">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">Modifier la FAQ</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-foreground">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Question</Label>
                <Input
                  value={form.question}
                  onChange={(e) => updateForm("question", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Réponse</Label>
                <Textarea
                  value={form.answer}
                  onChange={(e) => updateForm("answer", e.target.value)}
                  className="border-gray-200 bg-gray-50 text-gray-900 dark:border-border dark:bg-muted dark:text-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-foreground">Catégorie</Label>
                <Input
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
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
            {loading ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </form>
      </div>
    </div>
  );
}
