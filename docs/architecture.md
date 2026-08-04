# Architecture — Wabtechs Platform

## Vue d'ensemble

Application modulaire construite sur la stack commune de l'écosystème
Wabtechs : monolithe modulaire Next.js, découplé par **features**,
avec API First et accès à une base PostgreSQL.

## Couches

```
┌─────────────────────────────────────────────────┐
│  Frontend  (Next.js, React, shadcn/ui, Tailwind) │
├─────────────────────────────────────────────────┤
│  API         (Next.js API Routes / Server Actions) │
├─────────────────────────────────────────────────┤
│  Domaine      (features, use-cases, business logic)│
├─────────────────────────────────────────────────┤
│  Infrastructure (Drizzle ORM, PostgreSQL, Redis)  │
└─────────────────────────────────────────────────┘
```

## Décisions clés

- **Clean Architecture** : séparation présentation / domaine / infrastructure.
- **Feature First** : un dossier par feature (`src/features/<module>`).
- **API First** : contrats d'API partagés via `@wabtechs/api-contracts`.
- **Écosystème** : SSO, licences, notifications et monitoring fournis par
  la plateforme centrale / packages partagés.

## Arborescence

```
src/
├── app/            # Routes (App Router) + API
├── components/     # UI (shadcn) + composants feature
├── features/       # Modules fonctionnels
├── lib/            # Utilitaires, clients, config
├── server/         # Actions, requêtes, intégrations
├── stores/         # Zustand
├── types/          # Types partagés
└── config/         # Configuration
```

## Dépendances techniques

Voir README.md — Stack technique.

