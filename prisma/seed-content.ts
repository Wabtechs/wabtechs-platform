import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

const DEMO_USERS = [
  { email: "dev@wabtechs.com", name: "Awa Kamara" },
  { email: "qa@wabtechs.com", name: "Jean-Paul Mbuyi" },
  { email: "pm@wabtechs.com", name: "Sarah Ngoie" },
  { email: "reader@wabtechs.com", name: "Chloé Mukendi" },
];

const TAGS = [
  { name: "Next.js", slug: "nextjs" },
  { name: "React", slug: "react" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Prisma", slug: "prisma" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "Tailwind CSS", slug: "tailwind" },
  { name: "SEO", slug: "seo" },
  { name: "Design System", slug: "design-system" },
  { name: "Auth", slug: "auth" },
  { name: "DevOps", slug: "devops" },
  { name: "Node.js", slug: "nodejs" },
  { name: "Database", slug: "database" },
];

const POSTS: {
  slug: string;
  title: string;
  description: string;
  content: string;
  featured: boolean;
  readTime: number;
  views: number;
  tags: string[];
  daysAgo: number;
}[] = [
  {
    slug: "vitesse-site-seo-conversions",
    title: "Pourquoi la vitesse de votre site impacte votre SEO (et vos conversions)",
    description:
      "Le Core Web Vitals n'est plus une option. Découvrez pourquoi la performance web est le levier le plus rentable pour votre trafic et vos ventes.",
    featured: true,
    readTime: 8,
    views: 1240,
    tags: ["Next.js", "SEO", "DevOps"],
    daysAgo: 3,
    content: `# Pourquoi la vitesse de votre site impacte votre SEO

## La performance est un critère de ranking

Depuis l'introduction des **Core Web Vitals**, Google classe les pages selon trois indicateurs :

- **LCP** (Largest Contentful Paint) : le temps d'affichage du contenu principal
- **INP** (Interaction to Next Paint) : la réactivité aux interactions
- **CLS** (Cumulative Layout Shift) : la stabilité visuelle

Un site lent n'est pas pénalisé brutalement, mais il perd progressivement des positions au profit de concurrents plus rapides.

## L'effet sur les conversions

Chaque seconde de chargement supplémentaire coûte en moyenne **7% de conversions**. Sur un site qui génère 100 000 € par an, cela représente 7 000 € de revenus perdus par seconde de latence.

## Comment mesurer

\`\`\`bash
npx lighthouse https://votre-site.com
\`\`\`

## Les optimisations qui comptent vraiment

1. **Rendre côté serveur** ce qui doit l'être (SSR/SSG)
2. **Optimiser les images** avec next/image (WebP, AVIF, lazy loading)
3. **Charger les polices** avec next/font pour éviter le FOIT
4. **Réduire le JavaScript** envoyé au navigateur
5. **Mettre en cache** au niveau CDN avec ISR

> **À retenir** : la performance est un investissement, pas une dépense. Chaque milliseconde compte pour votre SEO ET vos revenus.`,
  },
  {
    slug: "prisma-ou-drizzle-2026",
    title: "Prisma ou Drizzle : comment choisir votre ORM en 2026",
    description:
      "Les deux ORM TypeScript dominent l'écosystème. Comparaison honnête sur la DX, la performance, les migrations et la sécurité des types.",
    featured: false,
    readTime: 10,
    views: 980,
    tags: ["Prisma", "PostgreSQL", "Database", "TypeScript"],
    daysAgo: 7,
    content: `# Prisma ou Drizzle en 2026

## Les deux approches

- **Prisma** : un ORM complet avec son propre moteur de requêtes, des migrations intégrées et un client typé généré.
- **Drizzle** : une surcouche SQL légère et SQL-first, sans moteur séparé, avec un support TypeScript natif.

## Comparaison rapide

| Critère | Prisma | Drizzle |
|---------|--------|---------|
| DX | Excellent (schéma déclaratif) | Très bon (SQL familier) |
| Migrations | Générées automatiquement | Manuel mais prévisible |
| Performance | Très bonne (débat en cours) | Excellente (pas de surcouche) |
| Relations | Incluses et typées | Type-level, plus puissantes |
| Courbe d'apprentissage | Douce | Modérée |

## Notre choix chez Wabtechs

Nous restons sur **Prisma** : la plateforme entière l'utilise, le schéma déclaratif accélère le développement et les migrations automatiques sécurisent les évolutions du Project OS.

## Quand choisir Drizzle

- Vous maîtrisez déjà SQL parfaitement
- Vous avez des requêtes très spécifiques et complexes
- Vous voulez un bundle minimal sans moteur séparé

> **À retenir** : le meilleur ORM est celui que votre équipe utilise avec confiance. Prisma pour la productivité, Drizzle pour le contrôle total.`,
  },
  {
    slug: "composants-serveur-react-guide",
    title: "Composants serveur React : le guide pratique",
    description:
      "Server Components, directives, sérialisation : comment tirer le meilleur de l'architecture moderne de React 19 et Next.js 16.",
    featured: true,
    readTime: 12,
    views: 1540,
    tags: ["React", "Next.js", "TypeScript"],
    daysAgo: 14,
    content: `# Composants serveur React

## Le principe

Par défaut, chaque composant dans l'App Router est un **Server Component** : il s'exécute sur le serveur, accède directement à la base de données et n'envoie aucun JavaScript au navigateur.

\`\`\`tsx
// Server Component — par défaut
export default async function Page() {
  const posts = await db.post.findMany();
  return posts.map((p) => <Card key={p.id} post={p} />);
}
\`\`\`

## Passer côté client

Dès qu'un composant utilise un hook ou un événement, il devient un **Client Component** :

\`\`\`tsx
"use client";

import { useState } from "react";

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>❤</button>;
}
\`\`\`

## La frontière serveur/client

- Un **Server Component peut contenir un Client Component** (l'inverse est impossible)
- Les props passées au client doivent être **sérialisables** (pas de fonctions, pas de Date)
- Chaque \`"use client"\` ajoute du JavaScript au bundle : gardez la couche interactive mince

## Performance réelle

Sur le site Wabtechs, le passage aux Server Components a réduit le JavaScript initial de **68%** et amélioré le LCP de **40%**.

> **À retenir** : serveur par défaut, client seulement si nécessaire. C'est la règle d'or de l'architecture React moderne.`,
  },
  {
    slug: "tailwind-css-v4-ce-qui-change",
    title: "Tailwind CSS v4 : ce qui change vraiment",
    description:
      "CSS-first config, variables natives, nouveau moteur : les nouveautés majeures de Tailwind v4 et comment migrer sans douleur.",
    featured: false,
    readTime: 7,
    views: 760,
    tags: ["Tailwind", "Design System"],
    daysAgo: 21,
    content: `# Tailwind CSS v4

## Une configuration CSS-first

Fini le \`tailwind.config.js\` obligatoire. La configuration passe dans votre CSS grâce à \`@theme\` :

\`\`\`css
@import "tailwindcss";

@theme {
  --color-primary: #842ae3;
  --radius-card: 16px;
}
\`\`\`

## Les variables natives

Tailwind v4 s'appuie sur les **variables CSS natives**, ce qui permet un thème sombre 100% fluide et des designs systems dynamiques.

## Le nouveau moteur

- Compilation **Oxide** : builds 5 à 10 fois plus rapides
- Aucune dépendance PostCSS lourde en dev
- Détection automatique des fichiers à scanner

## Migrer en douceur

1. Mettez à jour la dépendance vers \`tailwindcss@^4\`
2. Remplacez la directive \`@tailwind base\` par \`@import "tailwindcss"\`
3. Déplacez la config dans le CSS avec \`@theme\`
4. Vérifiez les utilitaires supprimés (\`bg-opacity-*\` etc.)

> **À retenir** : Tailwind v4 est plus rapide, plus simple et plus puissant. La migration est rapide pour la plupart des projets.`,
  },
  {
    slug: "authentification-securisee-authjs",
    title: "Authentification sécurisée avec Auth.js",
    description:
      "Credentials, OAuth, sessions, rôles : architecture d'authentification robuste pour Next.js avec Auth.js v5.",
    featured: false,
    readTime: 9,
    views: 890,
    tags: ["Auth", "Next.js", "Node.js"],
    daysAgo: 28,
    content: `# Authentification sécurisée avec Auth.js

## Les fondations

Auth.js v5 (ex-NextAuth) gère les sessions, les providers OAuth et les credentials. Il s'intègre à Prisma via \`@auth/prisma-adapter\`.

\`\`\`ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [Credentials({ ... })],
  session: { strategy: "jwt" },
});
\`\`\`

## Hacher les mots de passe

\`\`\`ts
import bcrypt from "bcryptjs";
const hash = await bcrypt.hash(password, 12);
\`\`\`

## Protéger l'application

1. **Middleware** pour la première couche (\`/admin/:path*\`)
2. **Vérification serveur** dans chaque page sensible via \`auth()\`
3. **Rôles** vérifiés dans les routes API

## Les pièges à éviter

- Stocker les mots de passe en clair ❌
- Faire confiance au \`role\` venu du client ❌
- Exposer des secrets via des variables \`NEXT_PUBLIC_\` ❌

> **À retenir** : l'authentification se conçoit en couches. Chaque couche peut être contournée seule — c'est la profondeur qui protège.`,
  },
  {
    slug: "architecturer-api-rest-production",
    title: "Architecturer une API REST de production",
    description:
      "Validation, erreurs, rate limiting, logging : les patterns essentiels pour des API routes Next.js fiables et maintenables.",
    featured: false,
    readTime: 11,
    views: 640,
    tags: ["Node.js", "TypeScript", "DevOps"],
    daysAgo: 42,
    content: `# Architecturer une API REST de production

## La validation avant tout

Tout input non validé est une porte ouverte. Avec Zod :

\`\`\`ts
const schema = z.object({
  email: z.string().email(),
  title: z.string().min(3).max(120),
});
const parsed = schema.safeParse(body);
if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
\`\`\`

## Un gestionnaire d'erreurs centralisé

\`\`\`ts
export function handleError(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") return NextResponse.json({ error: "Doublon détecté" }, { status: 409 });
  }
  return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
}
\`\`\`

## Rate limiting

Protégez vos endpoints publics avec un middleware de quota (fenêtre glissante en mémoire ou Redis).

## Logging structuré

Loggez la méthode, le path, le statut, la durée et l'identifiant utilisateur. Vos logs sont votre première source de vérité en incident.

> **À retenir** : une bonne API n'est pas celle qui gère le cas nominal, mais celle qui échoue proprement et de façon prévisible.`,
  },
];

const PODCASTS: {
  slug: string;
  title: string;
  description: string;
  duration: number;
  episode: number;
  season: number;
  tags: string[];
  daysAgo: number;
}[] = [
  {
    slug: "le-web-2026-entre-react-et-ia",
    title: "Le web en 2026 : entre React, RSC et l'IA",
    description:
      "Analyse des tendances qui façonnent le développement web : Server Components, agents IA et DX.",
    duration: 1845,
    episode: 1,
    season: 1,
    tags: ["Next.js", "React"],
    daysAgo: 6,
  },
  {
    slug: "postgresql-pour-les-produits-scalables",
    title: "PostgreSQL pour des produits scalables",
    description:
      "Index, partitions, pooling : comment faire passer PostgreSQL à l'échelle sans douleur.",
    duration: 2220,
    episode: 2,
    season: 1,
    tags: ["PostgreSQL", "Database"],
    daysAgo: 13,
  },
  {
    slug: "backstage-architecture-wabtechs",
    title: "Backstage : l'architecture de la Wabtechs Platform",
    description:
      "Comment nous avons structuré la plateforme, le Project OS et nos 6 projets open source.",
    duration: 2100,
    episode: 3,
    season: 1,
    tags: ["Next.js", "TypeScript", "DevOps"],
    daysAgo: 20,
  },
  {
    slug: "design-systems-accessibles",
    title: "Design systems accessibles : la méthode",
    description:
      "Design tokens, contrastes, navigation clavier : rendre un design system vraiment accessible.",
    duration: 1680,
    episode: 4,
    season: 1,
    tags: ["Design System", "Tailwind"],
    daysAgo: 27,
  },
];

const VIDEOS: {
  slug: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  daysAgo: number;
}[] = [
  {
    slug: "nextjs-app-router-complet",
    title: "Next.js App Router : le tour complet",
    description: "Layouts, segments, loading et error states : tout le App Router en 40 minutes.",
    videoUrl: "https://www.youtube.com/watch?v=J7nIn7MHn10",
    duration: 2400,
    daysAgo: 5,
  },
  {
    slug: "prisma-schema-et-migrations",
    title: "Prisma : schéma, migrations et seed",
    description: "Modéliser sa base, générer des migrations et seed des données de démonstration.",
    videoUrl: "https://www.youtube.com/watch?v=RebA5J-rlwg",
    duration: 1860,
    daysAgo: 12,
  },
  {
    slug: "tailwind-v4-migration-pratique",
    title: "Migrer vers Tailwind v4 : la pratique",
    description: "Migration pas à pas d'un projet réel, pièges compris.",
    videoUrl: "https://www.youtube.com/watch?v=K8DBS0I8mkc",
    duration: 1500,
    daysAgo: 19,
  },
  {
    slug: "authjs-v5-credentials-prisma",
    title: "Auth.js v5 avec Credentials et Prisma",
    description:
      "Mise en place complète de l'authentification : sessions JWT, rôles et protection.",
    videoUrl: "https://www.youtube.com/watch?v=1rJ0J1QnQ1o",
    duration: 2100,
    daysAgo: 26,
  },
  {
    slug: "deployer-vercel-serverless",
    title: "Déployer sur Vercel : pipeline complet",
    description: "Env, CI/CD, previews et monitoring : le workflow de déploiement professionnel.",
    videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
    duration: 1320,
    daysAgo: 40,
  },
];

const TUTORIALS: {
  slug: string;
  title: string;
  description: string;
  daysAgo: number;
}[] = [
  {
    slug: "creer-un-theme-sombre-tailwind",
    title: "Créer un thème sombre avec Tailwind",
    description:
      "Variables CSS, class dark et préférences système : le thème sombre sans surcharge.",
    daysAgo: 4,
  },
  {
    slug: "pagination-prisma-sans-douleur",
    title: "Pagination Prisma sans douleur",
    description: "cursor vs offset, tri stable et interfaces de pagination avec TanStack Query.",
    daysAgo: 11,
  },
  {
    slug: "formulaires-react-19-avances",
    title: "Formulaires React 19 avancés",
    description: "useActionState, useOptimistic et validation Zod pour des formulaires robustes.",
    daysAgo: 18,
  },
  {
    slug: "seo-nextjs-16-guide-complet",
    title: "SEO Next.js 16 : le guide complet",
    description:
      "Metadata API, JSON-LD, sitemap et Open Graph pour dominer les résultats de recherche.",
    daysAgo: 30,
  },
];

const SNIPPETS: {
  slug: string;
  title: string;
  description: string;
  language: string;
  code: string;
}[] = [
  {
    slug: "usedebounce-hook",
    title: "useDebounce",
    description: "Débouncez n'importe quelle valeur avec ce hook réutilisable.",
    language: "typescript",
    code: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}`,
  },
  {
    slug: "prisma-pagination",
    title: "Pagination cursor Prisma",
    description: "Pagination par curseur, stable et efficace sur de grands volumes.",
    language: "typescript",
    code: `export async function getPaginated<T>(model: any, cursor?: string, take = 20) {
  return model.findMany({
    take: take + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: { createdAt: "desc" },
  });
}`,
  },
  {
    slug: "auth-guard-route-handler",
    title: "Guard admin pour Route Handler",
    description: "Vérification de session et de rôle pour une route API protégée.",
    language: "typescript",
    code: `import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}`,
  },
  {
    slug: "zod-environnement",
    title: "Valider les variables d'env",
    description: "Typage et validation de process.env au démarrage avec Zod.",
    language: "typescript",
    code: `import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_BASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);`,
  },
  {
    slug: "tailwind-container",
    title: "Container utilitaire Tailwind",
    description: "Container responsive réutilisable avec breakpoints cohérents.",
    language: "css",
    code: `@utility container-site {
  @apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8;
}`,
  },
  {
    slug: "format-relative-time",
    title: "Formatage relatif de dates",
    description: "Afficher 'il y a 3 jours' avec Intl.RelativeTimeFormat.",
    language: "typescript",
    code: `const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

