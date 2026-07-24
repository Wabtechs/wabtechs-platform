"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, BookOpen, FolderGit2, Headphones, Hash } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUIStore } from "@/stores/ui-store";

const PAGES = [
  { title: "Accueil", href: "/", icon: Hash },
  { title: "Blog", href: "/blog", icon: FileText },
  { title: "Documentation", href: "/docs", icon: BookOpen },
  { title: "Projets", href: "/projects", icon: FolderGit2 },
  { title: "Podcast", href: "/podcast", icon: Headphones },
  { title: "Vidéos", href: "/videos", icon: Hash },
  { title: "Communauté", href: "/community", icon: Hash },
  { title: "Newsletter", href: "/newsletter", icon: Hash },
  { title: "FAQ", href: "/faq", icon: Hash },
  { title: "Contact", href: "/contact", icon: Hash },
  { title: "Dashboard", href: "/dashboard", icon: Hash },
  { title: "À propos", href: "/about", icon: Hash },
];

export function CommandPalette() {
  const { isCommandPaletteOpen, closeCommandPalette } = useUIStore();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = PAGES.filter((page) =>
    page.title.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = useCallback(
    (href: string) => {
      closeCommandPalette();
      setQuery("");
      router.push(href);
    },
    [closeCommandPalette, router],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        useUIStore.getState().toggleCommandPalette();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Dialog open={isCommandPaletteOpen} onOpenChange={(open) => !open && closeCommandPalette()}>
      <DialogContent className="gap-0 p-0 max-w-lg">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Rechercher une page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Aucun résultat.</p>
          ) : (
            <ul>
              {filtered.map((page) => {
                const Icon = page.icon;
                return (
                  <li key={page.href}>
                    <button
                      onClick={() => handleSelect(page.href)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {page.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
