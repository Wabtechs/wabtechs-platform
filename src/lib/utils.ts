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

export function formatDuration(totalSeconds: number): string {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.round((totalSeconds % 3600) / 60);
	if (hours > 0) return `${hours} h ${minutes} min`;
	return `${minutes} min`;
}

export const SITE_CONFIG = {
	name: "WabTechs",
	description:
		"Plateforme technologique — Développement, Articles, Projets, Formations.",
	url: "https://wabtechs.com",
	ogImage: "https://wabtechs.com/og.png",
	author: "Emmanuel Mulonda Johannes",
	email: "contact@wabtechs.com",
	twitter: "@wabtechs",
	github: "https://github.com/wabtechs",
} as const;