export function timeAgo(date: Date): string {
  const diff = Math.round((date.getTime() - Date.now()) / 86_400_000);
  if (Math.abs(diff) < 30) return rtf.format(diff, "day");
  return new Intl.DateTimeFormat("fr-FR").format(date);
}`,
  },
];

const RESOURCES: {
  slug: string;
  title: string;
  description: string;
  url: string;
  type: string;
}[] = [
  {
    slug: "cheatsheet-nextjs-app-router",
    title: "Cheatsheet App Router",
    description: "Les fichiers, conventions et options du App Router sur une page.",
    url: "https://nextjs.org/docs",
    type: "Cheatsheet",
  },
  {
    slug: "guide-prisma-relations",
    title: "Guide des relations Prisma",
    description: "1-1, 1-n, n-n : bien modéliser ses relations.",
    url: "https://prisma.io/docs",
    type: "Guide",
  },
  {
    slug: "checklist-lancement-produit",
    title: "Checklist de lancement produit",
    description: "SEO, analytics, monitoring, backups : tout vérifier avant le go live.",
    url: "https://vercel.com/docs",
    type: "Checklist",
  },
  {
    slug: "glossaire-http",
    title: "Glossaire des statuts HTTP",
    description: "2xx, 3xx, 4xx, 5xx : les codes HTTP expliqués simplement.",
    url: "https://developer.mozilla.org",
    type: "Référence",
  },
  {
    slug: "patterns-react-hooks",
    title: "Patterns de hooks React",
    description: "15 hooks réutilisables avec leurs tests.",
    url: "https://github.com/wabtechs/react-hook-patterns",
    type: "Open Source",
  },
];

const DOWNLOADS: {
  slug: string;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: string;
  category: string;
}[] = [
  {
    slug: "template-cv-developeur",
    title: "Template CV développeur",
    description: "CV moderne en HTML/CSS print-ready, ATS-friendly.",
    fileUrl: "/downloads/cv-developeur.html",
    fileSize: "45 Ko",
    category: "Template",
  },
  {
    slug: "checklist-seo-technique",
    title: "Checklist SEO technique",
    description: "Audit SEO complet en 30 points pour tout projet web.",
    fileUrl: "/downloads/checklist-seo.pdf",
    fileSize: "120 Ko",
    category: "Checklist",
  },
  {
    slug: "ebook-react-performance",
    title: "E-book : React Performance",
    description: "Optimiser ses apps React : memo, code splitting, transition.",
    fileUrl: "/downloads/ebook-react-performance.pdf",
    fileSize: "2,4 Mo",
    category: "E-book",
  },
  {
    slug: "starter-prisma-pg",
    title: "Starter Prisma + PostgreSQL",
    description: "Projet minimal avec Prisma, migrations et seed.",
    fileUrl: "/downloads/starter-prisma-pg.zip",
    fileSize: "340 Ko",
    category: "Starter",
  },
];

const ROADMAPS: {
  slug: string;
  title: string;
  description: string;
  status: string;
  quarter: string;
  year: number;
  order: number;
}[] = [
  {
    slug: "roadmap-frontend-2026",
    title: "Développeur Frontend",
    description: "Le parcours complet : HTML/CSS, JavaScript, React, Next.js.",
    status: "En cours",
    quarter: "Q1",
    year: 2026,
    order: 1,
  },
  {
    slug: "roadmap-backend-2026",
    title: "Développeur Backend",
    description: "Node.js, bases de données, APIs REST et sécurité.",
    status: "En cours",
    quarter: "Q1",
    year: 2026,
    order: 2,
  },
  {
    slug: "roadmap-devops-2026",
    title: "DevOps & Cloud",
    description: "Docker, CI/CD, Vercel, monitoring et observabilité.",
    status: "Planifié",
    quarter: "Q2",
    year: 2026,
    order: 3,
  },
  {
    slug: "roadmap-data-2026",
    title: "Data & SQL",
    description: "PostgreSQL, modélisation, index et requêtes avancées.",
    status: "En cours",
    quarter: "Q2",
    year: 2026,
    order: 4,
  },
  {
    slug: "roadmap-ia-2026",
    title: "IA pour développeurs",
    description: "LLM, agents, embeddings et intégrations d'IA en production.",
    status: "Planifié",
    quarter: "Q3",
    year: 2026,
    order: 5,
  },
  {
    slug: "roadmap-mobile-2026",
    title: "Développement Mobile",
    description: "React Native, PWA et applications multiplateformes.",
    status: "Planifié",
    quarter: "Q3",
    year: 2026,
    order: 6,
  },
];

const EVENTS: {
  slug: string;
  title: string;
  description: string;
  location: string;
  type: string;
  daysAhead: number;
}[] = [
  {
    slug: "webinar-nextjs-16-approfondi",
    title: "Webinar : Next.js 16 approfondi",
    description: "Server Actions, ISR et patterns avancés en direct.",
    location: "En ligne",
    type: "Webinaire",
    daysAhead: 14,
  },
  {
    slug: "meetup-kinshasa-javascript",
    title: "Meetup Kinshasa JavaScript",
    description: "Rencontre de la communauté : talks, démos et networking.",
    location: "Kinshasa",
    type: "Meetup",
    daysAhead: 40,
  },
  {
    slug: "atelier-prisma-schema",
    title: "Atelier : modéliser avec Prisma",
    description: "Hands-on de 2h : modèles, relations et migrations.",
    location: "En ligne",
    type: "Atelier",
    daysAhead: 75,
  },
  {
    slug: "conf-talks-react-19",
    title: "Conférence : l'état de React",
    description: "Retour sur React 19, RSC et l'écosystème 2026.",
    location: "En ligne",
    type: "Conférence",
    daysAhead: 120,
  },
];

const CHANGELOGS: {
  slug: string;
  title: string;
  version: string;
  daysAgo: number;
}[] = [
  {
    slug: "project-os-1-0",
    title: "Project OS : centre de contrôle admin",
    version: "1.0.0",
    daysAgo: 2,
  },
  {
    slug: "academy-cours-nextjs",
    title: "Academy : cours Next.js 16 de zéro à pro",
    version: "0.9.0",
    daysAgo: 12,
  },
  {
    slug: "templates-marketplace",
    title: "Marketplace de templates",
    version: "0.8.0",
    daysAgo: 25,
  },
  {
    slug: "newsletter-upload-couverture",
    title: "Newsletter & upload de couvertures",
    version: "0.7.0",
    daysAgo: 40,
  },
  {
    slug: "fondations-plateforme",
    title: "Fondations de la plateforme",
    version: "0.1.0",
    daysAgo: 60,
  },
];

const PROJECTS: {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  featured: boolean;
  githubUrl: string;
  demoUrl: string | null;
  language: string;
  stars: number;
  forks: number;
}[] = [
  {
    slug: "wabtechs-platform",
    title: "Wabtechs Platform",
    description:
      "La plateforme officielle — blog, docs, podcasts, vidéos, snippets et projets open source. Construite avec Next.js 16, React 19, Prisma et PostgreSQL.",
    longDescription:
      "# Wabtechs Platform\n\nLa plateforme centrale de l'écosystème Wabtechs :\n\n- Blog, tutoriels, Academy, templates et Project OS\n- Next.js 16, React 19, Prisma, PostgreSQL, Tailwind\n- Déployée sur Vercel",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    featured: true,
    githubUrl: "https://github.com/wabtechs/wabtechs-platform",
    demoUrl: "https://wabtechs-platform.vercel.app",
    language: "TypeScript",
    stars: 42,
    forks: 12,
  },
  {
    slug: "react-hook-patterns",
    title: "react-hook-patterns",
    description:
      "Collection de patterns et hooks React réutilisables pour des projets de production. Includes useDebounce, useLocalStorage, useMediaQuery et plus.",
    longDescription:
      "# react-hook-patterns\n\nDes hooks React testés et documentés pour la production :\n\n- useDebounce, useLocalStorage, useMediaQuery, useToggle\n- Tests Vitest inclus\n- Documentation JSDoc complète",
    techStack: ["React", "Hooks", "TypeScript"],
    featured: false,
    githubUrl: "https://github.com/wabtechs/react-hook-patterns",
    demoUrl: null,
    language: "TypeScript",
    stars: 87,
    forks: 23,
  },
  {
    slug: "prisma-utils",
    title: "prisma-utils",
    description:
      "Utilitaires et helpers pour Prisma ORM — migrations avancées, seeders, type safety et optimisation des requêtes.",
    longDescription:
      "# prisma-utils\n\nBoîte à outils pour tirer le meilleur de Prisma :\n\n- Helpers de pagination et de filtrage\n- Patterns de seed idempotents\n- Modèles et enums typés",
    techStack: ["Prisma", "Database", "TypeScript"],
    featured: false,
    githubUrl: "https://github.com/wabtechs/prisma-utils",
    demoUrl: null,
    language: "TypeScript",
    stars: 156,
    forks: 34,
  },
  {
    slug: "tailwind-presets",
    title: "tailwind-presets",
    description:
      "Présets Tailwind CSS prêts à l'emploi pour des interfaces modernes et accessibles. Thème clair/sombre, palette oklch.",
    longDescription:
      "# tailwind-presets\n\nDes présets de design system pour Tailwind :\n\n- Thème clair/sombre via variables natives\n- Palette oklch et tokens accessibles\n- Composants shadcn/ui compatibles",
    techStack: ["Tailwind", "CSS", "Design System"],
    featured: false,
    githubUrl: "https://github.com/wabtechs/tailwind-presets",
    demoUrl: null,
    language: "CSS",
    stars: 203,
    forks: 45,
  },
  {
    slug: "next-auth-starter",
    title: "next-auth-starter",
    description:
      "Template de démarrage avec NextAuth.js v5, Prisma Adapter et credentials/OAuth providers. Auth complète en 5 minutes.",
    longDescription:
      "# next-auth-starter\n\nL'authentification Next.js prête en 5 minutes :\n\n- Auth.js v5, Credentials + OAuth\n- Adapter Prisma, sessions JWT\n- Rôles, middleware et guards d'API",
    techStack: ["Next.js", "Auth", "Prisma"],
    featured: false,
    githubUrl: "https://github.com/wabtechs/next-auth-starter",
    demoUrl: "https://github.com/wabtechs/next-auth-starter",
    language: "TypeScript",
    stars: 312,
    forks: 78,
  },
  {
    slug: "devtools-cli",
    title: "devtools-cli",
    description:
      "CLI pour automatiser les tâches de développement — scaffolding de pages, migrations, déploiement et code generation.",
    longDescription:
      "# devtools-cli\n\nUn CLI pour accélérer le développement :\n\n- Scaffolding de pages et composants\n- Migrations et déploiement automatisés\n- Code generation typée",
    techStack: ["CLI", "Node.js", "Automation"],
    featured: false,
    githubUrl: "https://github.com/wabtechs/devtools-cli",
    demoUrl: null,
    language: "TypeScript",
    stars: 64,
    forks: 11,
  },
  {
    slug: "api-handler-patterns",
    title: "api-handler-patterns",
    description:
      "Patterns et utilitaires pour les API routes Next.js — validation Zod, error handling, rate limiting et logging.",
    longDescription:
      "# api-handler-patterns\n\nDes patterns robustes pour les API Next.js :\n\n- Validation Zod des entrées\n- Error handling et logging centralisés\n- Rate limiting réutilisable",
    techStack: ["Next.js", "API", "TypeScript"],
    featured: false,
    githubUrl: "https://github.com/wabtechs/api-handler-patterns",
    demoUrl: null,
    language: "TypeScript",
    stars: 95,
    forks: 19,
  },
];

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: "admin@wabtechs.com" } });
  if (!admin) {
    throw new Error("Admin user introuvable — exécutez d'abord npm run seed");
  }

  const password = await bcrypt.hash("Wabtechs@2026", 12);
  const users: Record<string, string> = { admin: admin.id };
  for (const u of DEMO_USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, name: u.name, password, role: "USER" },
    });
    users[u.email.split("@")[0]!] = user.id;
  }
  console.log("✓ Utilisateurs prêts");

  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.post.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.podcast.deleteMany();
  await prisma.video.deleteMany();
  await prisma.tutorial.deleteMany();
  await prisma.snippet.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.download.deleteMany();
  await prisma.roadmap.deleteMany();
  await prisma.event.deleteMany();
  await prisma.changelog.deleteMany();
  await prisma.project.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.osComment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.tag.deleteMany();

  await prisma.tag.createMany({ data: TAGS });
  const tagIds = new Map<string, string>();
  for (const t of TAGS) {
    const found = await prisma.tag.findUnique({ where: { slug: t.slug } });
    if (found) tagIds.set(t.slug, found.id);
  }
  console.log(`✓ ${TAGS.length} tags`);

  const postIds: Record<string, string> = {};
  const tagSlugs = new Map<string, string>();
  for (const t of TAGS) {
    tagSlugs.set(t.name, t.slug);
    tagSlugs.set(t.slug, t.slug);
  }
  const tagSlugFor = (tag: string) => tagSlugs.get(tag) ?? tag.toLowerCase().replace(/\s+/g, "-");
  for (const p of POSTS) {
    const post = await prisma.post.create({
      data: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        content: p.content,
        featured: p.featured,
        readTime: p.readTime,
        views: p.views,
        authorId: admin.id,
        published: true,
        publishedAt: addDays(-p.daysAgo),
        createdAt: addDays(-p.daysAgo),
        tags: { connect: p.tags.map((t) => ({ slug: tagSlugFor(t) })) },
      },
    });
    postIds[p.slug] = post.id;
  }

  const commentSpecs: { post: string; author: string; content: string; replyTo?: string }[] = [
    {
      post: "vitesse-site-seo-conversions",
      author: "dev",
      content:
        "Excellent article ! Le point sur le INP est très clair, je ne savais pas qu'il remplaçait le FID.",
    },
    {
      post: "vitesse-site-seo-conversions",
      author: "admin",
      content: "Merci ! On a d'ailleurs migré la plateforme et gagné 40% sur le LCP.",
      replyTo: "vitesse-site-seo-conversions:dev",
    },
    {
      post: "prisma-ou-drizzle-2026",
      author: "qa",
      content:
        "Le comparatif est honnête. Prisma reste effectivement le meilleur choix pour la productivité.",
    },
    {
      post: "composants-serveur-react-guide",
      author: "reader",
      content:
        "Très pratique. La règle serveur par défaut devrait être affichée dans tous les bureaux.",
    },
    {
      post: "tailwind-css-v4-ce-qui-change",
      author: "pm",
      content: "On planifie la migration du Project OS sur Tailwind v4, ce guide tombe à pic !",
    },
  ];
  const commentIds = new Map<string, string>();
  for (const spec of commentSpecs) {
    const comment = await prisma.comment.create({
      data: {
        content: spec.content,
        authorId: users[spec.author]!,
        postId: postIds[spec.post]!,
      },
    });
    commentIds.set(`${spec.post}:${spec.author}`, comment.id);
  }
  for (const spec of commentSpecs) {
    if (!spec.replyTo) continue;
    const parentId = commentIds.get(spec.replyTo);
    if (!parentId) continue;
    await prisma.comment.update({
      where: { id: commentIds.get(`${spec.post}:${spec.author}`)! },
      data: { parentId },
    });
  }

  await prisma.like.createMany({
    data: [
      { authorId: users.dev!, postId: postIds["vitesse-site-seo-conversions"]! },
      { authorId: users.qa!, postId: postIds["vitesse-site-seo-conversions"]! },
      { authorId: users.reader!, postId: postIds["vitesse-site-seo-conversions"]! },
      { authorId: users.dev!, postId: postIds["composants-serveur-react-guide"]! },
      { authorId: users.pm!, postId: postIds["composants-serveur-react-guide"]! },
      { authorId: users.qa!, postId: postIds["prisma-ou-drizzle-2026"]! },
      { authorId: users.reader!, postId: postIds["prisma-ou-drizzle-2026"]! },
    ],
  });
  await prisma.bookmark.createMany({
    data: [
      { authorId: users.dev!, postId: postIds["vitesse-site-seo-conversions"]! },
      { authorId: users.pm!, postId: postIds["composants-serveur-react-guide"]! },
      { authorId: users.qa!, postId: postIds["authentification-securisee-authjs"]! },
    ],
  });
  console.log(`✓ ${POSTS.length} articles (commentaires, likes, favoris)`);

  const course = await prisma.course.create({
    data: {
      slug: "react-19-typescript-niveau-superieur",
      title: "React 19 & TypeScript — le niveau supérieur",
      description:
        "Composants serveur, hooks avancés, performance et patterns de production avec React 19 et TypeScript strict.",
      price: 19,
      level: "intermediate",
      duration: "4h",
      published: true,
      featured: true,
    },
  });

  const lessons = [
    {
      title: "Les nouveautés de React 19",
      description: "useOptimistic, useActionState, les changements majeurs.",
      duration: 18,
      order: 1,
      free: true,
      content:
        "# Les nouveautés de React 19\n\nReact 19 simplifie le modèle mental : moins de hooks spécialisés, plus d'actions et de transitions.\n\n- useOptimistic pour les mises à jour optimistes\n- useActionState pour les formulaires\n- Composants serveur au premier plan\n\n> **À retenir** : les Actions sont désormais le chemin recommandé pour les mutations.",
    },
    {
      title: "useTransition et les transitions",
      description: "Rendre les changements d'état non bloquants.",
      duration: 22,
      order: 2,
      free: false,
      content:
        '# useTransition\n\nLes transitions marquent une mise à jour comme non urgente : l\'interface reste réactive pendant le rendu.\n\n```tsx\nconst [isPending, startTransition] = useTransition();\n\nstartTransition(() => setTab("analytics"));\n```\n\n> **À retenir** : idéal pour les filtres, onglets et recherches coûteuses.',
    },
    {
      title: "Server Components en pratique",
      description: "Architecturer une app : la couche serveur épaisse, la couche client mince.",
      duration: 25,
      order: 3,
      free: false,
      content:
        '# Server Components en pratique\n\nOrganisez votre arborescence : données et logique côté serveur, interactions dans des composants client feuilles.\n\n- Chaque \`"use client"\` coûte du JS\n- Les composants serveur peuvent rendre des composants client\n- Passez des données sérialisables uniquement\n\n> **À retenir** : la performance d\'une app React 19 se décide à la frontière serveur/client.',
    },
    {
      title: "useOptimistic : des UI instantanées",
      description: "Réagir immédiatement aux actions utilisateur.",
      duration: 20,
      order: 4,
      free: false,
      content:
        "# useOptimistic\n\nAffichez le résultat attendu pendant que la requête part.\n\n```tsx\nconst [optimisticLikes, addOptimistic] = useOptimistic(likes);\n\nasync function handleLike() {\n  addOptimistic(likes + 1);\n  await likePost();\n}\n```\n\n> **À retenir** : le serveur reste la source de vérité ; l'optimisme n'est qu'une couche de perception.",
    },
    {
      title: "TypeScript strict pour vos composants",
      description: "Typage des props, génériques et inférence avancée.",
      duration: 23,
      order: 5,
      free: false,
      content:
        "# TypeScript strict\n\nTypage générique, contrôle de variantes et composants polymorphiques :\n\n```tsx\nfunction Tabs<T extends string>({ items }: { items: T[] }) {\n  const [active, setActive] = useState<T>(items[0]!);\n}\n```\n\n> **À retenir** : activer \`noUncheckedIndexedAccess\` révèle des bugs silencieux.",
    },
    {
      title: "Performance : memo, code splitting, liste",
      description: "Les 3 leviers qui comptent réellement.",
      duration: 26,
      order: 6,
      free: false,
      content:
        "# Performance React\n\n1. **React.memo** pour les composants chers et stables\n2. **dynamic()** pour découper le code par route\n3. **Virualisation** pour les longues listes\n\nMesurez avec le Profiler de React DevTools avant d'optimiser.\n\n> **À retenir** : n'optimisez jamais avant d'avoir mesuré.",
    },
    {
      title: "Server Actions et mutation de données",
      description: "Écrire en base depuis le client en toute sécurité.",
      duration: 24,
      order: 7,
      free: false,
      content:
        '# Server Actions\n\n```tsx\n"use server";\n\nexport async function createPost(data: FormData) {\n  const parsed = schema.parse(Object.fromEntries(data));\n  await db.post.create({ data: parsed });\n  revalidatePath("/blog");\n}\n```\n\n> **À retenir** : validez toujours côté serveur, jamais uniquement côté client.',
    },
    {
      title: "Projet final : une app full-stack",
      description: "Assemblez toutes les notions en une app complète.",
      duration: 60,
      order: 8,
      free: false,
      content:
        "# Projet final\n\nConstruisez une mini-app de productivité (kanban) avec :\n\n- Auth et rôles\n- Server Actions pour les mutations\n- UI optimiste avec useOptimistic\n- Tests et déploiement\n\n> Félicitations ! Partagez votre projet avec la communauté Wabtechs.",
    },
  ];
  for (const l of lessons) {
    await prisma.lesson.create({ data: { courseId: course.id, ...l } });
  }

  await prisma.enrollment.createMany({
    data: [
      {
        userId: users.admin!,
        courseId: course.id,
        progress: 100,
        completed: true,
        completedAt: addDays(-2),
      },
      { userId: users.dev!, courseId: course.id, progress: 62, completed: false },
      { userId: users.qa!, courseId: course.id, progress: 25, completed: false },
    ],
  });

  const nxCourse = await prisma.course.findUnique({ where: { slug: "nextjs-16-de-zero-a-pro" } });
  if (nxCourse) {
    await prisma.enrollment.createMany({
      data: [
        {
          userId: users.admin!,
          courseId: nxCourse.id,
          progress: 100,
          completed: true,
          completedAt: addDays(-8),
        },
        { userId: users.dev!, courseId: nxCourse.id, progress: 78, completed: false },
      ],
    });
  }
  console.log(`✓ Cours "${course.title}" (${lessons.length} leçons) + inscriptions`);

  for (const p of PODCASTS) {
    await prisma.podcast.create({
      data: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        audioUrl: `https://wabtechs-platform.vercel.app/audio/${p.slug}.mp3`,
        duration: p.duration,
        episode: p.episode,
        season: p.season,
        published: true,
        publishedAt: addDays(-p.daysAgo),
        createdAt: addDays(-p.daysAgo),
        tags: { connect: p.tags.map((t) => ({ slug: tagSlugFor(t) })) },
      },
    });
  }
  console.log(`✓ ${PODCASTS.length} podcasts`);

  for (const v of VIDEOS) {
    const { daysAgo, ...data } = v;
    await prisma.video.create({
      data: { ...data, published: true, createdAt: addDays(-daysAgo) },
    });
  }
  console.log(`✓ ${VIDEOS.length} vidéos`);

  for (const t of TUTORIALS) {
    const { daysAgo, ...data } = t;
    await prisma.tutorial.create({
      data: { ...data, published: true, createdAt: addDays(-daysAgo) },
    });
  }
  console.log(`✓ ${TUTORIALS.length} tutoriels`);

  for (const s of SNIPPETS) {
    await prisma.snippet.create({ data: { ...s, published: true } });
  }
  console.log(`✓ ${SNIPPETS.length} snippets`);

  for (const r of RESOURCES) {
    await prisma.resource.create({ data: { ...r, published: true } });
  }
  console.log(`✓ ${RESOURCES.length} ressources`);

  for (const d of DOWNLOADS) {
    await prisma.download.create({ data: { ...d, published: true } });
  }
  console.log(`✓ ${DOWNLOADS.length} téléchargements`);

  for (const r of ROADMAPS) {
    await prisma.roadmap.create({ data: { ...r, published: true } });
  }
  console.log(`✓ ${ROADMAPS.length} roadmaps`);

  for (const e of EVENTS) {
    const { daysAhead, ...data } = e;
    await prisma.event.create({
      data: { ...data, published: true, date: addDays(daysAhead) },
    });
  }
  console.log(`✓ ${EVENTS.length} événements`);

  for (const c of CHANGELOGS) {
    const { daysAgo, ...data } = c;
    await prisma.changelog.create({
      data: {
        ...data,
        published: true,
        date: addDays(-daysAgo),
        content: `# ${c.title}\n\nDétails de la version ${c.version} publiée sur la plateforme.`,
      },
    });
  }
  console.log(`✓ ${CHANGELOGS.length} changelogs`);

  for (const p of PROJECTS) {
    await prisma.project.create({
      data: { ...p, coverImage: `/images/projects/${p.slug}.png`, techStack: p.techStack },
    });
  }
  console.log(`✓ ${PROJECTS.length} projets publics`);

  await prisma.newsletter.createMany({
    data: [
      { email: "abdou@example.com", name: "Abdou Diallo", token: crypto.randomUUID() },
      { email: "lea@example.com", name: "Léa Nkulu", token: crypto.randomUUID() },
      { email: "kofi@example.com", name: "Kofi Mensah", token: crypto.randomUUID() },
      { email: "amina@example.com", name: "Amina Sow", token: crypto.randomUUID(), active: false },
      { email: "jules@example.com", name: "Jules Kavumbu", token: crypto.randomUUID() },
    ],
  });
  console.log(`✓ ${5} abonnés newsletter`);

  await prisma.contactMessage.createMany({
    data: [
      {
        name: "Fatou B.",
        email: "fatou@example.com",
        subject: "Demande de partenariat",
        message: "Bonjour, j'aimerais proposer un partenariat autour de l'Academy.",
        read: false,
      },
      {
        name: "Igor M.",
        email: "igor@example.com",
        subject: "Bug sur la page templates",
        message: "Le filtre par catégorie ne fonctionne pas sur mobile.",
        read: false,
      },
      {
        name: "Nadia T.",
        email: "nadia@example.com",
        subject: "Question cours Next.js",
        message: "Le cours Next.js 16 est-il disponible en version gratuite complète ?",
        read: true,
      },
    ],
  });
  console.log(`✓ ${3} messages de contact`);

  await prisma.notification.createMany({
    data: [
      {
        userId: users.admin!,
        type: "RELEASE",
        title: "Wabtechs Platform v1.2.0 déployée",
        content: "La nouvelle version est en production sur Vercel.",
        read: false,
      },
      {
        userId: users.admin!,
        type: "SPRINT",
        title: "Sprint actif : Taxium",
        content: "Le sprint 7 de Taxium est en cours, 3 features en revue.",
        read: false,
      },
      {
        userId: users.admin!,
        type: "BUG",
        title: "Bug critique sur Archivium",
        content: "Un bug BLOCKER a été ouvert sur la recherche full-text.",
        read: true,
      },
      {
        userId: users.dev!,
        type: "TASK",
        title: "Feature assignée",
        content: "La feature 'Inscription OAuth' vous a été assignée.",
        read: false,
      },
    ],
  });
  console.log(`✓ ${4} notifications`);

  const features = await prisma.feature.findMany({ take: 6, orderBy: { createdAt: "asc" } });
  const firstFeature = features[0];
  const secondFeature = features[1];
  if (firstFeature) {
    await prisma.osComment.createMany({
      data: features.slice(0, 4).map((f, i) => ({
        entityType: "FEATURE",
        entityId: f.id,
        userId: users[i % 4 === 0 ? "dev" : "qa"],
        content:
          [
            "À traiter avant la fin du sprint.",
            "À mettre en revue avec l'équipe.",
            "Dépendance bloquante à lever.",
            "Testé sur mobile, OK.",
          ][i] ?? "",
      })),
    });
    await prisma.subtask.createMany({
      data: [
        { featureId: firstFeature.id, title: "Écrire les tests unitaires", done: false },
        { featureId: firstFeature.id, title: "Valider sur les navigateurs", done: true },
        {
          featureId: secondFeature?.id ?? firstFeature.id,
          title: "Mettre à jour la documentation",
          done: false,
        },
      ],
    });
    console.log(`✓ Commentaires et sous-tâches (${features.length} features liées)`);
  }

  console.log("\n✓ Seed de contenu terminé");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
