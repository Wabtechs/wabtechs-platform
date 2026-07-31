import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");
const DOCS_DIR = path.join(process.cwd(), "src", "content", "docs");

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
  readTime: number;
  featured?: boolean;
}

function mapPostMeta(slug: string, data: Record<string, unknown>): PostMeta {
  return {
    slug,
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    date: (data.date as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    author: (data.author as string) ?? "",
    readTime: (data.readTime as number) ?? 5,
    featured: (data.featured as boolean) ?? false,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(CONTENT_DIR, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    return mapPostMeta(slug, data);
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): { meta: PostMeta; content: string } | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return { meta: mapPostMeta(slug, data), content };
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const post = getPostBySlug(slug);
  if (!post) return [];

  const allPosts = getAllPosts().filter((p) => p.slug !== slug);

  return allPosts
    .map((p) => ({
      ...p,
      relevance: p.tags.filter((t) => post.meta.tags.includes(t)).length,
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}

export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
}

function mapDocMeta(slug: string, data: Record<string, unknown>): DocMeta {
  return {
    slug,
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    order: (data.order as number) ?? 99,
  };
}

export function getAllDocs(): DocMeta[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".mdx"));

  const docs = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(DOCS_DIR, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    return mapDocMeta(slug, data);
  });

  return docs.sort((a, b) => a.order - b.order);
}

export function getDocBySlug(slug: string): { meta: DocMeta; content: string } | null {
  if (!fs.existsSync(DOCS_DIR)) return null;
  const filePath = path.join(DOCS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return { meta: mapDocMeta(slug, data), content };
}
