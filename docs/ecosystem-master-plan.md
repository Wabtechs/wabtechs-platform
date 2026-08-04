# Wabtechs Government Suite — Plan-maître de l'écosystème GitHub

> **Statut** : Approuvé pour exécution progressive · **Version** : 1.0 · **Date** : Août 2026
> **Propriétaire** : Wabtechs Company · **Confidentialité** : Interne / Stratégique

---

## 0. Décisions prises (Août 2026)

| Décision | Choix |
|---|---|
| Phase de départ | Phase 0 + 1 (fondations + 6 produits) |
| Visibilité de `wabtechs-platform` / `Dhayaro` | **Reporté** — restent publics pour l'instant (rappel : risque de fuite d'IP) |
| `sante_connect` | **Gardé séparé** de `Dhayaro` (pas de fusion) |
| Branche par défaut | Conservée (`master` / `main`) — pas de rename |
| Scope GitHub `workflow` | Accordé via device-flow (code `E327-DBA1`) — nécessaire pour pousser `.github/workflows/*` |

## 1. Contexte et objectif

Wabtechs Company construit la plus grande suite logicielle africaine de transformation numérique
(gouvernements, ministères, administrations, collectivités, santé, éducation, entreprises, ONG,
organisations internationales) — avec pour marché initial la RDC puis l'Afrique.

Ce document pose les fondations **avant** toute génération de code :

1. L'organisation des dépôts GitHub.
2. Les conventions de nommage.
3. Les dépendances communes.
4. Le plan de création par phases (priorité, effort, risque, bénéfice).

Tous les dépôts sont **confidentiels, propriétaires, privés**, protégés par le droit d'auteur de
Wabtechs Company. Aucun code n'est publié en Open Source.

---

## 2. État des lieux — audit des dépôts existants (Août 2026)

| Dépôt | Visibilité | Branche défaut | État | Action |
|---|---|---|---|---|
| `Wabtechs/wabtechs-platform` | **PUBLIC** ❌ | `master` | App active (Next.js 16, Prisma, CI) | Passer en **privé**, renommer branche `main`, enrichir docs |
| `Wabtechs/Dhayaro` | **PUBLIC** ❌ | `main` | Existant (santé) | Passer en **privé**, harmoniser structure |
| `Wabtechs/Taxium` | PRIVATE ✅ | `master` | Existant (fiscalité, RDC) | Renommer branche `main`, harmoniser structure |
| `Wabtechs/Archivium` | PRIVATE ✅ | `main` | Existant (GED) | Harmoniser structure |
| `Wabtechs/sante_connect` | PRIVATE ✅ | `main` | Santé (précurseur Dhayaro) | **Fusionner ou archiver** dans `Dhayaro` (décision à valider) |

**Manquants** : `MyEduc360`, `Bilengi Marketplace` + les 35 projets `360` + les dépôts d'infrastructure commune.

> ⚠️ **Risque majeur détecté** : `wabtechs-platform` et `Dhayaro` sont publics.
> Ils contiennent des actifs stratégiques et du code propriétaire → passage en privé **prioritaire**.

---

## 3. Principes directeurs

1. **Un écosystème, une charte** : même design system, même structure, mêmes standards (qualité, UX,
   sécurité, documentation, licences, configuration).
2. **Modularité** : chaque produit vit dans son propre dépôt et peut évoluer, être déployé et vendu
   indépendamment.
3. **Fondations partagées** : SSO, RBAC, audit, notifications, IA, paiements, logs, interopérabilité
   sont construits **une seule fois** dans des packages communs réutilisés par tous.
4. **Interopérabilité** : API First, contrats d'API versionnés partagés, événements inter-produits.
5. **Sécurité par défaut** : dépôts privés, branches protégées, GitHub Secrets, Dependabot,
   Code Scanning, aucun secret versionné.
6. **Évolutivité** : Cloud Ready (Vercel), Offline Ready, Docker, CI/CD dès le premier jour.

