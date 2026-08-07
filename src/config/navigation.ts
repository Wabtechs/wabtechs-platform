import {
  AppWindow,
  BarChart3,
  Bell,
  Blocks,
  BookOpen,
  Bookmark,
  Boxes,
  Briefcase,
  Bug,
  Building2,
  Calendar,
  CalendarCheck,
  CheckSquare,
  Code2,
  DollarSign,
  Download,
  FileBarChart,
  FileCode2,
  FileText,
  GitCompare,
  Github,
  GraduationCap,
  Headphones,
  HeartPulse,
  HelpCircle,
  KanbanSquare,
  Layers,
  LayoutDashboard,
  Mail,
  Map,
  MessageCircle,
  MessageSquare,
  PlayCircle,
  ScrollText,
  Settings,
  Smartphone,
  Sparkles,
  Star,
  Tag,
  Target,
  TrendingUp,
  Users,
  Video,
  Wallet,
  Zap,
} from "lucide-react";
import type { NavigationGroup, NavigationItem, PlatformModule, UserRole } from "@/types/navigation";

export const DEFAULT_MODULE_ID = "overview";
export const SYSTEM_MODULE_ID = "system";

export function getDefaultModule(): PlatformModule {
  const target = MODULES.find((item) => item.id === DEFAULT_MODULE_ID);
  if (!target) throw new Error(`Module par défaut introuvable : ${DEFAULT_MODULE_ID}`);
  return target;
}

const isPathActive = (pathname: string, href: string): boolean => {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
};

const itemMatches = (item: NavigationItem, pathname: string): boolean =>
  isPathActive(pathname, item.href) ||
  (item.children?.some((child) => itemMatches(child, pathname)) ?? false);

export function resolveModuleForPath(
  pathname: string,
  modules: PlatformModule[],
): PlatformModule | undefined {
  return modules.find((module) =>
    module.navigation.some((group) => group.items.some((item) => itemMatches(item, pathname))),
  );
}

export function getModulesForRole(role?: UserRole): PlatformModule[] {
  return MODULES.filter(
    (module) =>
      module.enabled &&
      (!module.roles ||
        module.roles.length === 0 ||
        (role !== undefined && module.roles.includes(role))),
  );
}

