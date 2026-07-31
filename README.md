# Wabtechs Platform v2

[![GitHub Sponsors](https://img.shields.io/github/sponsors/wabtechs?style=for-the-badge)](https://github.com/sponsors/wabtechs)
[![GitHub stars](https://img.shields.io/github/stars/wabtechs/wabtechs-platform?style=for-the-badge)](https://github.com/wabtechs/wabtechs-platform)
[![Build](https://img.shields.io/github/actions/workflow/status/wabtechs/wabtechs-platform/ci.yml?style=for-the-badge)](https://github.com/wabtechs/wabtechs-platform/actions)

Plateforme technologique officielle de **Wabtechs** — Blog, Documentation, Podcast, Vidéos, Projets Open Source, Communauté.

> Projet en développement actif. Architecture modulaire et évolutive conçue pour durer plusieurs années.
> 💖 Soutenez le projet via [GitHub Sponsors](https://github.com/sponsors/wabtechs).

---

## Stack technique

| Catégorie | Technologie |
|-----------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Langage | TypeScript (strict) |
| UI | React 19, shadcn/ui, Radix UI |
| Style | Tailwind CSS v4 (oklch colors) |
| Animations | Framer Motion |
| Icônes | Lucide React |
| Formulaires | React Hook Form + Zod |
| State | Zustand, TanStack Query |
| ORM | Prisma |
| Database | PostgreSQL |
| Cache | Redis |
| i18n | next-intl |
| MDX | next-mdx-remote |
| Thème | next-themes (dark/light) |
| Linting | ESLint 9 (flat config) |
| Formatting | Prettier + Tailwind plugin |

---

## Architecture

```
src/
├── app/                  # Routes Next.js App Router
│   ├── (marketing)/      # Pages publiques
│   ├── dashboard/        # Tableau de bord utilisateur
│   ├── admin/            # Administration
│   └── api/              # API routes
├── components/
│   ├── ui/               # Composants shadcn/ui
│   ├── layout/           # Navbar, Footer, Sidebar
│   ├── shared/           # Composants réutilisables
│   └── home/             # Composants spécifiques à l'accueil
├── features/             # Modules fonctionnels (blog, podcast, etc.)
├── hooks/                # Hooks React personnalisés
├── lib/                  # Utilitaires, validators, config
├── providers/            # Context providers (theme, query)
├── stores/               # Zustand stores
├── server/               # Server actions, queries
├── types/                # Types TypeScript partagés
├── config/               # Configuration du site
├── content/              # Contenu MDX (blog, docs)
├── emails/               # Templates email
└── styles/               # Styles globaux
prisma/
├── schema.prisma         # Schéma de base de données
└── migrations/           # Migrations Prisma
```

---

## Pages disponibles

| Route | Description |
|-------|-------------|
| `/` | Accueil — Hero, features, derniers articles, stats, CTA |
| `/about` | À propos — Valeurs et présentation |
| `/blog` | Blog — Articles avec recherche, tags, catégories |
| `/blog/[slug]` | Article — Table des matières, likes, commentaires |
| `/docs` | Documentation — Sidebar, recherche, code blocks |
| `/docs/[...slug]` | Page de documentation |
| `/projects` | Projets — Galerie open source |
| `/projects/[slug]` | Détail projet — Architecture, roadmap, démo |
| `/podcast` | Podcast — Lecteur audio, playlists, chapitres |
| `/videos` | Vidéos — Tutoriels et contenus YouTube |
| `/tutorials` | Tutoriels — Formations pas-à-pas |
| `/snippets` | Snippets — Bibliothèque de code réutilisable |
| `/resources` | Ressources — Outils et références |
| `/downloads` | Téléchargements — Fichiers et configs |
| `/roadmaps` | Roadmaps — Feuille de route |
| `/events` | Événements — Meetups et activités |
| `/open-source` | Open Source — Contributions |
| `/community` | Communauté — Forum, profils, classements |
| `/newsletter` | Newsletter — Inscription |
| `/sponsors` | Sponsors — Tiers de soutien via GitHub Sponsors |
| `/faq` | FAQ — Questions fréquentes |
| `/contact` | Contact — Formulaire validé (Zod) |
| `/dashboard` | Dashboard utilisateur |
| `/admin` | Dashboard administrateur |
| `/privacy` | Politique de confidentialité |
| `/terms` | Conditions d'utilisation |
| `/maintenance` | Page de maintenance |

---

## Démarrage rapide

### Prérequis

- Node.js 22+
- PostgreSQL (pour la base de données)
- Redis (optionnel, pour le cache)

### Installation

```bash
# Cloner le repository
git clone https://github.com/wabtechs/wabtechs-platform.git
cd wabtechs-platform

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers la base
npx prisma db push

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

### Commandes disponibles

```bash
npm run dev          # Serveur de développement (Turbopack)
npm run build        # Build de production
npm run start        # Lancer le build de production
npm run lint         # Linter le code
npm run lint:fix     # Corriger automatiquement
npm run format       # Formatter avec Prettier
npm run typecheck    # Vérifier les types TypeScript
```

### Base de données

```bash
npx prisma generate          # Générer le client Prisma
npx prisma db push           # Pousser le schéma
npx prisma migrate dev       # Créer une migration
npx prisma studio            # Ouvrir l'interface web
```

---

## Fonctionnalités

### Blog
- Articles MDX avec syntax highlighting
- Tags, catégories, séries
- Recherche full-text
- Table des matières automatique
- Likes, favoris, commentaires
- Temps de lecture estimé
- Articles liés
- RSS / Sitemap

### Podcast
- Lecteur audio professionnel
- Mini player flottant
- Playlists et files d'attente
- Lecture accélérée
- Chapitres et transcriptions
- Historique et favoris

### Documentation
- Sidebar de navigation
- Recherche instantanée
- Blocs de code avec copy button
- Versionning
- Guides, API docs, tutoriels

### Projets
- Présentation avec captures
- Stack technique
- Galerie d'images
- Roadmap et changelog
- Liens GitHub / Démo

### Communauté
- Profils utilisateurs
- Badges et réputation
- Système de commentaires
- Notifications
- Forum de discussions

### Dashboard Admin
- Analytics et statistiques
- Gestion des utilisateurs
- CRUD articles, podcasts, projets
- Modération des commentaires
- Paramètres SEO
- Logs d'audit
- Sauvegardes

---

## Design

- **Identité visuelle** : Gradient blue-violet, minimalist, premium
- **Thème** : Dark mode / Light mode (next-themes)
- **Typography** : Inter (sans-serif), JetBrains Mono (code)
- **Responsive** : Mobile-first, testé de 320px à 4K
- **Accessibilité** : WCAG, navigation clavier, ARIA, focus visibles
- **Animations** : Framer Motion — transitions fluides, micro-interactions
- **Glassmorphism** : Effet blur subtil sur la navbar

---

## SEO

- Metadata dynamique par page (OpenGraph, Twitter Cards)
- JSON-LD structuré
- Sitemap XML dynamique
- robots.txt
- RSS feed
- Canonical URLs
- Images optimisées (AVIF, WebP)
- Lighthouse score objectif : > 95

---

## Sécurité

- Headers de sécurité (X-Frame-Options, HSTS, CSP...)
- Validation côté client et serveur (Zod)
- Sanitization des entrées
- Rate limiting
- Protection XSS, CSRF, SQL Injection

---

## Déploiement

### Vercel (recommandé)

```bash
# Connecter le repository GitHub sur vercel.com
# Le déploiement est automatique
```

### Autres plateformes

```bash
npm run build
npm run start
```

Variables d'environnement à configurer :
- `DATABASE_URL` — URL de connexion PostgreSQL
- `REDIS_URL` — URL de connexion Redis
- `NEXTAUTH_SECRET` — Secret pour l'authentification

---

## Contribuer

1. Fork le repository
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'feat: add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

---

## Licence

Tous droits réservés © Wabtechs — Emmanuel Mulonda Johannes
