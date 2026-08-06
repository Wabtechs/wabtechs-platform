import { describe, expect, it } from "vitest";
import {
  getAllPosts,
  getPostBySlug,
  getPostsByTag,
  getAllTags,
  getRelatedPosts,
  getAllDocs,
  getDocBySlug,
} from "@/lib/mdx";

describe("posts", () => {
  it("liste tous les articles triés du plus récent au plus ancien", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1]!.date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i]!.date).getTime(),
      );
    }
  });

  it("retourne un article par slug avec son contenu", () => {
    const post = getPostBySlug("prisma-best-practices");
    expect(post).toBeTruthy();
    expect(post?.meta.slug).toBe("prisma-best-practices");
    expect(post?.content).toBeTruthy();
  });

  it("retourne null pour un slug inconnu", () => {
    expect(getPostBySlug("inexistant")).toBeNull();
  });

  it("filtre les articles par tag", () => {
    const posts = getAllPosts();
    const sampleTag = posts[0]?.tags[0];
    if (sampleTag) {
      const filtered = getPostsByTag(sampleTag);
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((p) => p.tags.includes(sampleTag))).toBe(true);
    }
  });

  it("calcule la fréquence des tags", () => {
    const tags = getAllTags();
    expect(Array.isArray(tags)).toBe(true);
    for (const entry of tags) {
      expect(entry.tag).toBeTruthy();
      expect(entry.count).toBeGreaterThan(0);
    }
  });

  it("trouve des articles similaires", () => {
    const posts = getAllPosts();
    const first = posts[0];
    expect(first).toBeDefined();
    const related = getRelatedPosts(first!.slug, 2);
    expect(related.length).toBeLessThanOrEqual(2);
    expect(related.every((p) => p.slug !== first!.slug)).toBe(true);
  });

  it("retourne une liste vide pour un slug inconnu", () => {
    expect(getRelatedPosts("inexistant")).toEqual([]);
  });
});

describe("docs", () => {
  it("liste les documents triés par ordre", () => {
    const docs = getAllDocs();
    expect(docs.length).toBeGreaterThan(0);
    for (let i = 1; i < docs.length; i++) {
      expect(docs[i - 1]!.order).toBeLessThanOrEqual(docs[i]!.order);
    }
  });

  it("retourne un document par slug", () => {
    const doc = getDocBySlug("getting-started");
    expect(doc).toBeTruthy();
    expect(doc?.meta.slug).toBe("getting-started");
    expect(doc?.content).toBeTruthy();
  });

  it("retourne null pour un document inconnu", () => {
    expect(getDocBySlug("inexistant")).toBeNull();
  });
});
