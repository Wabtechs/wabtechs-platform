import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { BlogClient } from "@/components/blog/blog-client";
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

        <BlogClient posts={posts} tags={tags} />
      </div>
    </div>
  );
}
