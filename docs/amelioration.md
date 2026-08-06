# Plan d'amélioration — Wabtechs Platform

> Plan stratégique de transformation en plateforme technologique complète.
> Baseline: Audit score **55/100**.

---

## Priorité 0 (P0) — Fondations

Ces chantiers sont le prérequis pour tout le reste. Sans eux, rien ne tient.

### P0.1 — CI/CD & Qualité

**Score actuel: 5/100 → 85/100 • Effort: 3 jours • Sans budget**

- [x] GitHub Actions: lint automatique sur push/PR
- [x] GitHub Actions: typecheck automatique
- [x] GitHub Actions: build check
- [x] Setup Vitest pour tests unitaires (41 tests)
- [x] Setup Playwright pour tests e2e critiques (7 tests, job CI dédié)
- [x] Husky + lint-staged (pre-commit hooks)
- [x] Code coverage minimal (80%) — seuil appliqué sur `src/lib` via `npm run test:coverage` (97%+ couvert)

### P0.2 — Branding & Identité

**Score actuel: 40/100 → 75/100 • Effort: 5 jours • Budget: 200€**

- [x] Décider du nom définitif: `Wabtechs` (tout en minuscules)
- [x] Créer le logo (SVG): symbole + logotype + favicon (placeholder `assets/logo.svg`)
- [x] Définir la palette exacte (primary, secondary, accents, neutres) — voir `docs/branding.md`
- [x] Tagline: "Build. Ship. Scale."
- [x] Appliquer le favicon sur toutes les pages (`/icon.png`)
- [x] Créer un `BRANDING.md` avec les règles (`docs/branding.md`)

### P0.3 — SEO Fondations

**Score actuel: 30/100 → 55/100 • Effort: 5 jours • Sans budget**

- [x] Ajouter JSON-LD structuré (Organization, Website — `src/app/layout.tsx`)
- [x] Métadonnées dynamiques complètes (title, description, OG, Twitter)
- [x] Breadcrumbs JSON-LD sur toutes les pages
- [x] Balisage Article sur le blog (datePublished, author, image)
- [x] Robots.txt optimisé (`src/app/robots.ts`)
- [x] Sitemap.xml avec priorités et fréquences (`src/app/sitemap.ts`)
- [x] Canonical URLs strictes (metadataBase configuré)
- [x] Schema.org SoftwareApplication pour les projets

### P0.4 — Analytics & Monitoring

**Score actuel: 0/100 → 40/100 • Effort: 2 jours • Budget: 50€/mois**

- [x] Installer PostHog (self-host ou cloud) — analytics + session recordings
- [x] Installer Sentry — error tracking (`@sentry/nextjs`, actif dès qu'un DSN est défini dans l'environnement)
- [x] Tableau de bord des KPIs (visiteurs, pages vues, conversions) — `/admin/analytics` (filtres 7j/30j/tout)
- [x] Console.log/error tracking supprimé — logging serveur migré vers Sentry, plus de bruit console en production

### P0.5 — Page d'accueil (Conversion)

**Score actuel: 50/100 • Effort: 5 jours • Sans budget**

- [x] Hero section: valeur proposition claire en 3 secondes
- [x] CTA principal visible sans scroll (primary + secondary)
- [x] Social proof: stars GitHub, témoignages, chiffres clés
- [x] Section "Pourquoi Wabtechs ?" (3 arguments max)
- [x] Newsletter CTA en bas de chaque section clé
- [x] Footer avec liens rapides

---

## Priorité 1 (P1) — MVP Commercial

Ces chantiers génèrent les premiers revenus.

### P1.1 — Academy

**Effort: 4 semaines • Budget: 500€ (micro, caméra, hébergement vidéo)**

- [x] Créer le modèle `Course` + `Lesson` + `Enrollment` dans Prisma
- [x] Interface admin pour gérer cours et leçons
- [x] Lecteur vidéo avec progression
- [x] Page publique des cours /academy
- [ ] Paiement Stripe pour l'accès
- [ ] Premier cours: "Next.js 16 — De zéro à pro" (10h de contenu)
- [ ] Certificat de complétion (PDF généré)

### P1.2 — Templates Premium

**Effort: 2 semaines • Budget: 0€**

- [x] Créer le modèle `Template` dans Prisma
- [x] Page de marketplace /templates
- [ ] Système de téléchargement après paiement
- [x] 5 templates de démarrage:
  - [x] Admin Dashboard (dérivé du code existant)
  - [x] Landing Page SaaS
  - [x] Blog avec MDX
  - [x] Portfolio développeur
  - [x] SaaS Starter Kit

### P1.3 — Newsletter

**Effort: 1 semaine • Budget: 0€ (Buttondown gratuit)**

- [x] Double opt-in fonctionnel
- [x] Page de confirmation
- [x] Archives publiques
- [x] Formulaire d'inscription sur chaque page
- [x] Popup de sortie (exit intent)

### P1.4 — GitHub Sponsors

**Effort: 2 jours • Budget: 0€**

- [x] Configurer GitHub Sponsors profile
- [x] Tiers de sponsoring (5$/25$/100$/500$)
- [x] Badges sponsors sur README
- [x] Page /sponsors sur le site
- [x] Avantages par tier (Discord privé, consulting, mentions)

### P1.5 — GitHub Intelligence

**Effort: 1 semaine • Budget: 0€**

- [x] Connexion OAuth GitHub (comme Vercel) — `/admin/github` (OAuth App, `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET`)
- [x] Dashboard d'analyse des dépôts: langages, commits (90j), étoiles, forks, issues, PR, contributeurs, releases
- [x] Éditeur de code intégré (Monaco) pour naviguer les fichiers des dépôts
- [x] Déploiement 1-click depuis GitHub (lien avec Vercel) — deploy hook `VERCEL_DEPLOY_HOOK_URL` sur `/admin/github`

