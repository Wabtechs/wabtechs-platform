"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { DocMeta } from "@/lib/mdx";

interface DocsSearchProps {
  docs: DocMeta[];
}

export function DocsSearch({ docs }: DocsSearchProps) {
  const [query, setQuery] = useState("");

  const results = query.length > 1
    ? docs.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query.toLowerCase()) ||
          doc.description.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Rechercher dans la documentation..."
        className="pl-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-40 mt-2 space-y-1">
          {results.map((doc) => (
            <Link key={doc.slug} href={`/docs/${doc.slug}`} onClick={() => setQuery("")}>
              <Card className="flex items-center gap-3 p-3 transition-all hover:shadow-md cursor-pointer">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{doc.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
      {query.length > 1 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-40 mt-2">
          <Card className="p-3 text-center text-sm text-muted-foreground">
            Aucun résultat pour « {query} »
          </Card>
        </div>
      )}
    </div>
  );
}
