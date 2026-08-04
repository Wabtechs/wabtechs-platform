# API — Wabtechs Platform

## Principes

- **REST / JSON**, préfixe `/api/v1`.
- Authentification **SSO Wabtechs** (OIDC) + RBAC.
- Contrats partagés versionnés dans `@wabtechs/api-contracts`.
- Réponses normalisées : `{ data | error, meta }`.
- Journalisation et **audit** de toute opération d'écriture.

## Points d'entrée (placeholder — à compléter)

| Méthode | Chemin | Description |
|---------|--------|-------------|
| GET | `/api/v1/health` | Santé du service |
| GET | `/api/v1/me` | Profil courant |
| POST | `/api/v1/auth/session` | Session SSO |

> La spécification OpenAPI complète sera générée et exposée dans
> `docs/openapi.yml` dès la mise en place des premiers endpoints.

