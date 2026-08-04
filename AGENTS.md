# AGENTS.md — Wabtechs Platform

Contexte de travail pour les agents d'IA (et les développeurs) sur ce dépôt.

## Le projet

Wabtechs Platform fait partie de l'écosystème **Wabtechs Government Suite**, suite
logicielle privée de transformation numérique (Wabtechs Company).

## Règles d'or

- **Confidentialité** : code propriétaire. Ne jamais reproduire ni publier
  le contenu hors du dépôt privé.
- **Commits** : Conventional Commits (`feat:`, `fix:`, `docs:`...).
- **Qualité** : avant de considérer une tâche terminée, exécuter :
  ```bash
  npm run lint
  npm run typecheck
  npm test
  ```
- **Secrets** : aucun secret dans le code ou les fichiers versionnés.
- **Stack** : Next.js + React + TypeScript (strict) + Tailwind CSS +
  shadcn/ui + PostgreSQL + Drizzle ORM. Se conformer aux packages
  partagés `@wabtechs/*`.

## Structure

`src/` code applicatif (App Router) · `docs/` documentation ·
`.github/` CI + templates · `assets/` identité visuelle ·
`public/` fichiers statiques.

## Environnement de travail

Édition : opencode · CI : GitHub Actions · Déploiement : Vercel / Docker.

