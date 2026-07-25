import { db } from "@/lib/prisma";

let cache: Record<string, string> | null = null;
let cacheTime = 0;

export async function getSettings(): Promise<Record<string, string>> {
  if (cache && Date.now() - cacheTime < 60000) return cache;
  try {
    const settings = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    cache = map;
    cacheTime = Date.now();
    return map;
  } catch {
    return {};
  }
}

export function getSetting(settings: Record<string, string>, key: string, fallback: string): string {
  return settings[key] ?? fallback;
}

export function getJsonSetting<T>(settings: Record<string, string>, key: string, fallback: T): T {
  const val = settings[key];
  if (!val) return fallback;
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}
