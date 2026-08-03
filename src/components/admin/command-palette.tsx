"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Headphones,
  Layers,
  Tag,
  Users,
  Mail,
  MessageSquare,
  Settings,
  ScrollText,
  Plus,
  Globe,
  type LucideIcon,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { useUIStore } from "@/stores/ui-store";

interface CommandItem {
  label: string;
  href: string;
  icon: LucideIcon;
  shortcut?: string;
}

const PAGES: CommandItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, shortcut: "G D" },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, shortcut: "G A" },
  { label: "Articles", href: "/admin/posts", icon: FileText, shortcut: "G P" },
  { label: "Podcasts", href: "/admin/podcasts", icon: Headphones, shortcut: "G O" },
  { label: "Projets", href: "/admin/projects", icon: Layers, shortcut: "G J" },
  { label: "Tags", href: "/admin/tags", icon: Tag, shortcut: "G T" },
  { label: "Utilisateurs", href: "/admin/users", icon: Users, shortcut: "G U" },
  { label: "Abonnés", href: "/admin/subscribers", icon: Mail, shortcut: "G B" },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare, shortcut: "G M" },
  { label: "Paramètres", href: "/admin/settings", icon: Settings, shortcut: "G S" },
  { label: "Journal d'audit", href: "/admin/audit", icon: ScrollText, shortcut: "G L" },
];

const ACTIONS: CommandItem[] = [
  { label: "Nouvel Article", href: "/admin/posts/new", icon: Plus, shortcut: "N A" },
  { label: "Nouveau Podcast", href: "/admin/podcasts/new", icon: Plus, shortcut: "N O" },
  { label: "Voir le site", href: "/", icon: Globe, shortcut: "V S" },
];

export function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, toggleCommandPalette, closeCommandPalette } =
    useUIStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandPalette();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleCommandPalette]);

  const runCommand = (href: string) => {
    closeCommandPalette();
    router.push(href);
  };

  return (
    <CommandDialog open={isCommandPaletteOpen} onOpenChange={closeCommandPalette}>
      <CommandInput placeholder="Rechercher..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        <CommandGroup heading="Pages">
          {PAGES.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => runCommand(item.href)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
              {item.shortcut && (
                <CommandShortcut>{item.shortcut}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          {ACTIONS.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => runCommand(item.href)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
              {item.shortcut && (
                <CommandShortcut>{item.shortcut}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
