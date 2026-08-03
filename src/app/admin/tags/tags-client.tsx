"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface TagItem {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number; podcasts: number };
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

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
          setTags(
            [...tags, { ...tag, _count: { posts: 0, podcasts: 0 } }].sort(
              (a, b) => a.name.localeCompare(b.name),
            ),
          );
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
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Tag className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
            Tags
          </h1>
          <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
            {tags.length} tags au total
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTag()}
          placeholder="Nouveau tag..."
          className="max-w-xs h-9 border-gray-200/80 bg-gray-50 text-[13px] text-gray-900 focus:border-primary focus:ring-primary/20 dark:border-border dark:bg-muted dark:text-foreground"
        />
        <Button
          onClick={addTag}
          disabled={loading || !newTag.trim()}
          size="sm"
          className="h-9 bg-primary text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4]"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>

      {tags.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Tag className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-[13px] text-gray-500">Aucun tag</p>
          </CardContent>
        </Card>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2">
          <AnimatePresence>
            {tags.map((tag) => (
              <motion.div
                key={tag.id}
                variants={item}
                layout
                className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3.5 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Tag className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-gray-900 dark:text-foreground">
                      {tag.name}
                    </p>
                    <p className="text-[11px] text-gray-400">{tag.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
                      {tag._count.posts} articles
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
                      {tag._count.podcasts} podcasts
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTag(tag.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