---

## 4. Organisation des dépôts GitHub

### 4.1 Compte / organisation

- Tout appartient à **`Wabtechs`** (organisation ou compte).
- L'organisation produit sera `Wabtechs` ; les équipes privées (Core, Santé, Éducation, Gov, QA)
  gèreront des sous-ensembles de dépôts.

### 4.2 Familles de dépôts

| Famille | Exemple | Règle |
|---|---|---|
| **Plateforme centrale** | `wabtechs-platform` | SSO, licences, API Gateway, billing, monitoring, admin |
| **Produits de marque** | `dhayaro`, `myeduc360`, `archivium`, `taxium`, `bilengi-marketplace` | Nom de marque en minuscules, `-` entre mots |
| **Famille 360** | `gov360`, `civil360`, `justice360`, … | `{domaine}360`, tout en minuscules |
| **Fondations partagées** | `wabtechs-packages`, `wabtechs-design-system`, `wabtechs-api-contracts` | Préfixe `wabtechs-` |
| **Infrastructure** | `wabtechs-infra`, `wabtechs-repo-template` | Préfixe `wabtechs-` |
| **Déploiement/plateforme** | `wabtechs-deploy` | Préfixe `wabtechs-` |

### 4.3 Conventions de nommage

- **Dépôts** : `lowercase-kebab-case`. Pas d'accent, pas de majuscule, pas d'underscore
  (correction : `sante_connect` → `dhayaro`).
- **Branches** : `main` (production) + `develop` (intégration) + `feat/`, `fix/`, `chore/`, `docs/`,
  `release/`. Protection obligatoire de `main` et `develop`.
- **Versions** : SemVer (`1.2.3`). `CHANGELOG.md` tenu à jour (convention Keep a Changelog).
- **Packages npm privés** : `@wabtechs/<package>` publiés sur GitHub Packages (registry privé).
- **Images Docker** : `ghcr.io/wabtechs/<service>:<tag>`.
- **Tags git** : `v<major>.<minor>.<patch>`.

---

## 5. Dépendances communes (stack de référence)

| Couche | Technologie |
|---|---|
| Framework | Next.js (App Router) |
| Langage | TypeScript (strict) |
| UI | React, Tailwind CSS, shadcn/ui, Radix UI |
| Forms / Validation | React Hook Form + Zod |
| State / Data | Zustand, TanStack Query |
| ORM | Drizzle ORM (norme écosystème) — Prisma toléré en migration |
| Base de données | PostgreSQL |
| Cache / Queue | Redis |
| Auth | SSO Wabtechs (NextAuth) + RBAC |
| Paiements | Gateway commune (adaptateurs) |
| IA | Moteur IA commun (LLM) |
| Logs / Monitoring | OpenTelemetry + plateforme centrale |
| Conteneurisation | Docker, Docker Compose |
| CI/CD | GitHub Actions, Vercel, Cloudflare |
| Tests | Vitest (unitaire), Playwright (E2E), pytest (services python) |
| Qualité | ESLint, Prettier, `tsc --noEmit` en CI |

> ⚠️ **Écart** : la stack commune prévoit Drizzle ORM, le dépôt `wabtechs-platform` utilise Prisma.
> → La migration vers Drizzle est planifiée dans la Phase 1 (risque maîtrisé, données abstraites
> derrière la couche repository).

### 5.1 Packages partagés (`wabtechs-packages` — monorepo npm workspace)

| Package | Rôle |
|---|---|
| `@wabtechs/ui` | Design System + composants shadcn personnalisés + thèmes |
| `@wabtechs/auth` | SSO, sessions, RBAC, permissions |
| `@wabtechs/db` | Schémas Drizzle, migrations, seed |
| `@wabtechs/api-contracts` | Contrats d'API versionnés, DTO, schémas Zod partagés |
| `@wabtechs/audit` | Journal d'audit normalisé |
| `@wabtechs/notifications` | Notification engine (email, SMS, in-app, push) |
| `@wabtechs/ai` | Moteur IA commun (LLM, prompts, modération) |
| `@wabtechs/billing` | Facturation, licences, paiements |
| `@wabtechs/logging` | Logs structurés, OpenTelemetry |
| `@wabtechs/config` | Configuration commune, feature flags |

