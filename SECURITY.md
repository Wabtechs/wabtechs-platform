# Security Policy — Wabtechs Platform

Wabtechs Platform est un logiciel propriétaire confidentiel de Wabtechs Company.

## Signalement d'une vulnérabilité

Contactez-nous en privé : **licensing@wabtechs.com**

Ne publiez jamais une vulnérabilité dans une issue publique ou une PR
sans accord préalable de l'équipe de sécurité.

## Engagements

- **Dependabot** : mises à jour de sécurité hebdomadaires.
- **CodeQL** : analyse statique sur chaque push (branches `main`/protégées).
- **Secrets** : stockés exclusivement dans GitHub Secrets. Aucun secret
  versionné. Les fichiers `.env*` sont exclus du dépôt.
- **Branches protégées** : `main` (production) et `develop` (intégration)
  exigent une PR relue et des checks obligatoires.

## Processus de correction

1. Réception du rapport et tri (S1–S4).
2. Patch sur branche dédiée + tests de régression.
3. Release (hotfix) + mise à jour du CHANGELOG.
4. Divulgation coordonnée avec le rapporteur.

## Politique d'exposition

Ce dépôt est **privé**. Aucune information, copie ou extraction ne doit
quitter l'environnement Wabtechs sans autorisation écrite.

