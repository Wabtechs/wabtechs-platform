import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export const SITE_CONFIG = {
  name: "Wabtechs",
  tagline: "Build. Ship. Scale.",
  description: "Plateforme technologique — Développement, Articles, Projets, Formations.",
  url: "https://wabtechs.com",
  ogImage: "https://wabtechs.com/og.png",
  author: "Emmanuel Mulonda Johannes",
  email: "contact@wabtechs.com",
  twitter: "@wabtechs",
  github: "https://github.com/wabtechs",
} as const;
