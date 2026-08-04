# Déploiement — Wabtechs Platform

## Environnements

| Environnement | Plateforme | Branche |
|---------------|------------|---------|
| Preview | Vercel | PR / branches feature |
| Staging | Vercel | develop |
| Production | Vercel / Docker | master |

## Local (Docker Compose)

```bash
docker compose up -d
npm run dev
```

## Production (Vercel)

1. Connexion du dépôt GitHub dans Vercel.
2. Configuration des variables via **GitHub Secrets / Vercel Env**.
3. Déploiement automatique sur merge vers `master`.

## CI/CD

La pipeline GitHub Actions (`.github/workflows/ci.yml`) exécute :
lint → typecheck → tests → build, avant toute fusion.

## Infrastructures

- **PostgreSQL** : données applicatives (via Drizzle ORM).
- **Redis** : cache / files d'attente.
- **Stockage** : objets (S3-compatible) pour les fichiers.

