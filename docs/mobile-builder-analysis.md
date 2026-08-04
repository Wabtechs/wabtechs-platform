# Mobile App Builder — Analyse Architecture Wabtechs Platform

> **Date** : 3 août 2026
> **Analyse** : Architecture complète du repository `wabtechs-platform`
> **Objectif** : Intégrer un système complet de génération et gestion d'applications mobiles

---

## 1. Contexte Général

### Repository

- **URL** : https://github.com/Wabtechs/wabtechs-platform
- **Framework** : Next.js 16.3.0 (App Router + Turbopack)
- **React** : 19.2.4
- **TypeScript** : 5.7 (strict + strict flags)
- **ORM** : Prisma 6.19.3 (corrigé de l'AGENTS.md qui mentionnait Drizzle — **désynchronisation constatée**)
- **Database** : PostgreSQL
- **Package manager** : npm (Node 22)
- **Déploiement** : Vercel + Docker multi-stage

### Produits Wabtechs existants

1. **Santé Connect**
2. **Dhayaro**
3. **MyEduc360**
4. **SYRCOW ERP**
5. **Bilengi Marketplace**
6. **Archivium**

---

## 2. Architecture Technique Décrite

### 2.1 Framework & Tech Stack

| Couche           | Technology                    | Version       | Notes                                          |
| ---------------- | ----------------------------- | ------------- | ---------------------------------------------- |
| **Framework**    | Next.js                       | 16.3.0        | App Router, Turbopack, `output: "standalone"`  |
| **React**        | React                         | 19.2.4        | RC/stable                                      |
| **ORM**          | Prisma                        | 6.19.3        | `DATABASE_URL`, singleton client               |
| **Auth**         | NextAuth                      | 5.0.0-beta.32 | Credentials provider, JWT session              |
| **Styling**      | Tailwind CSS                  | v4            | No config file, inline `@theme` in globals.css |
| **UI**           | shadcn/ui                     | -             | Radix UI + clsx + tailwind-merge               |
| **Tables**       | TanStack Table                | 8.21.3        | Data tables                                    |
| **Forms**        | React Hook Form + Zod         | 7.54 + 3.24   | Validation                                     |
| **State**        | Zustand                       | 5.0.14        | UI state only                                  |
| **Server State** | TanStack Query                | 5.101.4       | Client components                              |
| **Charts**       | Recharts                      | 3.10.1        | Dashboard charts                               |
| **Animations**   | Framer Motion                 | 12.43.0       | Hero + dashboard                               |
| **Toasts**       | Sonner                        | 2.0.7         | Notifications                                  |
| **Thème**        | next-themes                   | 0.4           | Light/dark/system                              |
| **Emails**       | Resend                        | 6.18.1        | Transactional emails                           |
| **MDX**          | gray-matter + next-mdx-remote | 4 + 6.0.0     | Blog/docs content                              |
| **Icons**        | lucide-react                  | 0.511         | Icons                                          |
| **Tests Unit.**  | Vitest                        | 4.1.10        | 41 tests pass                                  |
| **Tests E2E**    | Playwright                    | 1.62.0        | 7 tests pass (chromium)                        |

### 2.2 Configuration CLI Disponible

| Outil                       | Status     | Notes                             |
| --------------------------- | ---------- | --------------------------------- |
| Android Studio              | Installé   | Détecté par l'environnement local |
| Android SDK                 | Disponible | `ANDROID_HOME` configuré          |
| Gradle Android              | Disponible | Version récupérée via Android SDK |
| Google Play Console API     | Prêt       | API REST disponible               |
| Apple App Store Connect API | Prêt       | API REST disponible               |

---

## 3. Structure des Dossiers

### 3.1 Layout de l'App Router

```
src/app/
├── (public)/                 # Route group: pages publiques
│   ├── layout.tsx            # Layout publique (Header + Footer)
│   ├── page.tsx              # Homepage
│   └── *.tsx                 # all public pages (about, blog, docs, etc.)
├── (auth)/                   # Route group: authentification
│   ├── login/page.tsx
│   └── register/page.tsx
├── admin/                    # Dashboard admin
│   ├── layout.tsx            # Admin layout (Sidebar + Header)
│   ├── page.tsx              # Dashboard home
│   ├── os/                   # Project OS (epics, features, bugs, etc.)
│   └── [entity]/             # CRUD entities
├── api/                      # API routes
│   ├── auth/[...nextauth]/
│   ├── admin/[entity]/
│   └── public routes
├── actions/                  # Server Actions
│   └── auth.ts               # logoutAction
├── globals.css               # Tailwind v4 + theme
├── layout.tsx                # Root layout (Providers wrapper)
├── robots.ts                 # Sitemap dynamique
└── sitemap.ts                # Sitemap dynamique (force-dynamic)
```

### 3.2 Structure src/

```
src/
├── app/              # App Router (routes)
├── components/       # Composants UI
│   ├── ui/           # shadcn/ui components
│   ├── shared/       # Composants partagés (newsletter, pagination, etc.)
│   ├── admin/        # Composants admin
│   ├── admin/os/     # OS components
│   ├── home/         # Landing page sections
│   ├── blog/         # Blog components
│   ├── docs/         # Docs components
│   ├── data-table/   # TanStack Table v8
│   └── layout/       # navbar + footer
├── lib/              # Utilitaires
│   ├── auth.ts       # NextAuth config
│   ├── auth-guard.ts # RBAC (requireAdmin, requireModerator)
│   ├── prisma.ts     # Prisma client singleton
│   ├── safe-handler.ts
│   ├── error.ts
│   ├── rate-limit.ts
│   ├── audit.ts
│   └── utils.ts      # cn(), formatDate(), SITE_CONFIG
├── providers/        # React Context providers
├── hooks/            # Hooks personnalisés
├── stores/           # Zustand stores
├── content/          # MDX content (blog, docs)
└── types/            # TypeScript interfaces
```

> **Note** : Il n'existe pas encore de dossier `src/modules/`. L'architecture actuelle n'utilise pas de pattern module. Nous allons créer `src/modules/mobile-builder/` comme **premier module fonctionnel** de la plateforme, établissant le pattern pour les futurs modules (Web → Mobile → Desktop).

---

## 4. Système d'Authentification

### 4.1 Stack Auth

- **NextAuth v5** (`next-auth@5.0.0-beta.32`)
- **Credentials Provider** uniquement (email + password)
- **Session strategy** : JWT (non persistante en DB)
- **Password hashing** : bcryptjs

### 4.2 Auth Routes

| Route                     | Méthode       | Description                                 |
| ------------------------- | ------------- | ------------------------------------------- |
| `/api/auth/[...nextauth]` | GET/POST      | NextAuth handlers                           |
| `/api/auth/register`      | POST          | Crée un utilisateur (role: USER)            |
| `/login`                  | Page          | Formulaire client → `signIn("credentials")` |
| `/register`               | Page          | Formulaire → POST puis auto-sign-in         |
| `/actions/auth.ts`        | Server Action | `logoutAction()`                            |

### 4.3 RBAC (Role-Based Access Control)

- **Roles** : `ADMIN` | `MODERATOR` | `USER`
- **Protection serveur** (page.tsx) : `auth()` + `redirect("/login")`
- **Protection API** : `requireAdmin()` / `requireModerator()` depuis `src/lib/auth-guard.ts`
- **Pattern** : `safeHandler()` wrapper + `requireAdmin()` + `createAuditLog()`

### 4.4 Providers

```
providers/index.tsx
  └── ThemeProvider (outer)
      └── AuthProvider (SessionProvider)
          └── QueryProvider (TanStack Query)
              └── PodcastProvider
                  └── AnalyticsProvider (PostHog)
```

---

## 5. Base de Données (Prisma Schema)

### 5.1 Schema Location

- **Fichier** : `prisma/schema.prisma` (936 lignes)
- **Migration** : `prisma/migrations/20260803120000_init/migration.sql` (1082 lignes)

### 5.2 Conventions du Schéma

| Convention     | Pattern                                                      |
| -------------- | ------------------------------------------------------------ |
| **ID**         | `String @id @default(cuid())`                                |
| **Slug**       | `String @unique`                                             |
| **Published**  | `Boolean @default(false)`                                    |
| **Timestamps** | `createdAt DateTime @default(now())`, `updatedAt @updatedAt` |
| **SEO**        | `metaTitle`, `metaDescription`, `ogImage`                    |
| **Relations**  | Explicit `@relation(fields: [...], references: [...])`       |

### 5.3 Models Existantes (extrait)

```prisma
model User { ... }          // Auth
model Post { ... }          // Blog
model Project { ... }       // Portfolio
model Course, Lesson, Enrollment { ... }  // Academy
model Template { ... }      // Templates marketplace
model Testimonial, Client, Service, Skill, ...  // Config
model OsProject { ... }     // Project OS
model Feature, Bug, Module, Epic, ...  // OS entities
model AuditLog { ... }      // Audit
model SiteSetting { ... }   // Settings
model PageView { ... }      // Analytics
```

### 5.4 Enums

- `Role` : `USER`, `ADMIN`, `MODERATOR`
- `OsProjectStatus` : `ACTIVE`, `PAUSED`, `ARCHIVED`
- `OsProjectType` : `SAAS`, `MARKETPLACE`, `PORTAL`, `MOBILE_APP`, `DESKTOP_APP`, `API`, `MICROSERVICE`
- `Priority` : `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `FeatureStatus`, `BugStatus`, `BugSeverity`, `SprintStatus`, `ObjectiveStatus`

---

## 6. Conventions de Code

### 6.1 ESLint (Flat Config)

```javascript
// eslint.config.mjs
- extends: next/core-web-vitals, next/typescript
- react-hooks/set-state-in-effect: "warn"   (localStorage reads ok)
- react-hooks/incompatible-library: "off"   (TanStack Table)
- global ignores: .next/, out/, build/, _backup-old-*/
```

### 6.2 Prettier

```json
// .prettierrc
- semi: true, singleQuote: false, trailingComma: "all"
- tabWidth: 2, useTabs: false, printWidth: 100
- plugin: prettier-plugin-tailwindcss (sort classes)
```

### 6.3 Husky + Lint-staged

```bash
# .husky/pre-commit
npx lint-staged

# package.json
"lint-staged": {
  "*.{js,ts,tsx,mjs,cjs,json}": ["eslint --fix", "prettier --write"],
  "*.{md,css}": ["prettier --write"]
}
```

### 6.4 Patterns Clés

1. **Server Components** (défaut) : data fetching direct `await db.xxx.findMany()`
2. **Client Components** : `"use client"` en première ligne
3. **Admin pages** : `export const dynamic = "force-dynamic"` (anti-cache)
4. **API routes** : `safeHandler()` + `requireAdmin()` + `createAuditLog()`
5. **Composants UI** : shadcn pattern (`cn()` + `clsx` + `tailwind-merge`)
6. **`cn()` utility** : `src/lib/utils.ts`
7. **Imports** : alias `@/` → `./src/`

### 6.5 Style Tailwind

- **Pas de config file** : Tailwind via `@import "tailwindcss"` dans `globals.css`
- **Theme inline** : `@theme { --color-background: oklch(...); }`
- **Classes custom** : `.theme-btn`, `.for-bgc-black`, `.service-item`, etc.

---

## 7. CI/CD & Déploiement

### 7.1 GitHub Actions

| Workflow      | Triggers         | Jobs                              |
| ------------- | ---------------- | --------------------------------- |
| `ci.yml`      | push/PR master   | lint, typecheck, test, build, e2e |
| `codeql.yml`  | push, PR, weekly | CodeQL security scan              |
| `release.yml` | git tag `v*`     | GitHub Release                    |

### 7.2 CI Build (job `build` dans ci.yml)

```yaml
- npm ci
- npx prisma generate
- npm run build
env:
  DATABASE_URL: postgresql://postgres:postgres@localhost:5432/wabtechs
```

> **Important** : Le job build n'a **pas** de service Postgres. Toutes les routes
> metadata dynamiques (`sitemap.ts`) utilisent `await connection()` (force-dynamic)
> pour éviter les erreurs de build.

### 7.3 CI E2E (job `e2e` dans ci.yml)

```yaml
services:
  postgres:
    image: postgres:16
    env: POSTGRES_USER/PASSWORD: postgres, POSTGRES_DB: wabtechs
    healthcheck: pg_isready
env:
  DATABASE_URL: postgresql://postgres:postgres@localhost:5432/wabtechs
  E2E_WEB_COMMAND: npm run start
steps:
  - npm ci
  - npx prisma migrate deploy
  - npm run seed
  - npx playwright install --with-deps chromium
  - npm run build
  - npm run test:e2e
```

### 7.4 Docker (multi-stage)

```dockerfile
# Stage 1: deps — node:22-alpine
# Stage 2: builder — node:22-alpine + build
# Stage 3: runner — node:22-alpine (non-root)
```

### 7.5 docker-compose.yml

```yaml
services:
  db: postgres:16-alpine (port 5432, healthcheck)
  app: build from . (depends on db)
```

### 7.6 Vercel

- `next.config.ts` : `output: "standalone"`
- Project ID : `prj_ja16RxrozfFH6hjk4qIrixGyDKQE`
- Headers de sécurité configurés (CSP, HSTS, etc.)

---

## 8. Recommandations pour le Mobile App Builder

### 8.1 Pattern à Respecter

1. **Routes** : Créer `admin/mobile/` (dashboard admin) + `(public)/mobile` (page publique)
2. **API** : `api/admin/mobile/[entity]/route.ts` avec `safeHandler` + `requireAdmin`
3. **Composants** : shadcn + `cn()` + lucide-react
4. **Schema Prisma** : Nouveau fichier `prisma/mobile-schema.prisma` (ou ajouter au schema principal)
5. **Dynamic** : `force-dynamic` sur toutes les pages admin

### 8.2 Intégration Capacitor

- **Installation** : `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios`
- **Config** : générer `capacitor.config.ts` par application
- **Native** : `android/` + `ios/` générés dynamiquement par build

### 8.3 CI/CD Mobile

```yaml
# .github/workflows/mobile-build.yml
jobs:
  android-build:
    runs-on: ubuntu-latest
    container:
      # Use Android SDK image
    steps:
      - checkout
      - setup Android SDK
      - npm ci + prisma generate
      - nx cap sync android
      - cd android && ./gradlew assembleDebug
      - upload APK/AAB artifacts

  ios-build:
    runs-on: macos-latest
    # Similar flow for iOS (IPA)
```

### 8.4 Sécurité

- Secrets chiffrés via `encrypted_secret` (AES-256-GCM via `@/lib/encryption`)
- RBAC : `requireAdmin()` sur toutes les routes API
- Audit logs : `createAuditLog()` pour chaque action
- Validation : Zod schemas pour tous les inputs

### 8.5 Environnement Local

- Detection automatique : Android SDK, Java/JDK, Gradle, Android Build Tools
- Page `/mobile/settings/environment` : diagnostics en temps réel
- Commandes documentées : `npx cap sync android`, `./gradlew assembleRelease`, etc.

---

## 9. Impact sur le Repository Existant

| Élément                              | Impact                                                                                                                        | Risque                      |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `package.json`                       | +4 dépendances (@capacitor/core, cli, android, ios)                                                                           | Low (devDependencies)       |
| `prisma/schema.prisma`               | +6 models (mobile_apps, mobile_builds, mobile_certificates, mobile_releases, store_integrations, mobile_audit_logs) + 4 enums | Low (migration)             |
| `src/modules/mobile-builder/`        | Nouveau dossier (isolation)                                                                                                   | None                        |
| `src/app/admin/mobile/`              | Nouvelles routes admin                                                                                                        | None                        |
| `.github/workflows/mobile-build.yml` | Nouveau workflow                                                                                                              | None (n'impacte pas ci.yml) |
| `docs/mobile-builder.md`             | Documentation                                                                                                                 | None                        |

> ✅ Aucune modification des fonctionnalités existantes prévue.

---

## 10. Résumé

Le Wabtechs Platform est une application Next.js 16 moderne avec :

- Architecture App Router + route groups
- Prisma + PostgreSQL
- NextAuth v5 (Credentials provider)
- shadcn/ui + Tailwind CSS v4
- Pattern admin (force-dynamic + safeHandler + requireAdmin + createAuditLog)
- CI/CD GitHub Actions (lint, build, e2e) + Docker (multi-stage) + Vercel

Le Mobile App Builder s'intègrera comme un **module isolé** (`src/modules/mobile-builder/`) suive le même pattern que le reste du codebase, sans rien casser.
