"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useActiveModule } from "@/hooks/use-active-module";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const ROUTE_MAP: Record<string, string> = {
  admin: "Dashboard",
  analytics: "Analytics",
  audit: "Journal d'audit",
  github: "GitHub",
  os: "Project OS",
  roadmap: "Roadmap",
  features: "Features",
  bugs: "Bugs",
  sprints: "Sprints",
  objectives: "Objectifs",
  modules: "Modules",
  kpi: "KPI",
  business: "Business",
  health: "Santé",
  ai: "IA",
  reports: "Rapports",
  notifications: "Notifications",
  posts: "Articles",
  podcasts: "Podcasts",
  projects: "Projets",
  pages: "Pages",
  videos: "Vidéos",
  tutorials: "Tutoriels",
  snippets: "Snippets",
  tags: "Tags",
  courses: "Cours",
  lessons: "Leçons",
  templates: "Templates",
  services: "Services",
  skills: "Compétences",
  "resume-items": "Expériences",
  "pricing-plans": "Forfaits",
  testimonials: "Témoignages",
  clients: "Clients",
  "faq-items": "FAQ",
  resources: "Ressources",
  downloads: "Téléchargements",
  events: "Événements",
  changelogs: "Changelog",
  tasks: "Tâches",
  apps: "Applications",
  chats: "Chats",
  users: "Utilisateurs",
  subscribers: "Abonnés",
  messages: "Messages",
  settings: "Paramètres",
  mobile: "Mobile",
  builds: "Builds",
  releases: "Releases",
  certificates: "Certificats",
  repos: "Repos",
  account: "Compte",
  profile: "Profil",
  appearance: "Apparence",
  display: "Affichage",
  environment: "Environnement",
  new: "Nouveau",
  edit: "Modifier",
  data: "Données",
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const { activeModule } = useActiveModule();

  const segments = pathname.split("/").filter(Boolean).slice(1);

  const moduleBase = activeModule.href.split("/").filter(Boolean).slice(1);
  let rest = segments;
  if (moduleBase.length > 0) {
    let i = 0;
    while (i < moduleBase.length && rest[0] === moduleBase[i]) {
      rest = rest.slice(1);
      i += 1;
    }
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: activeModule.name, href: activeModule.href },
    ...rest.map((segment, i) => {
      const isLast = i === rest.length - 1;
      const label = ROUTE_MAP[segment] ?? (segment.length > 24 ? "Détail" : segment);
      const href = isLast
        ? undefined
        : `/${["admin", ...moduleBase, ...rest.slice(0, i + 1)].join("/")}`;
      return { label, href };
    }),
  ];

  return (
    <nav className="flex items-center gap-1 text-sm">
      {breadcrumbs.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="text-sidebar-foreground/40 h-3.5 w-3.5" />}
          {item.href ? (
            <Link
              href={item.href}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sidebar-foreground font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
