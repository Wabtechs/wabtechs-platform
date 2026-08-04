# Installation — Wabtechs Platform

## Prérequis

- Node.js ≥ 20
- PostgreSQL ≥ 15
- Docker & Docker Compose (optionnel)

## Étapes

```bash
git clone https://github.com/Wabtechs/wabtechs-platform.git
cd wabtechs-platform
npm install
cp .env.example .env.local   # renseigner les variables
docker compose up -d          # PostgreSQL + Redis
npm run db:migrate            # Drizzle migrations
npm run dev
```

Ouvrir `http://localhost:3000`.

## Scripts npm

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Vérification TypeScript |
| `npm test` | Tests Vitest |

