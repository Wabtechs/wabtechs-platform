# Contributing — Wabtechs Platform

Merci de votre intérêt pour Wabtechs Platform. Ce dépôt fait partie de l'écosystème
propriétaire et confidentiel de Wabtechs Company.

## Règles d'accès

- Ce dépôt est **privé**. L'accès est réservé aux personnes autorisées.
- Toute contribution est soumise aux conditions de la licence propriétaire Wabtechs.
- Ne versionnez **jamais** de secret, clé API ou fichier d'environnement.

## Workflow

1. Créez une branche à partir de `master` :
   ```bash
   git checkout -b feat/mon-amelioration
   ```
2. Suivez la convention de commits (Conventional Commits) :
   `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
3. Poussez votre branche et ouvrez une **Pull Request**.
4. Toute PR doit passer la CI (lint, typecheck, tests) et être relue
   par au moins un mainteneur avant fusion.

## Standards de code

- TypeScript strict, pas d'erreur ESLint, formatage Prettier.
- Tests : Vitest (unitaire). Les nouvelles fonctionnalités doivent être testées.
- Composants UI : shadcn/ui + design system `@wabtechs/ui`.

## Signalement

Consultez SECURITY.md pour toute vulnérabilité.

