---
name: ui-fix
description: Use when fixing UI bugs, button handlers, dark mode issues, responsive design, toast notifications, or visual polish. Trigger on button clicks without handlers, missing dark mode styles, broken layouts, or when a user reports a visual issue.
---

# UI Fix Skill

## Common Issues

### Button without onClick
Every interactive button MUST have an `onClick` handler. If the feature isn't implemented, use a toast:
```tsx
import { useToast } from '@/hooks/use-toast';
const { toast } = useToast();

<Button onClick={() => toast({ title: "Bientôt disponible", description: "Cette fonctionnalité sera bientôt implémentée." })}>
  Action
</Button>
```

### Dark mode
- Toggle: `useAppStore().darkMode`
- CSS vars in `src/index.css` `.dark` block
- Use semantic classes: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`
- NEVER hardcode `dark:bg-slate-900` etc. — use CSS variables
- Sync between settings page and profile page

### localStorage Keys
- `dhayaro_token` — JWT access token
- `dhayaro_user` — serialized user object
- `dhayaro_refresh_token` — refresh token
- NEVER use `medinsight-access-token` or other variants

### Date/time display
```tsx
import { formatDate } from '@/lib/utils';
formatDate(cas.createdAt) // "10 juil. 2026"
```
Never hardcode `new Date("2024-01-01")` — use `new Date()` for "now".

### Toast notifications
```tsx
import { useToast } from '@/hooks/use-toast';
const { toast } = useToast();
toast({ title: "Succès", description: "Opération effectuée." });
toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
```

### Key files
- `src/index.css` — dark mode CSS variables
- `src/store/index.ts` — UI state (sidebar, darkMode, commandPalette)
- `src/store/auth-store.ts` — auth state (user, token)
- `src/components/ui/logo.tsx` — logo component (dark/light switch)
- `src/components/layout/sidebar.tsx` — sidebar navigation
- `src/components/layout/header.tsx` — header with notifications

### Patterns
- Use `useMemo` for computed values from arrays (never hardcode counts)
- Use `Link` from react-router for navigation, `useNavigate()` for programmatic
- Import `cn` from `@/lib/utils` for conditional classes
- All icons from `lucide-react`