---

## Priorité 2 (P2) — Croissance

### P2.1 — Marketplace

**Effort: 6 semaines • Budget: 2 000€**

- [ ] Modèles: `Product`, `Order`, `Review`, `Payout`
- [ ] Stripe Connect pour paiements créateurs
- [ ] Portail créateur (dashboard sales, analytics)
- [ ] Upload de fichiers (templates ZIP, screenshots)
- [ ] Système de review et rating
- [ ] Commission 70/30 (créateur/Wabtechs)

### P2.2 — API Publique

**Effort: 4 semaines • Budget: 500€**

- [ ] API keys management (Dev Portal)
- [ ] Rate limiting (Upstash)
- [ ] Documentation interactive (Swagger/OpenAPI)
- [ ] SDK JavaScript/TypeScript
- [ ] Webhooks (Stripe-compatible)
- [ ] Plans API (Free: 1K/jour, Pro: 10K/jour, Enterprise: illimité)

### P2.3 — Communauté

**Effort: 3 semaines • Budget: 0€**

- [ ] Serveur Discord structuré (channels par produit)
- [ ] Bridge Discord <-> site (notifications, annonces)
- [ ] Profils utilisateurs enrichis
- [ ] Badges de contribution (contributeur GitHub, sponsor, etc.)
- [ ] Forum de discussions (intégré au site)

### P2.4 — Job Board

**Effort: 2 semaines • Budget: 500€**

- [ ] Modèles: `JobListing`, `Application`
- [ ] Interface entreprise pour poster
- [ ] Interface candidat pour postuler
- [ ] Pricing: gratuit pour starters, 149€ pour entreprises
- [ ] Filtres (techno, remote, localisation, salaire)

---

## Priorité 3 (P3) — Scale

### P3.1 — Support Enterprise

**Effort: 4 semaines • Budget: 1 000€**

- [ ] Système de tickets (Zendesk/Freshdesk ou custom)
- [ ] SLA (4h, 8h, 24h selon plan)
- [ ] Base de connaissance publique
- [ ] Chat en direct (Intercom/Crisp)
- [ ] Portail support client

### P3.2 — Wabtechs Cloud (Beta)

**Effort: 12 semaines • Budget: 10 000€**

- [ ] Dashboard de déploiement
- [ ] Intégration GitHub (déploiement 1-click)
- [ ] Preview deployments
- [ ] Custom domains + SSL
- [ ] Analytics d'usage
- [ ] Backup automatique
- [ ] Pricing: $19/mois (1 projet), $49/mois (5 projets), $199/mois (illimité)

### P3.3 — AI Assistant

**Effort: 6 semaines • Budget: 500€/mois (LLM API)**

- [ ] Chatbot site (documentation, aide)
- [ ] Recherche vectorielle (pgvector)
- [ ] Génération de code contextuelle
- [ ] Suggestions d'articles et ressources
- [ ] Copilote Academy (questions/réponses sur les cours)

---

## Priorité 4 (P4) — Vision

Projets à long terme, post-rentabilité.

- [ ] White Label (marque blanche pour agences)
- [ ] Programme d'affiliation
- [ ] Certification officielle (reconnue entreprises)
- [ ] Hub physique Kinshasa (espace co-working + studio)
- [ ] Wabtechs Cloud public (concurrent Vercel)
- [ ] Levée de fonds (seed → série A → série B)
- [ ] Expansion anglophone
- [ ] IA Copilot propriétaire

---

## Roadmap temporelle

| Période       | Focus              | Objectif clé                        |
| ------------- | ------------------ | ----------------------------------- |
| **Jours 1-7** | P0.1 + P0.2        | CI/CD vert, branding OK             |
| **Semaine 2** | P0.3 + P0.4        | SEO baseline, analytics actif       |
| **Semaine 3** | P0.5               | Homepage convertissante             |
| **Semaine 4** | P1.3 + P1.4        | Newsletter active, sponsors live    |
| **Mois 2**    | P1.1               | Premier cours Academy en ligne      |
| **Mois 3**    | P1.2 + P2.1        | 5 templates, marketplace beta       |
| **Mois 4-6**  | P2.2 + P2.3 + P2.4 | API, communauté, job board          |
| **Mois 7-12** | P3.1 + P3.2 + P3.3 | Support, Cloud beta, AI             |
| **Année 2**   | P4                 | Scale international, levée de fonds |

---

## Indicateurs de succès (OKRs)

### Q1 (30 jours)

- [ ] CI/CD passe à 100%
- [ ] SEO score > 60
- [ ] Analytics actif
- [ ] Newsletter: 200 abonnés
- [ ] GitHub Sponsors: 5 sponsors

### Q2 (90 jours)

- [ ] MRR > 1 000€
- [ ] Academy: 50 étudiants
- [ ] Templates: 20 ventes
- [ ] GitHub: 100 stars
- [ ] Newsletter: 1 000 abonnés

### Q3 (6 mois)

- [ ] MRR > 5 000€
- [ ] 500 stars GitHub
- [ ] 5 000 visiteurs/mois organiques
- [ ] 10 templates sur marketplace
- [ ] Community Discord: 500 membres

### Q1 Année 2

- [ ] MRR > 20 000€
- [ ] Rentabilité atteinte
- [ ] 50 000 visiteurs/mois
- [ ] 100 clients payants
- [ ] Équipe de 5 personnes

---

**Dernière mise à jour**: 6 août 2026
**Prochaine révision**: 31 octobre 2026
