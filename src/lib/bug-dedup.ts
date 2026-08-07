import { db } from "@/lib/prisma";

const STOPWORDS = new Set([
  "le",
  "la",
  "les",
  "de",
  "des",
  "du",
  "un",
  "une",
  "et",
  "ou",
  "en",
  "au",
  "aux",
  "sur",
  "dans",
  "pour",
  "par",
  "avec",
  "ce",
  "cet",
  "cette",
  "ces",
  "se",
  "sa",
  "son",
  "ses",
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "to",
  "in",
  "for",
  "on",
  "with",
  "at",
  "by",
  "from",
  "est",
  "sont",
  "être",
  "pas",
  "ne",
  "que",
  "qui",
  "quoi",
  "plus",
  "très",
  "trop",
  "fait",
  "when",
  "while",
  "bug",
  "issue",
  "error",
  "message",
  "erreur",
  "app",
  "does",
  "doesn",
  "can't",
  "dont",
  "want",
  "need",
  "get",
  "got",
  "see",
  "voir",
  "il",
  "elle",
  "on",
  "ils",
]);

export interface BugSimilarity {
  bug: {
    id: string;
    title: string;
    severity: string;
    status: string;
    projectId: string;
    project: { slug: string; name: string; color: string };
  };
  similarity: number;
  sharedTokens: string[];
}

export interface DuplicatePair {
  a: BugSimilarity["bug"];
  b: BugSimilarity["bug"];
  similarity: number;
  sharedTokens: string[];
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9à-ÿçœ -]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function normalizeTokens(tokens: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const t of tokens) {
    if (!seen.has(t)) {
      seen.add(t);
      unique.push(t);
    }
  }
  return unique;
}

function countFrequencies(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
  return freq;
}

/**
 * Similarité cosinus sur vecteurs TF (bag-of-words) + bonus Jaccard.
 * Renvoie une valeur dans [0, 1].
 */
export function cosineSimilarity(
  aText: string,
  bText: string,
): { score: number; shared: string[] } {
  const aTokens = normalizeTokens(tokenize(aText));
  const bTokens = normalizeTokens(tokenize(bText));
  const shared = aTokens.filter((t) => bTokens.includes(t));
  const union = new Set([...aTokens, ...bTokens]);
  const jaccard = union.size > 0 ? shared.length / union.size : 0;

  const fa = countFrequencies(aTokens);
  const fb = countFrequencies(bTokens);
  const all = new Set([...fa.keys(), ...fb.keys()]);

  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const term of all) {
    const va = fa.get(term) ?? 0;
    const vb = fb.get(term) ?? 0;
    dot += va * vb;
    na += va * va;
    nb += vb * vb;
  }
  const cosine = na > 0 && nb > 0 ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;

  return { score: Math.round(Math.max(cosine, jaccard) * 1000) / 1000, shared };
}

export const DUPLICATE_THRESHOLD = 0.55;

export interface DuplicateCandidate {
  id: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  projectId: string;
  project: { slug: string; name: string; color: string };
}

/**
 * Retourne les bugs les plus proches d'un bug donné (hors lui-même).
 * Utilise les données réelles de la base.
 */
export async function findDuplicateBugs(
  bug: DuplicateCandidate,
  candidates?: DuplicateCandidate[],
  limit = 5,
): Promise<BugSimilarity[]> {
  const source = candidates ?? (await getOpenBugs());
  const text = `${bug.title} ${bug.description ?? ""}`;

  const results: BugSimilarity[] = [];
  for (const c of source) {
    if (c.id === bug.id) continue;
    const { score, shared } = cosineSimilarity(text, `${c.title} ${c.description ?? ""}`);
    if (score >= DUPLICATE_THRESHOLD) {
      results.push({
        bug: {
          id: c.id,
          title: c.title,
          severity: c.severity,
          status: c.status,
          projectId: c.projectId,
          project: c.project,
        },
        similarity: score,
        sharedTokens: shared,
      });
    }
  }

  return results.sort((x, y) => y.similarity - x.similarity).slice(0, limit);
}

/**
 * Détecte les paires de bugs en doublon parmi tous les bugs ouverts.
 * O(n²) — à utiliser par lots (limité à 200 bugs pour rester rapide).
 */
export async function findDuplicatePairs(limitBugs = 200): Promise<DuplicatePair[]> {
  const bugs = (await getOpenBugs()).slice(0, limitBugs);
  const pairs: DuplicatePair[] = [];

  for (let i = 0; i < bugs.length; i++) {
    for (let j = i + 1; j < bugs.length; j++) {
      const a = bugs[i];
      const b = bugs[j];
      if (!a || !b) continue;
      const { score, shared } = cosineSimilarity(
        `${a.title} ${a.description ?? ""}`,
        `${b.title} ${b.description ?? ""}`,
      );
      if (score >= DUPLICATE_THRESHOLD) {
        pairs.push({
          a: {
            id: a.id,
            title: a.title,
            severity: a.severity,
            status: a.status,
            projectId: a.projectId,
            project: a.project,
          },
          b: {
            id: b.id,
            title: b.title,
            severity: b.severity,
            status: b.status,
            projectId: b.projectId,
            project: b.project,
          },
          similarity: score,
          sharedTokens: shared,
        });
      }
    }
  }

  return pairs.sort((x, y) => y.similarity - x.similarity).slice(0, 50);
}

async function getOpenBugs(): Promise<DuplicateCandidate[]> {
  const bugs = await db.bug.findMany({
    where: { status: { in: ["NEW", "TRIAGED", "IN_PROGRESS"] } },
    select: {
      id: true,
      title: true,
      description: true,
      severity: true,
      status: true,
      projectId: true,
      project: { select: { slug: true, name: true, color: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return bugs as DuplicateCandidate[];
}
