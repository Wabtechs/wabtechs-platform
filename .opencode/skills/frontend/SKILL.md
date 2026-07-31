---
name: frontend
description: Use when working on React frontend components, pages, hooks, Zustand store, TanStack Query, routing, or shadcn/ui components. Trigger on files under src/. Covers component creation, data fetching, state management, and React patterns.
---

# Frontend Skill

## Tech Stack
- React 19 + TypeScript (strict mode)
- Vite 8 (build tool, HMR)
- Tailwind CSS v4 (utility-first, `@import "tailwindcss"`)
- shadcn/ui primitives (Radix UI + class-variance-authority)
- Zustand v5 (global state: sidebar, dark mode, auth, notifications)
- TanStack Query v5 (server state: all data hooks in `use-data.ts`)
- React Router v8 (lazy-loaded route pages)

## Architecture

```
src/
  components/
    ui/           → shadcn/ui: badge, button, card, input, table, select, tabs, etc.
    layout/       → sidebar.tsx, header.tsx, layout.tsx, command-palette.tsx
    charts/       → recharts-chart.tsx
  pages/
    landing/      → index.tsx (public marketing page)
    auth/         → login.tsx, forgot-password.tsx
    dashboard/    → index.tsx (stats + charts + recent cases)
    patients/     → index.tsx, patient-detail.tsx
    clinical-cases/ → index.tsx, clinical-case-detail.tsx
    facilities/   → index.tsx, facility-detail.tsx
    users/        → index.tsx
    settings/     → index.tsx
    profile/      → index.tsx
    audit-log/    → index.tsx
    sync-center/  → index.tsx
    research/     → index.tsx
    notifications/→ index.tsx
  hooks/
    use-data.ts       → React Query hooks with mock fallback
    use-toast.ts      → toast notifications
    use-sync.ts       → offline sync
    use-online-status.ts → navigator.onLine
    use-offline-storage.ts → localStorage wrapper
  store/
    index.ts          → useAppStore (sidebar, darkMode, notifications, commandPalette)
    auth-store.ts     → useAuthStore (user, token, login, logout)
  services/
    api.ts            → fetch wrapper (API_BASE detection)
    api-hooks.ts      → mutation hooks
    sync-engine.ts    → offline sync engine
  lib/
    utils.ts          → cn(), formatDate(), formatNumber()
    mock-data.ts      → all mock data (fallback when backend offline)
  types/
    index.ts          → shared TypeScript interfaces
```

## Conventions

### New page
1. Create `src/pages/<name>/index.tsx`
2. Add route in `src/App.tsx` with `React.lazy()` import
3. Add sidebar link in `src/components/layout/sidebar.tsx`
4. Export `default` from page component

### Data fetching
```typescript
// In hooks/use-data.ts:
export function useMyData() {
  return useQuery({
    queryKey: ['my-resource'],
    queryFn: () => fetchWithFallback('/my-endpoint', mockMyData),
  });
}
```
Always provide mock fallback. Pages should handle `isLoading` and empty states.

### Component pattern (shadcn/ui)
```tsx
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MyComponent({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>...</CardContent>
    </Card>
  );
}
```

### State management
- **Zustand** for UI state (sidebar open, dark mode, command palette)
- **TanStack Query** for server state (all CRUD data)
- **localStorage** keys: `dhayaro_token`, `dhayaro_user`, `dhayaro_refresh_token`

### Import aliases
- `@/` → `src/` (configured in tsconfig and vite.config.ts)
- Always use `@/components/...`, `@/hooks/...`, `@/lib/...`, `@/types`

### Dark mode
- Store: `useAppStore().darkMode` (boolean)
- Toggle: adds/removes `.dark` class on `<html>`
- CSS variables defined in `src/index.css` `.dark` block
- Never use hardcoded `dark:bg-*` — rely on CSS variables via `bg-background`, `bg-card`, etc.

### Key files to reference
- `src/lib/mock-data.ts` — mock data arrays
- `src/types/index.ts` — all TypeScript interfaces
- `src/store/index.ts` — Zustand global store
- `src/store/auth-store.ts` — authentication store
- `src/hooks/use-data.ts` — all React Query hooks
- `src/services/api.ts` — API_BASE and fetch wrapper
