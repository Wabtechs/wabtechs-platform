"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TagFilter } from "@/components/blog/tag-filter";
import { PostList } from "@/components/blog/post-list";
import type { PostMeta } from "@/lib/mdx";

interface BlogClientProps {
  posts: PostMeta[];
  tags: { tag: string; count: number }[];
}

export function BlogClient({ posts, tags }: BlogClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = posts.filter((post) => {
    const matchesTag = selectedTag
      ? post.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      : true;
    const matchesSearch = search
      ? post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.description.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesTag && matchesSearch;
  });

  return (
    <>
      <div className="mt-12 mx-auto max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un article..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8">
        <TagFilter tags={tags} selectedTag={selectedTag} onSelect={setSelectedTag} />
      </div>

      <div className="mt-12">
        <PostList posts={filtered} />
      </div>
    </>
  );
}