export const MODULES: PlatformModule[] = [
  {
    id: "overview",
    name: "Overview",
    description: "Vue d'ensemble de la plateforme",
    icon: LayoutDashboard,
    href: "/admin",
    enabled: true,
    navigation: [
      {
        id: "overview",
        title: "Overview",
        items: [
          { id: "dashboard", title: "Dashboard", href: "/admin", icon: LayoutDashboard },
          { id: "analytics", title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        ],
      },
    ],
  },
  {
    id: "project-os",
    name: "Project OS",
    description: "Pilotage produit, projets et objectifs",
    icon: Boxes,
    href: "/admin/os",
    enabled: true,
    navigation: [
      {
        id: "os-pilotage",
        title: "Pilotage",
        items: [{ id: "os-dashboard", title: "Dashboard", href: "/admin/os", icon: Boxes }],
      },
      {
        id: "os-execution",
        title: "Exécution",
        items: [
          { id: "os-projects", title: "Projets", href: "/admin/os/projects", icon: Layers },
          { id: "os-features", title: "Features", href: "/admin/os/features", icon: KanbanSquare },
          { id: "os-bugs", title: "Bugs", href: "/admin/os/bugs", icon: Bug },
          { id: "os-roadmap", title: "Roadmap", href: "/admin/os/roadmap", icon: Map },
          { id: "os-sprints", title: "Sprints", href: "/admin/os/sprints", icon: CalendarCheck },
          { id: "os-objectives", title: "Objectifs", href: "/admin/os/objectives", icon: Target },
          { id: "os-modules", title: "Modules", href: "/admin/os/modules", icon: Blocks },
        ],
      },
      {
        id: "os-monitoring",
        title: "Monitoring",
        items: [
          { id: "os-kpi", title: "KPI", href: "/admin/os/kpi", icon: TrendingUp },
          { id: "os-business", title: "Business", href: "/admin/os/business", icon: Wallet },
          { id: "os-health", title: "Santé", href: "/admin/os/health", icon: HeartPulse },
          { id: "os-ai", title: "IA", href: "/admin/os/ai", icon: Sparkles },
        ],
      },
      {
        id: "os-rapports",
        title: "Rapports",
        items: [
          { id: "os-reports", title: "Rapports", href: "/admin/os/reports", icon: FileBarChart },
          {
            id: "os-notifications",
            title: "Notifications",
            href: "/admin/os/notifications",
            icon: Bell,
          },
        ],
      },
    ],
  },
  {
    id: "content",
    name: "Content",
    description: "Contenus éditoriaux et Academy",
    icon: FileText,
    href: "/admin/posts",
    enabled: true,
    navigation: [
      {
        id: "content-editorial",
        title: "Éditorial",
        items: [
          { id: "content-posts", title: "Articles", href: "/admin/posts", icon: FileText },
          { id: "content-podcasts", title: "Podcasts", href: "/admin/podcasts", icon: Headphones },
          { id: "content-projects", title: "Projets", href: "/admin/projects", icon: Layers },
          { id: "content-pages", title: "Pages", href: "/admin/pages", icon: FileText },
          { id: "content-videos", title: "Vidéos", href: "/admin/videos", icon: Video },
          { id: "content-tutorials", title: "Tutoriels", href: "/admin/tutorials", icon: BookOpen },
          { id: "content-snippets", title: "Snippets", href: "/admin/snippets", icon: Code2 },
          { id: "content-tags", title: "Tags", href: "/admin/tags", icon: Tag },
        ],
      },
      {
        id: "content-academy",
        title: "Academy",
        items: [
          { id: "content-courses", title: "Cours", href: "/admin/courses", icon: GraduationCap },
          { id: "content-lessons", title: "Leçons", href: "/admin/lessons", icon: PlayCircle },
          {
            id: "content-templates",
            title: "Templates",
            href: "/admin/templates",
            icon: FileCode2,
          },
        ],
      },
    ],
  },
  {
    id: "sections-site",
    name: "Sections Site",
    description: "Contenus des sections du site public",
    icon: Briefcase,
    href: "/admin/services",
    enabled: true,
    navigation: [
      {
        id: "site-sections",
        title: "Sections Site",
        items: [
          { id: "site-services", title: "Services", href: "/admin/services", icon: Briefcase },
          { id: "site-skills", title: "Compétences", href: "/admin/skills", icon: Zap },
          { id: "site-resume", title: "Expériences", href: "/admin/resume-items", icon: Briefcase },
          { id: "site-plans", title: "Forfaits", href: "/admin/pricing-plans", icon: DollarSign },
          {
            id: "site-testimonials",
            title: "Témoignages",
            href: "/admin/testimonials",
            icon: Star,
          },
          { id: "site-clients", title: "Clients", href: "/admin/clients", icon: Building2 },
          { id: "site-faq", title: "FAQ", href: "/admin/faq-items", icon: HelpCircle },
        ],
      },
    ],
  },
  {
    id: "resources",
    name: "Resources",
    description: "Ressources, téléchargements et événements",
    icon: Bookmark,
    href: "/admin/resources",
    enabled: true,
    navigation: [
      {
        id: "resources",
        title: "Ressources",
        items: [
          { id: "resources-index", title: "Ressources", href: "/admin/resources", icon: Bookmark },
          {
            id: "resources-downloads",
            title: "Téléchargements",
            href: "/admin/downloads",
            icon: Download,
          },
          { id: "resources-roadmaps", title: "Roadmaps", href: "/admin/roadmaps", icon: Map },
          { id: "resources-events", title: "Événements", href: "/admin/events", icon: Calendar },
          {
            id: "resources-changelog",
            title: "Changelog",
            href: "/admin/changelogs",
            icon: GitCompare,
          },
        ],
      },
    ],
  },
  {
    id: "productivity",
    name: "Productivity",
    description: "Tâches, applications et conversations",
    icon: CheckSquare,
    href: "/admin/tasks",
    enabled: true,
    navigation: [
      {
        id: "productivity",
        title: "Productivité",
        items: [
          { id: "prod-tasks", title: "Tâches", href: "/admin/tasks", icon: CheckSquare },
          { id: "prod-apps", title: "Apps", href: "/admin/apps", icon: AppWindow },
          {
            id: "prod-chats",
            title: "Chats",
            href: "/admin/chats",
            icon: MessageCircle,
            badge: "3",
          },
        ],
      },
    ],
  },
  {
    id: "people",
    name: "People",
    description: "Utilisateurs, abonnés et messages",
    icon: Users,
    href: "/admin/users",
    enabled: true,
    navigation: [
      {
        id: "people",
        title: "Personnes",
        items: [
          { id: "people-users", title: "Utilisateurs", href: "/admin/users", icon: Users },
          { id: "people-subscribers", title: "Abonnés", href: "/admin/subscribers", icon: Mail },
          {
            id: "people-messages",
            title: "Messages",
            href: "/admin/messages",
            icon: MessageSquare,
          },
        ],
      },
    ],
  },
  {
    id: "system",
    name: "System",
    description: "Paramètres, audit et intégrations",
    icon: Settings,
    href: "/admin/settings",
    enabled: true,
    navigation: [
      {
        id: "system",
        title: "Système",
        items: [
          { id: "system-settings", title: "Paramètres", href: "/admin/settings", icon: Settings },
          { id: "system-audit", title: "Journal d'audit", href: "/admin/audit", icon: ScrollText },
          { id: "system-github", title: "GitHub", href: "/admin/github", icon: Github },
        ],
      },
    ],
  },
  {
    id: "mobile",
    name: "Mobile",
    description: "Builder mobile : apps, builds et releases",
    icon: Smartphone,
    href: "/admin/mobile",
    enabled: true,
    navigation: [
      {
        id: "mobile-apps",
        title: "Apps",
        items: [
          { id: "mobile-center", title: "Mobile Center", href: "/admin/mobile", icon: Smartphone },
          { id: "mobile-apps", title: "Applications", href: "/admin/mobile/apps", icon: AppWindow },
          { id: "mobile-builds", title: "Builds", href: "/admin/mobile/builds", icon: Boxes },
          {
            id: "mobile-releases",
            title: "Releases",
            href: "/admin/mobile/releases",
            icon: GitCompare,
          },
          {
            id: "mobile-certificates",
            title: "Certificats",
            href: "/admin/mobile/certificates",
            icon: Star,
          },
        ],
      },
      {
        id: "mobile-config",
        title: "Configuration",
        items: [
          {
            id: "mobile-settings",
            title: "Paramètres",
            href: "/admin/mobile/settings",
            icon: Settings,
          },
        ],
      },
    ],
  },
];

export const SYSTEM_NAV: NavigationGroup = {
  id: "system",
  title: "Système",
  items: [
    { id: "system-settings", title: "Paramètres", href: "/admin/settings", icon: Settings },
    { id: "system-audit", title: "Journal d'audit", href: "/admin/audit", icon: ScrollText },
    { id: "system-github", title: "GitHub", href: "/admin/github", icon: Github },
  ],
};

export { isPathActive };
