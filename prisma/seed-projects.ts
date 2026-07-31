import {
  PrismaClient,
  Priority,
  FeatureStatus,
  SprintStatus,
  BugStatus,
  BugSeverity,
  ObjectiveStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

interface ProjectSeed {
  slug: string;
  name: string;
  description: string;
  color: string;
  type: "PLATFORM" | "APP" | "LIBRARY" | "TOOL" | "SERVICE" | "OTHER";
  status: "PLANNING" | "ACTIVE" | "PAUSED" | "MAINTENANCE" | "ARCHIVED";
  version: string;
  environment: string;
  repoUrl: string;
  docsUrl?: string;
  websiteUrl?: string;
  technologies: string;
  githubStars: number;
  githubForks: number;
  githubIssues: number;
  githubPrs: number;
  githubCommits: number;
  healthScore: number;
  mrr: number;
  modules: {
    name: string;
    description: string;
    status: FeatureStatus;
    version: string;
    priority: Priority;
    complexity: string;
    progress: number;
    qualityScore: number;
    testCoverage: number;
    security: number;
    performance: number;
    seo: number;
    accessibility: number;
    maintainability: number;
    technicalDebt: number;
  }[];
  epics: { name: string; description: string; priority: Priority; progress: number; status: FeatureStatus }[];
  sprints: { name: string; goal: string; status: SprintStatus; velocity: number; daysAgoStart: number; daysAheadEnd: number }[];
  releases: { name: string; version: string; status: string; releasedDaysAgo: number | null }[];
  milestones: { title: string; description: string; status: string; daysAhead: number }[];
  roadmapItems: { title: string; type: string; priority: Priority; progress: number; estimatedHours: number; actualHours: number; roi: number; impact: number; dependencies?: string; risks?: string; daysAhead: number }[];
  features: { title: string; status: FeatureStatus; priority: Priority; points: number; epicIndex?: number; moduleIndex: number; sprintIndex?: number }[];
  bugs: { title: string; severity: BugSeverity; priority: Priority; status: BugStatus; impact: number; fixHours: number }[];
  objectives: { title: string; method: string; target: number; current: number; status: ObjectiveStatus; daysAheadDeadline: number; keyResults: { title: string; current: number; target: number }[] }[];
  growth: { stars: number; users: number; mrr: number; downloads: number }[];
}

const PROJECTS: ProjectSeed[] = [
  {
    slug: "wabtechs-platform",
    name: "Wabtechs Platform",
    description: "La plateforme technologique centrale : articles, tutoriels, Academy, templates, communauté et Project OS.",
    color: "#842ae3",
    type: "PLATFORM",
    status: "ACTIVE",
    version: "1.2.0",
    environment: "production",
    repoUrl: "https://github.com/wabtechs/wabtechs-platform",
    docsUrl: "https://wabtechs-platform.vercel.app/docs",
    websiteUrl: "https://wabtechs-platform.vercel.app",
    technologies: "Next.js, TypeScript, Prisma, PostgreSQL, Tailwind, shadcn/ui",
    githubStars: 142,
    githubForks: 28,
    githubIssues: 12,
    githubPrs: 5,
    githubCommits: 420,
    healthScore: 88,
    mrr: 1250,
    modules: [
      { name: "Academy", description: "Cours, leçons, inscriptions et progression.", status: "RELEASED", version: "1.2.0", priority: "HIGH", complexity: "HIGH", progress: 82, qualityScore: 88, testCoverage: 74, security: 92, performance: 90, seo: 85, accessibility: 84, maintainability: 86, technicalDebt: 12 },
      { name: "Templates Marketplace", description: "Vente et téléchargement de templates premium.", status: "RELEASED", version: "1.1.0", priority: "HIGH", complexity: "MEDIUM", progress: 75, qualityScore: 84, testCoverage: 68, security: 88, performance: 87, seo: 80, accessibility: 82, maintainability: 82, technicalDebt: 15 },
      { name: "Project OS", description: "Le centre de contrôle de pilotage des projets.", status: "DEVELOPMENT", version: "0.9.0", priority: "URGENT", complexity: "HIGH", progress: 60, qualityScore: 78, testCoverage: 55, security: 85, performance: 83, seo: 60, accessibility: 78, maintainability: 80, technicalDebt: 18 },
      { name: "Newsletter & Marketing", description: "Double opt-in, campagnes et popup exit-intent.", status: "RELEASED", version: "1.0.0", priority: "MEDIUM", complexity: "LOW", progress: 95, qualityScore: 90, testCoverage: 80, security: 90, performance: 92, seo: 70, accessibility: 86, maintainability: 88, technicalDebt: 6 },
      { name: "Analytics & Monitoring", description: "PostHog, tracking d'erreurs et monitoring.", status: "RELEASED", version: "1.0.0", priority: "MEDIUM", complexity: "LOW", progress: 90, qualityScore: 86, testCoverage: 62, security: 82, performance: 85, seo: 50, accessibility: 75, maintainability: 84, technicalDebt: 9 },
    ],
    epics: [
      { name: "Monétisation", description: "Générer les premiers revenus via Academy, templates et sponsors.", priority: "URGENT", progress: 70, status: "DEVELOPMENT" },
      { name: "Communauté", description: "Construire une communauté de développeurs active.", priority: "HIGH", progress: 35, status: "REVIEW" },
      { name: "Fondations", description: "SEO, performance et qualité de base.", priority: "MEDIUM", progress: 90, status: "RELEASED" },
    ],
    sprints: [
      { name: "Sprint 12", goal: "Stabiliser le Project OS et fixer les bugs critiques.", status: "ACTIVE", velocity: 34, daysAgoStart: 4, daysAheadEnd: 6 },
      { name: "Sprint 11", goal: "Publier les templates premium.", status: "COMPLETED", velocity: 30, daysAgoStart: 18, daysAheadEnd: -4 },
      { name: "Sprint 10", goal: "Lancer l'Academy en beta.", status: "COMPLETED", velocity: 28, daysAgoStart: 32, daysAheadEnd: -4 },
    ],
    releases: [
      { name: "v1.2.0 — Academy", version: "1.2.0", status: "RELEASED", releasedDaysAgo: 6 },
      { name: "v1.1.0 — Templates", version: "1.1.0", status: "RELEASED", releasedDaysAgo: 14 },
      { name: "v1.3.0 — Project OS", version: "1.3.0", status: "PLANNED", releasedDaysAgo: null },
    ],
    milestones: [
      { title: "50 étudiants Academy", description: "Premier jalon de croissance de l'Academy.", status: "PLANNED", daysAhead: 30 },
      { title: "100 stars GitHub", description: "Atteindre 100 stars sur le dépôt principal.", status: "COMPLETED", daysAhead: -10 },
    ],
    roadmapItems: [
      { title: "Paiement Stripe", type: "FEATURE", priority: "URGENT", progress: 20, estimatedHours: 60, actualHours: 12, roi: 90, impact: 95, dependencies: "Project OS", risks: "Conformité PCI", daysAhead: 21 },
      { title: "Project OS v1", type: "RELEASE", priority: "URGENT", progress: 60, estimatedHours: 200, actualHours: 120, roi: 80, impact: 90, risks: "Scope creep", daysAhead: 14 },
      { title: "API publique", type: "EPIC", priority: "MEDIUM", progress: 10, estimatedHours: 160, actualHours: 15, roi: 70, impact: 85, daysAhead: 90 },
      { title: "Marketplace créateurs", type: "EPIC", priority: "MEDIUM", progress: 5, estimatedHours: 240, actualHours: 8, roi: 85, impact: 80, daysAhead: 120 },
      { title: "Certificats de complétion", type: "FEATURE", priority: "LOW", progress: 0, estimatedHours: 40, actualHours: 0, roi: 40, impact: 55, daysAhead: 60 },
    ],
    features: [
      { title: "Paiement Stripe Academy", status: "DEVELOPMENT", priority: "URGENT", points: 8, epicIndex: 0, moduleIndex: 0, sprintIndex: 0 },
      { title: "Téléchargement templates post-paiement", status: "VALIDATION", priority: "HIGH", points: 5, epicIndex: 0, moduleIndex: 1, sprintIndex: 0 },
      { title: "Dashboard Project OS", status: "REVIEW", priority: "URGENT", points: 8, epicIndex: 0, moduleIndex: 2, sprintIndex: 0 },
      { title: "Kanban features", status: "DEVELOPMENT", priority: "URGENT", points: 5, epicIndex: 0, moduleIndex: 2, sprintIndex: 0 },
      { title: "Bug tracker", status: "DEVELOPMENT", priority: "HIGH", points: 5, epicIndex: 0, moduleIndex: 2, sprintIndex: 0 },
      { title: "Github sync", status: "READY", priority: "MEDIUM", points: 3, epicIndex: 0, moduleIndex: 2, sprintIndex: 0 },
      { title: "Forum communauté", status: "BACKLOG", priority: "MEDIUM", points: 13, epicIndex: 1, moduleIndex: 3, sprintIndex: undefined },
      { title: "Profils utilisateurs enrichis", status: "PLANNED", priority: "MEDIUM", points: 8, epicIndex: 1, moduleIndex: 3, sprintIndex: 0 },
      { title: "Badges de contribution", status: "BACKLOG", priority: "LOW", points: 5, epicIndex: 1, moduleIndex: 3, sprintIndex: undefined },
      { title: "Popup exit-intent", status: "DONE", priority: "MEDIUM", points: 3, epicIndex: 2, moduleIndex: 3, sprintIndex: 1 },
      { title: "Double opt-in newsletter", status: "RELEASED", priority: "HIGH", points: 5, epicIndex: 2, moduleIndex: 3, sprintIndex: 1 },
      { title: "Page sponsors", status: "RELEASED", priority: "MEDIUM", points: 3, epicIndex: 0, moduleIndex: 3, sprintIndex: 2 },
    ],
    bugs: [
      { title: "Prerender échoue sur /events sans connexion DB", severity: "CRITICAL", priority: "URGENT", status: "VERIFIED", impact: 80, fixHours: 6 },
      { title: "Popup newsletter réapparaît après fermeture", severity: "MINOR", priority: "LOW", status: "FIXED", impact: 20, fixHours: 2 },
      { title: "Upload d'images > 5 Mo non géré", severity: "MAJOR", priority: "HIGH", status: "IN_PROGRESS", impact: 40, fixHours: 4 },
      { title: "Build Vercel : 'Unable to find lambda'", severity: "CRITICAL", priority: "URGENT", status: "TRIAGED", impact: 60, fixHours: 8 },
      { title: "Contraste insuffisant des badges", severity: "TRIVIAL", priority: "LOW", status: "NEW", impact: 10, fixHours: 1 },
    ],
    objectives: [
      { title: "Atteindre 1000€ de MRR", method: "OKR", target: 1000, current: 1250, status: "COMPLETED", daysAheadDeadline: -15, keyResults: [{ title: "Lancer l'Academy payante", current: 1, target: 1 }, { title: "5 templates vendus", current: 12, target: 5 }] },
      { title: "100 stars GitHub", method: "SMART", target: 100, current: 142, status: "COMPLETED", daysAheadDeadline: -20, keyResults: [] },
      { title: "200 abonnés newsletter", method: "OKR", target: 200, current: 164, status: "ON_TRACK", daysAheadDeadline: 25, keyResults: [{ title: "Double opt-in actif", current: 1, target: 1 }, { title: "Popup exit-intent", current: 1, target: 1 }] },
      { title: "Project OS v1 en production", method: "SMART", target: 1, current: 0, status: "AT_RISK", daysAheadDeadline: 14, keyResults: [] },
    ],
    growth: [
      { stars: 28, users: 400, mrr: 0, downloads: 0 },
      { stars: 41, users: 610, mrr: 0, downloads: 20 },
      { stars: 55, users: 830, mrr: 0, downloads: 55 },
      { stars: 72, users: 1050, mrr: 300, downloads: 120 },
      { stars: 98, users: 1340, mrr: 640, downloads: 240 },
      { stars: 121, users: 1600, mrr: 890, downloads: 380 },
      { stars: 142, users: 1840, mrr: 1250, downloads: 540 },
    ],
  },
  {
    slug: "taxium",
    name: "Taxium",
    description: "Plateforme de réservation de taxis : courses, chauffeurs, paiement et tracking temps réel.",
    color: "#f59e0b",
    type: "APP",
    status: "ACTIVE",
    version: "0.8.0",
    environment: "staging",
    repoUrl: "https://github.com/wabtechs/taxium",
    websiteUrl: "https://taxium.app",
    technologies: "Next.js, React Native, PostgreSQL, Mapbox, Stripe",
    githubStars: 38,
    githubForks: 9,
    githubIssues: 18,
    githubPrs: 3,
    githubCommits: 215,
    healthScore: 74,
    mrr: 0,
    modules: [
      { name: "Réservation", description: "Demande de course, tarification et confirmation.", status: "VALIDATION", version: "0.8.0", priority: "URGENT", complexity: "HIGH", progress: 78, qualityScore: 82, testCoverage: 70, security: 86, performance: 80, seo: 40, accessibility: 76, maintainability: 80, technicalDebt: 22 },
      { name: "Tracking temps réel", description: "Position des chauffeurs et suivi de course.", status: "DEVELOPMENT", version: "0.7.0", priority: "HIGH", complexity: "HIGH", progress: 55, qualityScore: 74, testCoverage: 48, security: 78, performance: 72, seo: 20, accessibility: 60, maintainability: 72, technicalDebt: 30 },
      { name: "Paiement", description: "Facturation, portefeuille et reçus.", status: "DEVELOPMENT", version: "0.6.0", priority: "HIGH", complexity: "MEDIUM", progress: 45, qualityScore: 70, testCoverage: 42, security: 84, performance: 75, seo: 20, accessibility: 68, maintainability: 74, technicalDebt: 26 },
    ],
    epics: [
      { name: "Cœur de produit", description: "La boucle de course complète : demande → paiement.", priority: "URGENT", progress: 60, status: "DEVELOPMENT" },
      { name: "Expérience chauffeur", description: "Application chauffeur et revenus.", priority: "HIGH", progress: 30, status: "DEVELOPMENT" },
    ],
    sprints: [
      { name: "Sprint 8", goal: "Stabiliser le tracking temps réel.", status: "ACTIVE", velocity: 22, daysAgoStart: 3, daysAheadEnd: 7 },
      { name: "Sprint 7", goal: "Terminer le flux de réservation.", status: "COMPLETED", velocity: 24, daysAgoStart: 17, daysAheadEnd: -3 },
    ],
    releases: [
      { name: "v0.8.0 — Réservation", version: "0.8.0", status: "IN_PROGRESS", releasedDaysAgo: null },
      { name: "v0.6.0 — Paiement", version: "0.6.0", status: "RELEASED", releasedDaysAgo: 30 },
    ],
    milestones: [
      { title: "Beta publique Kinshasa", description: "Premier déploiement public à Kinshasa.", status: "PLANNED", daysAhead: 45 },
    ],
    roadmapItems: [
      { title: "Beta publique Kinshasa", type: "MILESTONE", priority: "URGENT", progress: 50, estimatedHours: 180, actualHours: 90, roi: 75, impact: 85, daysAhead: 45 },
      { title: "Application chauffeur", type: "EPIC", priority: "HIGH", progress: 30, estimatedHours: 200, actualHours: 60, roi: 80, impact: 80, daysAhead: 75 },
      { title: "Paiement mobile money", type: "FEATURE", priority: "HIGH", progress: 15, estimatedHours: 80, actualHours: 12, roi: 85, impact: 90, daysAhead: 40 },
    ],
    features: [
      { title: "Estimation du prix de course", status: "VALIDATION", priority: "URGENT", points: 8, epicIndex: 0, moduleIndex: 0, sprintIndex: 0 },
      { title: "Assignation automatique chauffeur", status: "REVIEW", priority: "URGENT", points: 13, epicIndex: 0, moduleIndex: 0, sprintIndex: 0 },
      { title: "Suivi temps réel de la course", status: "DEVELOPMENT", priority: "HIGH", points: 8, epicIndex: 0, moduleIndex: 1, sprintIndex: 0 },
      { title: "Historique des courses", status: "TESTING", priority: "MEDIUM", points: 5, epicIndex: 0, moduleIndex: 0, sprintIndex: 1 },
      { title: "Portefeuille chauffeur", status: "BACKLOG", priority: "HIGH", points: 13, epicIndex: 1, moduleIndex: 2, sprintIndex: undefined },
      { title: "Paiement mobile money", status: "PLANNED", priority: "HIGH", points: 8, epicIndex: 0, moduleIndex: 2, sprintIndex: 0 },
      { title: "Note et avis course", status: "BACKLOG", priority: "LOW", points: 3, epicIndex: 1, moduleIndex: 0, sprintIndex: undefined },
    ],
    bugs: [
      { title: "Position GPS imprécise dans les tunnels", severity: "MAJOR", priority: "HIGH", status: "IN_PROGRESS", impact: 50, fixHours: 12 },
      { title: "Le paiement échoue pour certains opérateurs", severity: "CRITICAL", priority: "URGENT", status: "TRIAGED", impact: 70, fixHours: 16 },
      { title: "L'app crash sur Android 12", severity: "MAJOR", priority: "HIGH", status: "NEW", impact: 45, fixHours: 8 },
      { title: "Doublon de courses à la soumission", severity: "MINOR", priority: "MEDIUM", status: "FIXED", impact: 15, fixHours: 3 },
    ],
    objectives: [
      { title: "Beta publique dans 45 jours", method: "SMART", target: 100, current: 50, status: "ON_TRACK", daysAheadDeadline: 45, keyResults: [] },
      { title: "100 chauffeurs inscrits", method: "OKR", target: 100, current: 42, status: "ON_TRACK", daysAheadDeadline: 60, keyResults: [{ title: "Portail d'inscription chauffeur", current: 0, target: 1 }] },
    ],
    growth: [
      { stars: 6, users: 0, mrr: 0, downloads: 0 },
      { stars: 12, users: 0, mrr: 0, downloads: 120 },
      { stars: 21, users: 0, mrr: 0, downloads: 480 },
      { stars: 30, users: 0, mrr: 0, downloads: 950 },
      { stars: 38, users: 0, mrr: 0, downloads: 1450 },
    ],
  },
  {
    slug: "dhayaro",
    name: "Dhayaro",
    description: "Assistant numérique pour les particuliers : gestion administrative et rappels intelligents.",
    color: "#10b981",
    type: "APP",
    status: "PLANNING",
    version: "0.2.0",
    environment: "development",
    repoUrl: "https://github.com/wabtechs/dhayaro",
    technologies: "Next.js, TypeScript, PostgreSQL, Tailwind",
    githubStars: 9,
    githubForks: 2,
    githubIssues: 6,
    githubPrs: 1,
    githubCommits: 74,
    healthScore: 62,
    mrr: 0,
    modules: [
      { name: "Profil & documents", description: "Gestion des documents personnels.", status: "DEVELOPMENT", version: "0.2.0", priority: "HIGH", complexity: "MEDIUM", progress: 35, qualityScore: 72, testCoverage: 30, security: 82, performance: 78, seo: 30, accessibility: 70, maintainability: 74, technicalDebt: 15 },
      { name: "Rappels intelligents", description: "Notifications et rappels contextuels.", status: "PLANNED", version: "0.1.0", priority: "MEDIUM", complexity: "MEDIUM", progress: 10, qualityScore: 60, testCoverage: 15, security: 70, performance: 72, seo: 20, accessibility: 60, maintainability: 66, technicalDebt: 12 },
    ],
    epics: [
      { name: "Assistant personnel", description: "La boucle rappel → action.", priority: "HIGH", progress: 20, status: "DEVELOPMENT" },
    ],
    sprints: [
      { name: "Sprint 2", goal: "Socle : profil et auth.", status: "ACTIVE", velocity: 16, daysAgoStart: 2, daysAheadEnd: 8 },
    ],
    releases: [{ name: "v0.1.0 — Socle", version: "0.1.0", status: "RELEASED", releasedDaysAgo: 20 }],
    milestones: [{ title: "MVP privé", description: "Version testable avec 3 utilisateurs.", status: "PLANNED", daysAhead: 60 }],
    roadmapItems: [
      { title: "Socle auth & profil", type: "FEATURE", priority: "URGENT", progress: 40, estimatedHours: 60, actualHours: 24, roi: 50, impact: 80, daysAhead: 10 },
      { title: "Rappels automatiques", type: "FEATURE", priority: "HIGH", progress: 5, estimatedHours: 80, actualHours: 4, roi: 70, impact: 85, daysAhead: 35 },
    ],
    features: [
      { title: "Inscription et connexion", status: "DEVELOPMENT", priority: "URGENT", points: 5, epicIndex: 0, moduleIndex: 0, sprintIndex: 0 },
      { title: "Upload de documents", status: "PLANNED", priority: "HIGH", points: 8, epicIndex: 0, moduleIndex: 0, sprintIndex: undefined },
      { title: "Moteur de rappels", status: "BACKLOG", priority: "HIGH", points: 13, epicIndex: 0, moduleIndex: 1, sprintIndex: undefined },
      { title: "Notification push", status: "BACKLOG", priority: "MEDIUM", points: 8, epicIndex: 0, moduleIndex: 1, sprintIndex: undefined },
    ],
    bugs: [
      { title: "Le token de session expire trop tôt", severity: "MINOR", priority: "MEDIUM", status: "NEW", impact: 25, fixHours: 3 },
    ],
    objectives: [
      { title: "MVP privé en 60 jours", method: "SMART", target: 1, current: 0, status: "ON_TRACK", daysAheadDeadline: 60, keyResults: [] },
    ],
    growth: [
      { stars: 2, users: 0, mrr: 0, downloads: 0 },
      { stars: 5, users: 0, mrr: 0, downloads: 0 },
      { stars: 9, users: 0, mrr: 0, downloads: 0 },
    ],
  },
  {
    slug: "archivium",
    name: "Archivium",
    description: "Solution d'archivage numérique pour les entreprises : documents, conformité et recherche.",
    color: "#3b82f6",
    type: "SERVICE",
    status: "PAUSED",
    version: "0.4.0",
    environment: "development",
    repoUrl: "https://github.com/wabtechs/archivium",
    technologies: "Next.js, PostgreSQL, Elasticsearch, Docker",
    githubStars: 14,
    githubForks: 4,
    githubIssues: 9,
    githubPrs: 2,
    githubCommits: 132,
    healthScore: 65,
    mrr: 0,
    modules: [
      { name: "Indexation & recherche", description: "Indexation plein texte et recherche avancée.", status: "TESTING", version: "0.4.0", priority: "HIGH", complexity: "HIGH", progress: 60, qualityScore: 76, testCoverage: 58, security: 80, performance: 74, seo: 25, accessibility: 68, maintainability: 76, technicalDebt: 24 },
      { name: "Conformité", description: "Règles de rétention et journalisation.", status: "PLANNED", version: "0.2.0", priority: "URGENT", complexity: "HIGH", progress: 15, qualityScore: 62, testCoverage: 20, security: 84, performance: 70, seo: 15, accessibility: 55, maintainability: 66, technicalDebt: 20 },
    ],
    epics: [
      { name: "Archive d'entreprise", description: "Capture, stockage et restitution.", priority: "HIGH", progress: 45, status: "DEVELOPMENT" },
    ],
    sprints: [
      { name: "Sprint 5", goal: "Finaliser l'indexation.", status: "PLANNED", velocity: 0, daysAgoStart: -2, daysAheadEnd: 10 },
    ],
    releases: [
      { name: "v0.4.0 — Indexation", version: "0.4.0", status: "IN_PROGRESS", releasedDaysAgo: null },
    ],
    milestones: [{ title: "POC client", description: "Preuve de concept avec 2 clients.", status: "PLANNED", daysAhead: 75 }],
    roadmapItems: [
      { title: "Recherche plein texte", type: "FEATURE", priority: "HIGH", progress: 60, estimatedHours: 120, actualHours: 72, roi: 80, impact: 85, daysAhead: 20 },
      { title: "Conformité RGPD", type: "FEATURE", priority: "URGENT", progress: 15, estimatedHours: 100, actualHours: 15, roi: 90, impact: 90, daysAhead: 50 },
    ],
    features: [
      { title: "Indexation des PDF", status: "TESTING", priority: "HIGH", points: 13, epicIndex: 0, moduleIndex: 0, sprintIndex: 0 },
      { title: "Recherche avec filtres", status: "DEVELOPMENT", priority: "HIGH", points: 8, epicIndex: 0, moduleIndex: 0, sprintIndex: 0 },
      { title: "Règles de rétention", status: "BACKLOG", priority: "URGENT", points: 21, epicIndex: 0, moduleIndex: 1, sprintIndex: undefined },
      { title: "Journal d'audit", status: "PLANNED", priority: "HIGH", points: 8, epicIndex: 0, moduleIndex: 1, sprintIndex: undefined },
    ],
    bugs: [
      { title: "Recherche lente sur plus de 100k documents", severity: "MAJOR", priority: "HIGH", status: "NEW", impact: 60, fixHours: 20 },
    ],
    objectives: [
      { title: "POC client en 75 jours", method: "SMART", target: 1, current: 0, status: "DELAYED", daysAheadDeadline: 75, keyResults: [] },
    ],
    growth: [
      { stars: 4, users: 0, mrr: 0, downloads: 0 },
      { stars: 9, users: 0, mrr: 0, downloads: 0 },
      { stars: 14, users: 0, mrr: 0, downloads: 0 },
    ],
  },
  {
    slug: "bilengi",
    name: "Bilengi",
    description: "Plateforme éducative : cours en langues locales, exercices et certification.",
    color: "#ef4444",
    type: "APP",
    status: "PLANNING",
    version: "0.1.0",
    environment: "development",
    repoUrl: "https://github.com/wabtechs/bilengi",
    technologies: "Next.js, TypeScript, PostgreSQL",
    githubStars: 5,
    githubForks: 1,
    githubIssues: 3,
    githubPrs: 0,
    githubCommits: 41,
    healthScore: 55,
    mrr: 0,
    modules: [
      { name: "Contenus éducatifs", description: "Cours et exercices en langues locales.", status: "PLANNED", version: "0.1.0", priority: "HIGH", complexity: "HIGH", progress: 10, qualityScore: 58, testCoverage: 10, security: 72, performance: 70, seo: 35, accessibility: 62, maintainability: 64, technicalDebt: 10 },
    ],
    epics: [
      { name: "Premier cours pilote", description: "Lancer un cours pilote en lingala.", priority: "HIGH", progress: 15, status: "PLANNED" },
    ],
    sprints: [
      { name: "Sprint 1", goal: "Cadrage et maquettes.", status: "PLANNED", velocity: 0, daysAgoStart: -5, daysAheadEnd: 9 },
    ],
    releases: [],
    milestones: [{ title: "Cours pilote lingala", description: "Premier contenu disponible en ligne.", status: "PLANNED", daysAhead: 90 }],
    roadmapItems: [
      { title: "Cours pilote lingala", type: "MILESTONE", priority: "HIGH", progress: 10, estimatedHours: 150, actualHours: 12, roi: 60, impact: 75, daysAhead: 90 },
    ],
    features: [
      { title: "Maquettes UX", status: "PLANNED", priority: "HIGH", points: 5, epicIndex: 0, moduleIndex: 0, sprintIndex: 0 },
      { title: "Lecteur de cours", status: "BACKLOG", priority: "HIGH", points: 13, epicIndex: 0, moduleIndex: 0, sprintIndex: undefined },
      { title: "Exercices interactifs", status: "BACKLOG", priority: "MEDIUM", points: 8, epicIndex: 0, moduleIndex: 0, sprintIndex: undefined },
    ],
    bugs: [],
    objectives: [
      { title: "Cours pilote en 90 jours", method: "SMART", target: 1, current: 0, status: "NOT_STARTED", daysAheadDeadline: 90, keyResults: [] },
    ],
    growth: [
      { stars: 2, users: 0, mrr: 0, downloads: 0 },
      { stars: 5, users: 0, mrr: 0, downloads: 0 },
    ],
  },
  {
    slug: "viraza",
    name: "Viraza",
    description: "Plateforme de gestion d'événements : billetterie, inscriptions et paiements.",
    color: "#f43f5e",
    type: "PLATFORM",
    status: "MAINTENANCE",
    version: "2.1.0",
    environment: "production",
    repoUrl: "https://github.com/wabtechs/viraza",
    websiteUrl: "https://viraza.com",
    technologies: "Next.js, Prisma, PostgreSQL, Stripe",
    githubStars: 22,
    githubForks: 6,
    githubIssues: 7,
    githubPrs: 1,
    githubCommits: 310,
    healthScore: 80,
    mrr: 480,
    modules: [
      { name: "Billetterie", description: "Vente de billets et QR codes.", status: "RELEASED", version: "2.1.0", priority: "URGENT", complexity: "HIGH", progress: 92, qualityScore: 88, testCoverage: 82, security: 90, performance: 84, seo: 70, accessibility: 82, maintainability: 84, technicalDebt: 18 },
      { name: "Paiements", description: "Paiement et remboursements.", status: "RELEASED", version: "2.0.0", priority: "HIGH", complexity: "MEDIUM", progress: 95, qualityScore: 90, testCoverage: 85, security: 92, performance: 82, seo: 50, accessibility: 80, maintainability: 86, technicalDebt: 12 },
    ],
    epics: [
      { name: "Maintien en production", description: "Fiabilité et support.", priority: "HIGH", progress: 90, status: "RELEASED" },
    ],
    sprints: [
      { name: "Maintenance", goal: "Sécurité et stabilité.", status: "ACTIVE", velocity: 12, daysAgoStart: 7, daysAheadEnd: 7 },
    ],
    releases: [
      { name: "v2.1.0 — QR codes", version: "2.1.0", status: "RELEASED", releasedDaysAgo: 25 },
      { name: "v2.2.0 — Remboursements", version: "2.2.0", status: "PLANNED", releasedDaysAgo: null },
    ],
    milestones: [{ title: "10 000 billets vendus", description: "Volume cumulé de billets.", status: "PLANNED", daysAhead: 40 }],
    roadmapItems: [
      { title: "Remboursements automatiques", type: "FEATURE", priority: "MEDIUM", progress: 25, estimatedHours: 60, actualHours: 15, roi: 60, impact: 65, daysAhead: 30 },
      { title: "Scan QR hors-ligne", type: "FEATURE", priority: "LOW", progress: 0, estimatedHours: 40, actualHours: 0, roi: 45, impact: 50, daysAhead: 60 },
    ],
    features: [
      { title: "Remboursement automatique", status: "DEVELOPMENT", priority: "MEDIUM", points: 8, epicIndex: 0, moduleIndex: 1, sprintIndex: 0 },
      { title: "Scan QR à l'entrée", status: "DONE", priority: "HIGH", points: 13, epicIndex: 0, moduleIndex: 0, sprintIndex: 0 },
      { title: "Page événement revue", status: "VALIDATION", priority: "MEDIUM", points: 5, epicIndex: 0, moduleIndex: 0, sprintIndex: 0 },
    ],
    bugs: [
      { title: "QR code non scannable en faible luminosité", severity: "MINOR", priority: "MEDIUM", status: "FIXED", impact: 20, fixHours: 3 },
      { title: "Double paiement possible en cas de double clic", severity: "CRITICAL", priority: "URGENT", status: "TRIAGED", impact: 85, fixHours: 6 },
    ],
    objectives: [
      { title: "Zero incident critique", method: "SMART", target: 0, current: 1, status: "AT_RISK", daysAheadDeadline: 30, keyResults: [] },
    ],
    growth: [
      { stars: 8, users: 200, mrr: 120, downloads: 0 },
      { stars: 13, users: 480, mrr: 240, downloads: 0 },
      { stars: 18, users: 760, mrr: 360, downloads: 0 },
      { stars: 22, users: 990, mrr: 480, downloads: 0 },
    ],
  },
];

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: "admin@wabtechs.com" } });
  if (!admin) {
    throw new Error("Admin user introuvable — exécutez d'abord npm run seed");
  }

  const devUsers = [
    { email: "dev@wabtechs.com", name: "Awa Kamara" },
    { email: "qa@wabtechs.com", name: "Jean-Paul Mbuyi" },
    { email: "pm@wabtechs.com", name: "Sarah Ngoie" },
  ];
  for (const u of devUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, name: u.name, role: "USER" },
    });
  }

  await prisma.osProject.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.metricSnapshot.deleteMany();

  let n = 0;
  for (const p of PROJECTS) {
    const project = await prisma.osProject.create({
      data: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        color: p.color,
        type: p.type,
        status: p.status,
        version: p.version,
        environment: p.environment,
        repoUrl: p.repoUrl,
        docsUrl: p.docsUrl ?? null,
        websiteUrl: p.websiteUrl ?? null,
        technologies: p.technologies,
        githubStars: p.githubStars,
        githubForks: p.githubForks,
        githubIssues: p.githubIssues,
        githubPrs: p.githubPrs,
        githubCommits: p.githubCommits,
        healthScore: p.healthScore,
        mrr: p.mrr,
        ownerId: admin.id,
      },
    });

    await prisma.projectMember.create({
      data: { projectId: project.id, userId: admin.id, role: "OWNER" },
    });
    const team = await prisma.user.findMany({ where: { email: { in: devUsers.map((d) => d.email) } } });
    for (let i = 0; i < team.length; i++) {
      if (i === 0 || p.slug === "wabtechs-platform" || p.slug === "taxium") {
        await prisma.projectMember.create({
          data: { projectId: project.id, userId: team[i]?.id ?? admin.id, role: i === 0 ? "LEAD" : i === 1 ? "QA" : "PM" },
        });
      }
    }

    const epics = [];
    for (const e of p.epics) {
      epics.push(
        await prisma.epic.create({
          data: { projectId: project.id, name: e.name, description: e.description, priority: e.priority, progress: e.progress, status: e.status },
        }),
      );
    }

    const modules = [];
    for (const m of p.modules) {
      modules.push(
        await prisma.module.create({
          data: { projectId: project.id, ...m },
        }),
      );
    }

    const sprints = [];
    for (const s of p.sprints) {
      sprints.push(
        await prisma.sprint.create({
          data: {
            projectId: project.id,
            name: s.name,
            goal: s.goal,
            status: s.status,
            velocity: s.velocity,
            startDate: addDays(-s.daysAgoStart),
            endDate: addDays(s.daysAheadEnd),
          },
        }),
      );
    }

    for (const r of p.releases) {
      await prisma.release.create({
        data: {
          projectId: project.id,
          name: r.name,
          version: r.version,
          status: r.status,
          releasedAt: r.releasedDaysAgo === null ? null : addDays(-r.releasedDaysAgo),
        },
      });
    }

    for (const m of p.milestones) {
      await prisma.milestone.create({
        data: { projectId: project.id, title: m.title, description: m.description, status: m.status, date: addDays(m.daysAhead) },
      });
    }

    for (const r of p.roadmapItems) {
      await prisma.roadmapItem.create({
        data: {
          projectId: project.id,
          title: r.title,
          type: r.type,
          priority: r.priority,
          progress: r.progress,
          estimatedHours: r.estimatedHours,
          actualHours: r.actualHours,
          roi: r.roi,
          impact: r.impact,
          dependencies: r.dependencies ?? null,
          risks: r.risks ?? null,
          startDate: addDays(-10),
          endDate: addDays(r.daysAhead),
        },
      });
    }

    for (const f of p.features) {
      await prisma.feature.create({
        data: {
          projectId: project.id,
          title: f.title,
          status: f.status,
          priority: f.priority,
          points: f.points,
          moduleId: modules[f.moduleIndex]?.id ?? null,
          epicId: f.epicIndex !== undefined ? epics[f.epicIndex]?.id ?? null : null,
          sprintId: f.sprintIndex !== undefined ? sprints[f.sprintIndex]?.id ?? null : null,
          assigneeId: team[0]?.id ?? null,
        },
      });
    }

    for (const b of p.bugs) {
      await prisma.bug.create({
        data: {
          projectId: project.id,
          title: b.title,
          severity: b.severity,
          priority: b.priority,
          status: b.status,
          impact: b.impact,
          fixHours: b.fixHours,
          assigneeId: team[1]?.id ?? null,
          version: p.version,
        },
      });
    }

    for (const o of p.objectives) {
      await prisma.objective.create({
        data: {
          projectId: project.id,
          title: o.title,
          method: o.method,
          target: o.target,
          current: o.current,
          progress: o.target === 0 ? 0 : Math.min(100, Math.round((o.current / o.target) * 100)),
          status: o.status,
          deadline: addDays(o.daysAheadDeadline),
          assigneeId: team[2]?.id ?? admin.id,
          keyResults: {
            create: o.keyResults.map((k) => ({ title: k.title, current: k.current, target: k.target })),
          },
        },
      });
    }

    for (const g of p.growth) {
      await prisma.metricSnapshot.createMany({
        data: [
          { projectId: project.id, metric: "stars", value: g.stars, date: addDays(-7 * (p.growth.length - 1 - n)) },
          { projectId: project.id, metric: "users", value: g.users, date: addDays(-7 * (p.growth.length - 1 - n)) },
          { projectId: project.id, metric: "mrr", value: g.mrr, date: addDays(-7 * (p.growth.length - 1 - n)) },
          { projectId: project.id, metric: "downloads", value: g.downloads, date: addDays(-7 * (p.growth.length - 1 - n)) },
        ],
      });
      n++;
    }
    n = 0;

    await prisma.notification.createMany({
      data: [
        { userId: admin.id, type: "RELEASE", title: `${p.name} — version ${p.version}`, content: "Nouvelle version disponible.", read: false },
        { userId: admin.id, type: "BUG", title: `${p.name} : bugs critiques ouverts`, content: "Des bugs critiques nécessitent votre attention.", read: false },
      ],
    });

    console.log(`✓ ${p.name}`);
  }

  console.log(`Project OS seeded: ${PROJECTS.length} projets`);
}

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