---

## 6. Squelette standard d'un dépôt produit

Chaque dépôt (produit ou 360) reproduit **exactement** cette structure :

```
<repo>/
├── .github/
│   ├── ISSUE_TEMPLATE/        # bug_report, feature_request, security_report
│   ├── workflows/             # ci.yml, release.yml, codeql.yml, dependabot.yml
│   └── pull_request_template.md
├── assets/                    # logo, favicon, screenshots, mockups
├── docs/
│   ├── vision.md
│   ├── roadmap.md
│   ├── architecture.md
│   ├── modules.md
│   ├── api.md
│   ├── deployment.md
│   ├── branding.md
│   ├── security.md
│   └── installation.md
├── src/
├── public/
├── scripts/
├── .gitignore
├── AGENTS.md
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE                # Licence propriétaire Wabtechs
├── README.md
├── ROADMAP.md
├── SECURITY.md
├── docker-compose.yml
└── package.json
```

**Mécanismes GitHub activés sur chaque dépôt** :
Issues · Projects (board produit) · Milestones · Wiki · Discussions · Labels standardisés ·
Branch protection (`main`/`develop`) · Dependabot · Code Scanning (CodeQL) · GitHub Secrets ·
environnements `preview` / `production` · templates d'issues et de PR.

---

## 7. Charte commune

- **Design System** : unique (couleurs, typographie, espacements, composants, dark mode) —
  distribué via `@wabtechs/ui`.
- **Licence** : propriétaire Wabtechs (« All Rights Reserved »). Toute reproduction, distribution ou
  utilisation sans autorisation écrite est interdite. Mention obligatoire dans chaque README.
- **Sécurité** : politique commune (`SECURITY.md`), rapport de vulnérabilité privé, pas de secret
  versionné, `.gitignore` complet.
