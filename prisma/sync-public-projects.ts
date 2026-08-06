import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PUBLIC_PROJECTS: {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  coverImage: string;
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
    coverImage: "/images/projects/wabtechs-platform.png",
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
    coverImage: "/images/projects/react-hook-patterns.png",
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
    coverImage: "/images/projects/prisma-utils.png",
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
    coverImage: "/images/projects/tailwind-presets.png",
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
    coverImage: "/images/projects/next-auth-starter.png",
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
    coverImage: "/images/projects/devtools-cli.png",
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
    coverImage: "/images/projects/api-handler-patterns.png",
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
  for (const project of PUBLIC_PROJECTS) {
    const { slug, ...data } = project;
    await prisma.project.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
  }
  console.log(`✓ ${PUBLIC_PROJECTS.length} projets publics synchronisés`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
