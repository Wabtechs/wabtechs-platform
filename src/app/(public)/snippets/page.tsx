import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Code2, Copy } from "lucide-react";

export const metadata: Metadata = {
  title: "Snippets",
  description: "Bibliothèque de snippets de code réutilisables pour TypeScript, React et Next.js.",
};

const SNIPPETS = [
  {
    title: "useDebounce",
    language: "TypeScript",
    description: "Hook React pour debounce une valeur avec délai configurable.",
    code: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
    tags: ["hooks", "react"],
  },
  {
    title: "formatDate",
    language: "TypeScript",
    description: "Formatage de dates en français avec options personnalisables.",
    code: `export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}`,
    tags: ["utils", "dates"],
  },
  {
    title: "cn (className merger)",
    language: "TypeScript",
    description: "Fusion de classes CSS avec clsx et tailwind-merge.",
    code: `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
    tags: ["utils", "tailwind"],
  },
  {
    title: "API Error Handler",
    language: "TypeScript",
    description: "Handler d'erreurs centralisé pour les API routes Next.js.",
    code: `import { NextResponse } from "next/server";

type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data } satisfies ApiResponse<T>, { status });
}

export function apiError(error: string, status = 400) {
  return NextResponse.json({ error } satisfies ApiResponse<never>, { status });
}`,
    tags: ["api", "nextjs"],
  },
  {
    title: "useLocalStorage",
    language: "TypeScript",
    description: "Hook pour persister un état dans le localStorage avec typage.",
    code: `import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
    tags: ["hooks", "browser"],
  },
  {
    title: "Prisma Singleton",
    language: "TypeScript",
    description: "Instance Prisma singleton pour éviter les connexions multiples en dev.",
    code: `import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;`,
    tags: ["prisma", "database"],
  },
  {
    title: "sleep utility",
    language: "TypeScript",
    description: "Fonction sleep pour les tests et animations.",
    code: `export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}`,
    tags: ["utils", "async"],
  },
  {
    title: "slugify",
    language: "TypeScript",
    description: "Conversion de chaîne en slug URL-friendly.",
    code: `export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}`,
    tags: ["utils", "strings"],
  },
  {
    title: "Abortable Fetch",
    language: "TypeScript",
    description: "Wrapper fetch avec timeout automatique et abort controller.",
    code: `export async function fetchWithTimeout(
  url: string,
  options?: RequestInit & { timeout?: number }
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options ?? {};
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { ...fetchOptions, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}`,
    tags: ["fetch", "network"],
  },
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  CSS: "bg-pink-500",
};

export default function SnippetsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Snippets"
          title="Code"
          highlight="Snippets"
          description="Fonctions et hooks réutilisables, prêts à copier-coller dans vos projets."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {SNIPPETS.map((snippet) => (
            <Card key={snippet.title} className="transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${LANG_COLORS[snippet.language] ?? "bg-gray-500"}`} />
                    <Badge variant="outline" className="text-xs">{snippet.language}</Badge>
                  </div>
                  <button
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title="Copier le code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <CardTitle className="text-base font-mono group-hover:text-primary transition-colors">
                  {snippet.title}
                </CardTitle>
                <CardDescription>{snippet.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed">
                  <code>{snippet.code}</code>
                </pre>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {snippet.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            <Code2 className="mr-1 inline h-4 w-4" />
            {SNIPPETS.length} snippets disponibles — plus à venir !
          </p>
        </div>
      </div>
    </div>
  );
}
