import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { PostList } from "@/components/blog/post-list";
import { TagFilter } from "@/components/blog/tag-filter";
import { getAllPosts, getAllTags } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles techniques, tutoriels et retours d'expérience sur le développement web moderne.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Blog"
          title="Articles &"
          highlight="Réflexions"
          description="Articles techniques, tutoriels et retours d'expérience."
        />

        <div className="mt-12 mx-auto max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher un article..." className="pl-10" />
          </div>
        </div>

        <div className="mt-8">
          <TagFilter tags={tags} selectedTag={null} onSelect={() => {}} />
        </div>

        <div className="mt-12">
          <PostList posts={posts} />
        </div>
      </div>
    </div>
  );
}
