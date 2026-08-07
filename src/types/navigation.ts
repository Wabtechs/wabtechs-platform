import type { LucideIcon } from "lucide-react";

export type UserRole = "ADMIN" | "MODERATOR" | "USER";

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon?: LucideIcon;
  badge?: string | number;
  roles?: UserRole[];
  children?: NavigationItem[];
}

export interface NavigationGroup {
  id: string;
  title: string;
  items: NavigationItem[];
}

export interface PlatformModule {
  id: string;
  name: string;
  description?: string;
  icon: LucideIcon;
  href: string;
  version?: string;
  enabled: boolean;
  roles?: UserRole[];
  navigation: NavigationGroup[];
}
