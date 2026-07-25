import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllDocs, getDocBySlug } from "@/lib/mdx";
import { mdxComponents } from "@/components/blog/mdx-components";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsTableOfContents } from "@/components/docs/docs-table-of-contents";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const docs = getAllDocs();
  return docs.map((doc) => ({ slug: [doc.slug] }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug[0] ?? "");
  if (!doc) return { title: "Documentation non trouvée" };

  return {
    title: `${doc.meta.title} | Documentation`,
    description: doc.meta.description,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const doc = getDocBySlug(slug[0] ?? "");

  if (!doc) notFound();

  const { content } = await compileMDX({
    source: doc.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    },
  });

  const allDocs = getAllDocs();

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {doc.meta.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {doc.meta.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 xl:grid-cols-[220px_1fr_220px]">
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <DocsSidebar docs={allDocs} />
            </div>
          </aside>

          <article className="prose prose-neutral dark:prose-invert min-w-0 max-w-none">
            {content}
          </article>

          <aside className="hidden xl:block">
            <DocsTableOfContents content={doc.content} />
          </aside>
        </div>
      </div>
    </div>
  );
}
