import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { serialize } from "next-mdx-remote/serialize";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PostHeader } from "@/components/blog/post-header";
import { MDXContent } from "@/components/blog/mdx-content";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/mdx";
import { PostCard } from "@/components/blog/post-card";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article non trouvé" };

  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
      tags: post.meta.tags,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const mdxSource = await serialize(post.content);
  const relatedPosts = getRelatedPosts(slug, 3);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au blog
          </Link>
        </Button>

        <div className="grid grid-cols-1 gap-12 xl:grid-cols-[1fr_220px]">
          <article className="mx-auto max-w-3xl">
            <PostHeader post={post.meta} />
            <div className="mt-12">
              <MDXContent source={mdxSource} />
            </div>

            {post.meta.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {post.meta.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </article>

          <aside>
            <TableOfContents content={post.content} />
          </aside>
        </div>

        {relatedPosts.length > 0 && (
          <section className="mt-20 border-t pt-12">
            <h2 className="mb-8 text-2xl font-bold">Articles similaires</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <PostCard key={related.slug} post={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
