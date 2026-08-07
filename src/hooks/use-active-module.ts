"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getDefaultModule, getModulesForRole, resolveModuleForPath } from "@/config/navigation";
import type { PlatformModule, UserRole } from "@/types/navigation";

const STORAGE_KEY = "admin-sidebar:active-module";

function getStoredModuleId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function useActiveModule(role?: UserRole) {
  const pathname = usePathname();
  const router = useRouter();
  const [storedId, setStoredId] = useState<string | null>(getStoredModuleId);

  const modules = useMemo(() => getModulesForRole(role), [role]);

  const activeModule = useMemo<PlatformModule>(
    () =>
      resolveModuleForPath(pathname, modules) ??
      modules.find((module) => module.id === storedId) ??
      modules[0] ??
      getDefaultModule(),
    [pathname, modules, storedId],
  );

  const setActiveModule = useCallback(
    (id: string) => {
      const target = modules.find((module) => module.id === id);
      if (!target) return;
      setStoredId(id);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(id));
      } catch {
        // ignore storage errors
      }
      if (pathname !== target.href) router.push(target.href);
    },
    [modules, pathname, router],
  );

  return { activeModule, modules, setActiveModule };
}
