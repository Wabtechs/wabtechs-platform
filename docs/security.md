# Sécurité — Wabtechs Platform

## Principes

- **Confidentialité** : dépôt privé, logiciel propriétaire Wabtechs.
- **Secrets** : GitHub Secrets uniquement ; `.env*` exclus du versioning.
- **Données** : chiffrement en transit (TLS) et au repos (PostgreSQL).

## Application

- Authentification SSO centralisée + RBAC.
- Validation stricte des entrées (Zod).
- Journal d'audit des opérations sensibles.
- Rate limiting sur les endpoints publics.
- Headers de sécurité (CSP, HSTS, X-Frame-Options).

## Chaîne d'outils

- **Dependabot** : veille sur les dépendances (npm, docker, actions).
- **CodeQL** : analyse statique en CI.
- Revue de code obligatoire (PR).

## Signalement

Consulter SECURITY.md. Contact : licensing@wabtechs.com.

