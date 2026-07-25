"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface TagItem {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number; podcasts: number };
}

export function TagsClient({ tags: initialTags }: { tags: TagItem[] }) {
  const [tags, setTags] = useState(initialTags);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);

  async function addTag() {
    if (!newTag.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTag.trim() }),
      });
      if (res.ok) {
        setNewTag("");
        const tag = await res.json();
        if (!tags.find((t) => t.id === tag.id)) {
          setTags([...tags, { ...tag, _count: { posts: 0, podcasts: 0 } }].sort((a, b) => a.name.localeCompare(b.name)));
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteTag(id: string) {
    if (!confirm("Supprimer ce tag ?")) return;
    const res = await fetch("/api/admin/tags", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setTags(tags.filter((t) => t.id !== id));
  }

  return (
    <>
      <div className="mt-6 flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTag()}
          placeholder="Nouveau tag..."
          className="max-w-xs border-gray-200 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-[#131313] dark:text-white"
        />
        <Button onClick={addTag} disabled={loading || !newTag.trim()} className="bg-[#842ae3] text-white hover:bg-[#7323c4]">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>

      <div className="mt-6 space-y-2">
        {tags.length === 0 ? (
          <Card className="border-gray-200 bg-white dark:border-white/10 dark:bg-[#1F1F1F]">
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucun tag. Créez votre premier tag !
            </CardContent>
          </Card>
        ) : (
          tags.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-[#1F1F1F]">
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{tag.name}</p>
                  <p className="text-xs text-muted-foreground">{tag.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <Badge variant="secondary" className="text-xs">{tag._count.posts} articles</Badge>
                  <Badge variant="secondary" className="text-xs">{tag._count.podcasts} podcasts</Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteTag(tag.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
