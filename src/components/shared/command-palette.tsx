"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  BookOpen,
  FolderGit2,
  Headphones,
  Hash,
  Video,
  Code2,
  GraduationCap,
  Map,
  Calendar,
  Wrench,
  Link,
  MessageSquare,
  Shield,
  FileCode,
  HelpCircle,
  Mail,
  Download,
  CreditCard,
  Clock,
  Home,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUIStore } from "@/stores/ui-store";

const PAGES = [
  { title: "Accueil", href: "/", icon: Home },
  { title: "Blog", href: "/blog", icon: FileText },
  { title: "Documentation", href: "/docs", icon: BookOpen },
  { title: "Projets", href: "/projects", icon: FolderGit2 },
  { title: "Podcast", href: "/podcast", icon: Headphones },
  { title: "Vidéos", href: "/videos", icon: Video },
  { title: "Snippets", href: "/snippets", icon: Code2 },
  { title: "Tutoriels", href: "/tutorials", icon: GraduationCap },
  { title: "Ressources", href: "/resources", icon: Link },
  { title: "Downloads", href: "/downloads", icon: Download },
  { title: "Communauté", href: "/community", icon: MessageSquare },
  { title: "Événements", href: "/events", icon: Calendar },
  { title: "Roadmaps", href: "/roadmaps", icon: Map },
  { title: "Open Source", href: "/open-source", icon: FolderGit2 },
  { title: "Newsletter", href: "/newsletter", icon: Mail },
  { title: "FAQ", href: "/faq", icon: HelpCircle },
  { title: "Contact", href: "/contact", icon: Mail },
  { title: "Support", href: "/support", icon: Wrench },
  { title: "Tarifs", href: "/pricing", icon: CreditCard },
  { title: "Changelog", href: "/changelog", icon: Clock },
  { title: "Politique de confidentialité", href: "/privacy", icon: Shield },
  { title: "Conditions d'utilisation", href: "/terms", icon: FileCode },
  { title: "À propos", href: "/about", icon: Hash },
  { title: "Dashboard", href: "/dashboard", icon: Hash },
  { title: "Admin", href: "/admin", icon: Hash },
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