- **Gouvernance de code** : `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, convention de commits
  (Conventional Commits), PR review obligatoire.
- **Marque** : chaque produit a son identité (nom marketing, slogan, couleurs, icône) documentée
  dans `docs/branding.md` + `assets/`.

---

## 8. Fondations partagées (construites une seule fois)

| Fondation | Livré par | Consommé par |
|---|---|---|
| SSO / gestion utilisateurs | `wabtechs-platform` | Tous |
| RBAC / rôles | `@wabtechs/auth` | Tous |
| API Gateway | `wabtechs-platform` | Tous |
| Billing / licences / paiements | `wabtechs-platform` + `@wabtechs/billing` | Tous |
| Notifications | `@wabtechs/notifications` | Tous |
| IA | `@wabtechs/ai` | Tous |
| Logs / monitoring | `wabtechs-platform` + `@wabtechs/logging` | Tous |
| Audit | `@wabtechs/audit` | Tous |
| Interopérabilité / FHIR (santé) | `dhayaro` | Secteur santé |

---

## 9. Plan de création par phases

### Phase 0 — Fondation écosystème *(priorité : CRITIQUE — tout en dépend)*

| Tâche | Effort | Risque | Bénéfice |
|---|---|---|---|
| Passage en privé de `wabtechs-platform` et `Dhayaro` | S | ⚠️ Leak existant | Conformité confidentialité |
| Création `wabtechs-repo-template` (squelette standard) | M | Faible | Homogénéité 100 % |
| Création `wabtechs-packages` (monorepo npm workspace) | M | Moyen (Drizzle/prisma) | Fondations réutilisables |
| Création `wabtechs-design-system` | M | Moyen | Marque + UX unifiées |
| Standardisation labels/milestones/projects/équipes GitHub | S | Faible | Gouvernance |
| CI/CD + branch protection + Dependabot + CodeQL sur tous les dépôts | M | Faible | Qualité continue |

**Décisions à valider en Phase 0** : sort de `sante_connect` (fusion/archivage), migration
Prisma → Drizzle, licence propriétaire type.

### Phase 1 — Produits existants (noyau commercial) *(priorité : HAUTE)*

| Dépôt | Secteur | Effort | Risque | Bénéfice |
|---|---|---|---|---|
| `wabtechs-platform` | Plateforme centrale | L | Moyen | Hub SSO/billing/monitoring |
| `dhayaro` | Santé | L | Moyen | 1er produit santé commercialisable |
| `myeduc360` | Éducation | L | Moyen | 1er produit éducation |
| `archivium` | GED | M | Faible | Revenus B2B rapides |
| `taxium` | Fiscalité | L | Moyen | Contrats gouvernementaux RDC |
| `bilengi-marketplace` | Marketplace | L | Moyen | Revenus B2B/B2C |

### Phase 2 — État civil, citoyen et finances (socle RDC) *(priorité : HAUTE)*

`gov360` · `civil360` · `citizen360` · `justice360` · `finance360` · `budget360` · `payment360` · `hr360`

- **Effort** : L · **Risque** : Moyen (données sensibles, réglementaire) · **Bénéfice** : adoption
  gouvernementale de masse, contrat-cadre DRC.

### Phase 3 — Fonctions régaliennes et documentaires *(priorité : MOYENNE)*

`police360` · `immigration360` · `customs360` · `document360` · `archive360` · `statistics360` ·
`election360` · `parliament360` · `license360` · `audit360` · `procurement360`

- **Effort** : L · **Risque** : Élevé (sécurité nationale, interopérabilité institutionnelle) ·
  **Bénéfice** : socle « État numérique » complet et différenciant.

### Phase 4 — Secteurs économiques *(priorité : MOYENNE)*

`agri360` · `land360` (cadastre) · `energy360` · `water360` · `transport360` · `road360` ·
`mining360` · `tourism360` · `environment360`

- **Effort** : M–L · **Risque** : Moyen · **Bénéfice** : revenus sectoriels, crédibilité
  internationale.

### Phase 5 — Développement social *(priorité : BASSE)*

`employment360` · `youth360` · `women360` · `housing360` · `disaster360` · `culture360` · `sport360`

- **Effort** : M · **Risque** : Faible · **Bénéfice** : portée sociale + partenaires ONG/internationaux.

---

## 10. Méthode de création (scaffolding automatisé)

1. **Template** : `wabtechs-repo-template` sert de squelette de référence.
2. **Générateur** : script (`scripts/`) qui clone le template, applique la carte d'identité du projet
   (nom, description, modules, branding, roadmap, licence) et génère tous les fichiers standard.
3. **Création GitHub** : `gh repo create Wabtechs/<name> --private --enable-wiki --enable-discussions
   --template=Wabtechs/wabtechs-repo-template` puis application automatique des paramètres
   (labels, milestones, projects, branch protection, Dependabot, CodeQL, secrets).
4. **Déploiement** : CI/CD standard (`ci.yml`) adapté à chaque produit ; déploiement Vercel/Cloudflare
   paramétré via GitHub Secrets.
5. **Contrôle qualité** : CI exécute lint, typecheck, tests unitaires (Vitest) avant tout merge sur
   `develop`/`main`.

---

## 11. Sécurité et confidentialité (règles bloquantes)

- Dépôts **privés** exclusivement. Aucun passage en public sans validation écrite explicite.
- Branches `main` et `develop` **protégées** (PR requise, checks obligatoires, pas de push direct).
- Secrets → **GitHub Secrets** uniquement ; `.env*` exclus du versioning.
- **Dependabot** (security + version updates) et **CodeQL** activés sur tous les dépôts.
- Chaque README mentionne le caractère **confidentiel et propriétaire** du projet.
- Attribution d'accès par **équipes privées** (Core, Santé, Éducation, Gov, Sectoriel, QA).

---

## 12. Récapitulatif du portefeuille (41 dépôts produits)

- **Phase 1 (6)** : `wabtechs-platform`, `dhayaro`, `myeduc360`, `archivium`, `taxium`,
  `bilengi-marketplace`
- **Phase 2 (8)** : `gov360`, `civil360`, `citizen360`, `justice360`, `finance360`, `budget360`,
  `payment360`, `hr360`
- **Phase 3 (11)** : `police360`, `immigration360`, `customs360`, `document360`, `archive360`,
  `statistics360`, `election360`, `parliament360`, `license360`, `audit360`, `procurement360`
- **Phase 4 (9)** : `agri360`, `land360`, `energy360`, `water360`, `transport360`, `road360`,
  `mining360`, `tourism360`, `environment360`
- **Phase 5 (7)** : `employment360`, `youth360`, `women360`, `housing360`, `disaster360`,
  `culture360`, `sport360`

**+ Infrastructure (3–4)** : `wabtechs-repo-template`, `wabtechs-packages`,
`wabtechs-design-system`, `wabtechs-infra`.

---

## 13. Roadmap d'exécution recommandée

1. **Aujourd'hui** : valider ce plan + corriger la confidentialité (passage en privé).
2. **Semaine 1** : Phase 0 (template, packages, design system, gouvernance GitHub).
3. **Semaines 2–4** : Phase 1 (les 6 produits existants harmonisés + docs complètes).
4. **Mois 2–3** : Phase 2 (socle État RDC).
5. **Mois 4+** : Phases 3, 4 puis 5 (rythme : 2–3 dépôts / semaine via scaffolding).

---

## 14. État d'avancement — Phase 0 + 1 (Août 2026)

### Fondations (Phase 0) — terminées
- ✅ `wabtechs-repo-template` (repo template, privé) — skeleton standard + docs + CI/CodeQL.
- ✅ `wabtechs-packages` (monorepo npm `@wabtechs/*`) — packages scaffolding.
- ✅ `wabtechs-design-system` — tokens, thèmes, composants shadcn.
- ✅ Gouvernance GitHub : labels/topics, wiki, discussions activés sur chaque dépôt.

### Produits (Phase 1)
- ✅ `myeduc360` (créé — privé).
- ✅ `bilengi-marketplace` (créé — privé).
- ✅ `dhayaro` (harmonisé — overlay fichiers standards, poussé sur `main`).
- ✅ `archivium` (harmonisé — poussé sur `main`).
- ✅ `taxium` (harmonisé — poussé sur `master`).
- 🟡 `wabtechs-platform` (overlay des fichiers standards **locaux** — AGENTS.md, LICENSE,
  docs/, assets/, .github templates, CodeQL). À **commiter/revue** localement (les
  commits en cours du développeur ne sont pas poussés).

> Tous les dépôts produits exposent : README · LICENSE (propriétaire) · CONTRIBUTING ·
> CODE_OF_CONDUCT · SECURITY · CHANGELOG · ROADMAP · AGENTS.md · docs/ (vision, roadmap,
> architecture, modules, api, deployment, branding, security, installation) · assets/
> (logo, favicon) · .github/ (issue templates, PR template, Dependabot, CI, CodeQL, release).

## 15. Prochaine étape

- **Validation** de la visibilité (`wabtechs-platform` / `Dhayaro` → privatiser) et de la
  fusion éventuelle de `sante_connect`.
- Phase 2 : création des 8 dépôts du socle État (gov360, civil360, citizen360, …) via le
  générateur de scaffolding (`scripts/generate-repo.mjs`).

---

*Document confidentiel — Wabtechs Company. Reproduction, distribution ou utilisation interdites sans
autorisation écrite.*
