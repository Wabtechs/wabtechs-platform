import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SLUG = "nextjs-16-de-zero-a-pro";

interface LessonSeed {
  title: string;
  description: string;
  duration: number;
  order: number;
  free: boolean;
  content: string;
}

async function main() {
  await prisma.course.deleteMany({ where: { slug: SLUG } });

  const lessons: LessonSeed[] = [
    // Module 1 — Bienvenue & fondations
    {
      title: "Pourquoi Next.js en 2026 ?",
      description: "Le paysage du web, ce que Next.js résout et pourquoi c'est le choix dominant.",
      duration: 15,
      order: 1,
      free: true,
      content:
        "# Pourquoi Next.js en 2026 ?\n\nLe web moderne a un problème : il faut choisir entre vitesse et richesse. Next.js réunit les deux en un seul framework.\n\n## Ce que Next.js résout\n\n- **Performance** : rendu optimisé côté serveur, code divisé automatiquement\n- **SEO** : pages servies en HTML complet pour les moteurs de recherche\n- **DX** : un seul projet TypeScript de la base de données au navigateur\n- **Écosystème** : Vercel, 100% compatible React, outillage mature\n\n## Les chiffres\n\n- Utilisé par OpenAI, Vercel, TikTok, Twitch et des millions de sites\n- Plus de 8 millions de sites en production\n- Communauté et npm : parmi les packages les plus téléchargés\n\n## Ce que vous allez apprendre\n\nÀ la fin de ce cours, vous saurez construire une application complète :\n\n1. Une architecture App Router moderne\n2. Des composants serveur et client efficaces\n3. Une base de données Prisma connectée\n4. L'authentification et la sécurité\n5. Un déploiement de niveau production\n\n> **À retenir** : Next.js n'est pas un framework de plus. C'est la façon standard de construire des applications React modernes.",
    },
    {
      title: "Prérequis et installation",
      description: "Node, npm et le scaffolding d'un projet Next.js en quelques secondes.",
      duration: 20,
      order: 2,
      free: true,
      content:
        "# Prérequis et installation\n\n## Ce qu'il vous faut\n\n- Node.js 20.9 ou plus récent (vérifiez avec `node -v`)\n- npm ou pnpm (nous utiliserons npm dans ce cours)\n- Un éditeur de code (VS Code recommandé)\n\n## Créer un projet\n\n```bash\nnpx create-next-app@latest mon-projet\n```\n\nLes questions clés :\n\n```\n? Would you like to use TypeScript?  Yes\n? Would you like to use Tailwind CSS?  Yes\n? Would you like to use the App Router?  Yes\n? Would you like to use Turbopack?  Yes\n```\n\n## Lancer le projet\n\n```bash\ncd mon-projet\nnpm run dev\n```\n\nRendez-vous sur http://localhost:3000 — votre application tourne.\n\n## Vérification\n\nÀ ce stade vous devez avoir :\n\n- Un dossier `app/` avec la structure App Router\n- TypeScript configuré avec `tsconfig.json`\n- Tailwind CSS actif\n- Un script `dev`, `build` et `start` dans le package.json\n\n> **À retenir** : `create-next-app` est le moyen officiel et le plus rapide pour démarrer un projet correctement configuré.",
    },
    {
      title: "Structure d'un projet Next.js",
      description: "App, public, package.json : comprendre le rôle de chaque dossier.",
      duration: 18,
      order: 3,
      free: true,
      content:
        "# Structure d'un projet Next.js\n\nVoici l'arborescence type d'un projet Next.js 16 :\n\n```\nmon-projet/\n├── app/                # Routes et composants\n├── public/             # Fichiers statiques\n├── components/         # Composants réutilisables\n├── lib/                # Utilitaires et logique serveur\n├── prisma/             # Modèles et migrations\n├── node_modules/       # Dépendances\n├── package.json\n├── tsconfig.json\n└── next.config.ts\n```\n\n## Le dossier app/\n\nC'est le cœur du projet. Chaque sous-dossier correspond à une URL :\n\n```\napp/\n├── layout.tsx      # Layout racine (obligatoire)\n├── page.tsx        # Page d'accueil\n├── about/\n│   └── page.tsx    # /about\n├── blog/\n│   ├── page.tsx    # /blog\n│   └── [slug]/     # /blog/hello-world\n│       └── page.tsx\n```\n\n## Le dossier public/\n\nImages, polices et fichiers servis tels quels :\n\n```\npublic/\n├── images/\n├── favicon.ico\n└── robots.txt\n```\n\nUn fichier `public/logo.png` est accessible à `/logo.png`.\n\n> **À retenir** : la convention de nommage des fichiers (`page.tsx`, `layout.tsx`) EST le système de routage. Rien à configurer.",
    },
    {
      title: "Fichiers conventionnels : layout, loading, error",
      description: "Les fichiers spéciaux qui structurent chaque route.",
      duration: 22,
      order: 4,
      free: true,
      content:
        "# Fichiers conventionnels\n\n## layout.tsx\n\nLe layout enveloppe toutes les pages d'un segment. Il persiste pendant la navigation :\n\n```tsx\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"fr\">\n      <body className=\"bg-background\">{children}</body>\n    </html>\n  );\n}\n```\n\n## loading.tsx\n\nAffiche un écran de chargement pendant la résolution du segment :\n\n```tsx\nexport default function Loading() {\n  return <p>Chargement...</p>;\n}\n```\n\n## error.tsx\n\nLe filet de sécurité. Il reçoit l'erreur et un `reset` :\n\n```tsx\n\"use client\";\n\nexport default function Error({ reset }: { reset: () => void }) {\n  return (\n    <div>\n      <p>Une erreur est survenue.</p>\n      <button onClick={() => reset()}>Réessayer</button>\n    </div>\n  );\n}\n```\n\n## not-found.tsx\n\nPersonnalise la page 404 du segment.\n\n> **À retenir** : ces fichiers imbriqués s'appliquent au segment courant ET à ses enfants.",
    },
    // Module 2 — App Router
    {
      title: "Le rendu : SSR, SSG, ISR et client",
      description: "Quand chaque stratégie de rendu est appropriée.",
      duration: 30,
      order: 5,
      free: true,
      content:
        "# Le rendu : SSR, SSG, ISR et client\n\n## Static (SSG)\n\nGénéré une fois au build. Idéal pour le contenu qui change rarement :\n\n```tsx\nexport const dynamic = \"force-static\";\n```\n\n## Dynamic (SSR)\n\nRendu à chaque requête avec les données à jour :\n\n```tsx\nexport const dynamic = \"force-dynamic\";\n```\n\n## ISR — Incremental Static Regeneration\n\nStatique + rafraîchi en arrière-plan :\n\n```tsx\nexport const revalidate = 3600; // 1 heure\n```\n\n## Client\n\nInteractive, s'exécute dans le navigateur :\n\n```tsx\n\"use client\";\n```\n\n## Règle de décision\n\n| Besoin | Stratégie |\n|--------|-----------|\n| Contenu public stable | SSG |\n| Données personnelles à jour | SSR |\n| Contenu qui change à intervalle régulier | ISR |\n| Interactions, état local | Client |\n\n> **À retenir** : par défaut, Next.js statique autant que possible. Déréglez uniquement là où c'est nécessaire.",
    },
    {
      title: "Navigation et composant Link",
      description: "La navigation client-side, les URL dynamiques et les useRouter.",
      duration: 25,
      order: 6,
      free: false,
      content:
        "# Navigation avec Link\n\n## Link : navigation instantanée\n\n```tsx\nimport Link from \"next/link\";\n\n<Link href=\"/about\" className=\"hover:underline\">À propos</Link>\n<Link href={`/blog/${slug}`}>Article</Link>\n```\n\n`Link` précharge les pages au survol (visible sur mobile uniquement quand visible à l'écran) : la navigation est instantanée.\n\n## useRouter\n\nPour naviguer après une action :\n\n```tsx\n\"use client\";\n\nimport { useRouter } from \"next/navigation\";\n\nexport function BoutonRetour() {\n  const router = useRouter();\n  return <button onClick={() => router.push(\"/\")}>Accueil</button>;\n}\n```\n\n## usePathname\n\nPour connaître l'URL courante (menus actifs) :\n\n```tsx\nconst pathname = usePathname();\nconst active = pathname === \"/blog\";\n```\n\n## Links dynamiques\n\nPour générer des liens depuis des données :\n\n```tsx\nconst posts = await getPosts();\n\n<nav>\n  {posts.map((post) => (\n    <Link key={post.slug} href={`/blog/${post.slug}`}>{post.title}</Link>\n  ))}\n</nav>\n```\n\n> **À retenir** : préférez toujours `Link` à un `<a>` classique pour la navigation interne. C'est la différence entre une SPA fluide et des rechargements de page.",
    },
    {
      title: "Metadata API et SEO de base",
      description: "Titres, descriptions et Open Graph avec l'API Metadata.",
      duration: 20,
      order: 7,
      free: false,
      content:
        "# Metadata API\n\n## Métadonnées statiques\n\n```tsx\nimport type { Metadata } from \"next\";\n\nexport const metadata: Metadata = {\n  title: \"Mon site\",\n  description: \"Un site construit avec Next.js\",\n};\n```\n\n## Métadonnées dynamiques\n\n```tsx\nexport async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {\n  const post = await getPost(params.slug);\n  return {\n    title: post.title,\n    description: post.excerpt,\n    openGraph: {\n      title: post.title,\n      images: [post.coverImage],\n    },\n  };\n}\n```\n\n## Le titre par défaut\n\n```tsx\nexport const metadata: Metadata = {\n  title: { default: \"Wabtechs\", template: \"%s — Wabtechs\" },\n};\n```\n\n## Open Graph et Twitter\n\n```tsx\nopenGraph: {\n  title: \"...\",\n  description: \"...\",\n  url: \"https://...\",\n  siteName: \"Wabtechs\",\n  images: [\"https://.../og.png\"],\n  type: \"website\",\n},\ntwitter: { card: \"summary_large_image\" },\n```\n\n> **À retenir** : `generateMetadata` est une fonction serveur : elle peut accéder à la base de données pour générer les balises.",
    },
    {
      title: "Route Handlers : construire une API",
      description: "Des endpoints complets avec NextRequest et NextResponse.",
      duration: 28,
      order: 8,
      free: false,
      content:
        "# Route Handlers\n\nUn fichier `route.ts` crée un endpoint HTTP dans le même dossier que la page :\n\n```\napp/api/posts/\n├── route.ts        # /api/posts\n├── [id]/\n│   └── route.ts    # /api/posts/1\n```\n\n## GET et POST\n\n```tsx\nimport { NextResponse } from \"next/server\";\nimport { db } from \"@/lib/prisma\";\n\nexport async function GET() {\n  const posts = await db.post.findMany();\n  return NextResponse.json(posts);\n}\n\nexport async function POST(req: Request) {\n  const body = await req.json();\n  const post = await db.post.create({ data: body });\n  return NextResponse.json(post, { status: 201 });\n}\n```\n\n## Accéder aux paramètres\n\n```tsx\nexport async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  // ...\n}\n```\n\n## Query strings\n\n```tsx\nexport async function GET(req: Request) {\n  const { searchParams } = new URL(req.url);\n  const q = searchParams.get(\"q\");\n}\n```\n\n## Erreurs\n\n```tsx\nreturn NextResponse.json({ error: \"Non trouvé\" }, { status: 404 });\n```\n\n> **À retenir** : les Route Handlers vivent dans le dossier `app`, partagent l'isolation serveur et peuvent être aussi simples ou puissants que nécessaire.",
    },
    // Module 3 — React 19
    {
      title: "Composants serveur et client",
      description: "La frontière serveur/client et quand utiliser quel composant.",
      duration: 35,
      order: 9,
      free: true,
      content:
        "# Composants serveur et client\n\n## Le principe\n\nPar défaut, tout composant est un **Server Component** :\n\n- exécuté sur le serveur uniquement\n- peut lire la base de données directement\n- ne charge aucun JavaScript côté client\n\n```tsx\n// Ce composant est un Server Component\nexport default async function Page() {\n  const posts = await db.post.findMany();\n  return posts.map((p) => <PostCard key={p.id} post={p} />);\n}\n```\n\n## Passer côté client\n\nDès qu'un composant utilise des hooks ou des événements, marquez-le :\n\n```tsx\n\"use client\";\n\nimport { useState } from \"react\";\n\nexport function Compteur() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>{n}</button>;\n}\n```\n\n## La règle d'or\n\n**Serveur par défaut, client seulement si nécessaire.** Un composant client ne peut pas contenir un composant serveur — mais l'inverse est possible.\n\n## Passer des données\n\nLes composants serveur passent des données sérialisables aux composants client :\n\n```tsx\n<CarteClient post={post} /> // ✓ ok\n<CarteClient fonction={fn} /> // ✗ non sérialisable\n```\n\n> **À retenir** : chaque `\"use client\"` ajoute du JavaScript au bundle. Gardez la couche interactive mince et la couche serveur épaisse.",
    },
    {
      title: "Hooks essentiels de React 19",
      description: "useState, useEffect, useOptimistic, useTransition.",
      duration: 32,
      order: 10,
      free: false,
      content:
        "# Hooks essentiels\n\n## useState et useEffect\n\n```tsx\n\"use client\";\n\nconst [user, setUser] = useState<User | null>(null);\n\nuseEffect(() => {\n  fetch(\"/api/me\").then((r) => r.json()).then(setUser);\n}, []);\n```\n\n## useTransition\n\nPour des transitions non bloquantes :\n\n```tsx\nconst [isPending, startTransition] = useTransition();\n\nstartTransition(() => {\n  setFilter(\"popular\");\n});\n```\n\n## useOptimistic\n\nMise à jour optimiste de l'interface :\n\n```tsx\nconst [optimisticLikes, addOptimistic] = useOptimistic(likes);\n\nasync function handleLike() {\n  addOptimistic(likes + 1);\n  await likePost();\n}\n```\n\n## useActionState\n\nPour gérer l'état d'une Server Action :\n\n```tsx\nconst [state, action, pending] = useActionState(updateProfile, { ok: false });\n```\n\n> **À retenir** : React 19 simplifie le modèle mental. Préférez `useTransition` + `useOptimistic` à une gestion complexe de loading states.",
    },
    {
      title: "Server Actions et mutations",
      description: "Écrire en base sans API dédiée, avec sécurité intégrée.",
      duration: 38,
      order: 11,
      free: false,
      content:
        "# Server Actions\n\nUne Server Action est une fonction asynchrone qui s'exécute sur le serveur, appelée depuis le client.\n\n## Définition\n\n```tsx\n\"use server\";\n\nimport { db } from \"@/lib/prisma\";\n\nexport async function likePost(postId: string) {\n  await db.post.update({\n    where: { id: postId },\n    data: { likes: { increment: 1 } },\n  });\n}\n```\n\n## Utilisation dans un formulaire\n\n```tsx\n<form action={likePost.bind(null, post.id)}>\n  <button type=\"submit\">J'aime</button>\n</form>\n```\n\n## Redirection et rafraîchissement\n\n```tsx\n\"use server\";\n\nimport { redirect } from \"next/navigation\";\nimport { revalidatePath } from \"next/cache\";\n\nexport async function createPost(data: FormData) {\n  const post = await db.post.create({ data });\n  revalidatePath(\"/blog\");\n  redirect(`/blog/${post.slug}`);\n}\n```\n\n## Validation côté serveur\n\n```tsx\nimport { z } from \"zod\";\n\nconst schema = z.object({ title: z.string().min(3) });\nconst parsed = schema.parse(Object.fromEntries(formData));\n```\n\n> **À retenir** : les Server Actions éliminent la duplication entre client et serveur. La validation côté serveur reste indispensable — ne la sautez jamais.",
    },
    {
      title: "Formulaires avec Form et useActionState",
      description: "Gérer les formulaires de bout en bout avec état et erreurs.",
      duration: 30,
      order: 12,
      free: false,
      content:
        "# Formulaires modernes\n\n## Le composant Form (Next 16)\n\n```tsx\nimport Form from \"next/form\";\n\n<Form action={searchAction}>\n  <input name=\"q\" />\n  <button>Rechercher</button>\n</Form>\n```\n\n## Gérer l'état du formulaire\n\n```tsx\n\"use client\";\n\nimport { useActionState } from \"react\";\n\nconst [state, formAction, pending] = useActionState(login, { error: null });\n\nreturn (\n  <form action={formAction}>\n    <input name=\"email\" />\n    {state.error && <p className=\"text-red-500\">{state.error}</p>}\n    <button disabled={pending}>Se connecter</button>\n  </form>\n);\n```\n\n## Erreurs par champ\n\n```tsx\nconst parsed = schema.safeParse(values);\nif (!parsed.success) {\n  return { error: parsed.error.flatten().fieldErrors };\n}\n```\n\n> **À retenir** : `next/form` gère la soumission + navigation ; `useActionState` gère l'état et les erreurs. Ensemble ils couvrent 90% des formulaires.",
    },
    // Module 4 — Données & Prisma
    {
      title: "Modéliser avec Prisma",
      description: "Schema, migrations et premiers modèles.",
      duration: 40,
      order: 13,
      free: true,
      content:
        "# Modéliser avec Prisma\n\n## Installer Prisma\n\n```bash\nnpm install @prisma/client\nnpm install -D prisma\nnpx prisma init\n```\n\n## Le schéma\n\n```prisma\ngenerator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel Post {\n  id        String   @id @default(cuid())\n  title     String\n  slug      String   @unique\n  content   String\n  published Boolean  @default(false)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  author   User   @relation(fields: [authorId], references: [id])\n  authorId String\n\n  @@map(\"posts\")\n}\n\nmodel User {\n  id    String @id @default(cuid())\n  email String @unique\n  name  String?\n  posts Post[]\n\n  @@map(\"users\")\n}\n```\n\n## Synchroniser la base\n\n```bash\nnpx prisma db push    # dev\nnpx prisma migrate dev --name init   # avec migration\n```\n\n## Le client unique\n\n```ts\nexport const db = globalThis.prisma ?? new PrismaClient();\n```\n\n> **À retenir** : Prisma génère un client TypeScript typé à partir du schéma. Le schéma EST la source de vérité.",
    },
    {
      title: "CRUD côté serveur",
      description: "Créer, lire, mettre à jour et supprimer avec Prisma.",
      duration: 35,
      order: 14,
      free: false,
      content:
        "# CRUD avec Prisma\n\n## Créer\n\n```ts\nconst post = await db.post.create({\n  data: { title: \"Bonjour\", slug: \"bonjour\", content: \"...\", authorId },\n});\n```\n\n## Lire\n\n```ts\nconst all = await db.post.findMany({ orderBy: { createdAt: \"desc\" } });\nconst one = await db.post.findUnique({ where: { slug: \"bonjour\" } });\n```\n\n## Mettre à jour\n\n```ts\nconst updated = await db.post.update({\n  where: { id: post.id },\n  data: { published: true },\n});\n```\n\n## Supprimer\n\n```ts\nawait db.post.delete({ where: { id: post.id } });\n```\n\n## Pagination\n\n```ts\nconst page = await db.post.findMany({\n  skip: (page - 1) * 10,\n  take: 10,\n});\n```\n\n> **À retenir** : les requêtes Prisma sont typées : une erreur de colonne se voit au compile time, pas en production.",
    },
    {
      title: "Relations et requêtes avancées",
      description: "Include, select, agrégats et transactions.",
      duration: 42,
      order: 15,
      free: false,
      content:
        "# Relations avancées\n\n## Include : charger les relations\n\n```ts\nconst post = await db.post.findUnique({\n  where: { id },\n  include: { author: true, comments: { orderBy: { createdAt: \"desc\" } } },\n});\n```\n\n## Select : ne charger que le nécessaire\n\n```ts\nconst titles = await db.post.findMany({\n  select: { id: true, title: true },\n});\n```\n\n## Compter\n\n```ts\nconst stats = await db.post.aggregate({\n  _count: { _all: true },\n});\n```\n\n## Transactions\n\n```ts\nawait db.$transaction([\n  db.user.update({ where: { id }, data: { points: { decrement: 50 } } }),\n  db.order.create({ data: { userId: id, total: 50 } }),\n]);\n```\n\n## Filtres avancés\n\n```ts\nconst results = await db.post.findMany({\n  where: {\n    published: true,\n    OR: [{ title: { contains: q } }, { content: { contains: q } }],\n  },\n});\n```\n\n> **À retenir** : `include` et `select` sont vos outils de contrôle. Trop de `include` = requêtes lourdes ; `select` serré = APIs rapides.",
    },
    {
      title: "Stratégies de cache des données",
      description: "Données réactives et rafraîchissement ciblé.",
      duration: 26,
      order: 16,
      free: false,
      content:
        "# Cache des données\n\n## revalidatePath\n\nAprès une mutation, invalidez le cache de pages :\n\n```ts\nexport async function publishPost(id: string) {\n  await db.post.update({ where: { id }, data: { published: true } });\n  revalidatePath(\"/blog\");\n  revalidatePath(`/blog/${slug}`);\n}\n```\n\n## revalidateTag\n\nUn contrôle plus fin avec des tags :\n\n```ts\n// Dans la lecture :\nexport async function getPosts() {\n  return db.post.findMany({ ... });\n}\n\n// Après la mutation :\nrevalidateTag(\"posts\");\n```\n\n## fetch avec tags\n\n```ts\nawait fetch(\"/api/...\", { next: { tags: [\"posts\"] } });\n```\n\n## router.refresh()\n\nRafraîchit les données côté client sans perdre l'état :\n\n```tsx\nconst router = useRouter();\nrouter.refresh();\n```\n\n> **À retenir** : ne rafraîchissez pas toute l'application. Ciblez précisément (`revalidatePath`, `revalidateTag`) pour rester performant.",
    },
    // Module 5 — Auth & Sécurité
    {
      title: "Authentification avec Auth.js (NextAuth v5)",
      description: "Credentials et providers OAuth, sessions et routes protégées.",
      duration: 45,
      order: 17,
      free: true,
      content:
        "# Authentification avec Auth.js\n\n## Installation\n\n```bash\nnpm install next-auth@beta @auth/prisma-adapter\n```\n\n## Configuration\n\n```ts\n// src/auth.ts\nimport NextAuth from \"next-auth\";\nimport Credentials from \"next-auth/providers/credentials\";\n\nexport const { handlers, auth, signIn, signOut } = NextAuth({\n  providers: [\n    Credentials({\n      credentials: { email: {}, password: {} },\n      async authorize(credentials) {\n        const user = await verifyPassword(credentials);\n        return user ?? null;\n      },\n    }),\n  ],\n});\n```\n\n## Les handlers\n\n```tsx\n// app/api/auth/[...nextauth]/route.ts\nimport { handlers } from \"@/auth\";\nexport const { GET, POST } = handlers;\n```\n\n## Lire la session\n\n```tsx\nimport { auth } from \"@/auth\";\n\nconst session = await auth();\nif (session?.user) {\n  // connecté\n}\n```\n\n## Côté client\n\n```tsx\n\"use client\";\nimport { useSession, signIn, signOut } from \"next-auth/react\";\n```\n\n> **À retenir** : Auth.js centralise l'authentification et vous expose `auth()` côté serveur, `useSession()` côté client.",
    },
    {
      title: "Middleware et routes protégées",
      description: "Protéger des pages et des APIs par rôle.",
      duration: 30,
      order: 18,
      free: false,
      content:
        "# Protéger l'application\n\n## Le middleware\n\n```tsx\n// middleware.ts\nexport { auth as middleware } from \"@/auth\";\n\nexport const config = {\n  matcher: [\"/admin/:path*\", \"/account/:path*\"],\n};\n```\n\n## Vérifier le rôle\n\n```tsx\nimport { auth } from \"@/auth\";\n\nexport async function requireAdmin() {\n  const session = await auth();\n  if (!session?.user || session.user.role !== \"ADMIN\") {\n    redirect(\"/login\");\n  }\n  return session;\n}\n```\n\n## Protéger les APIs\n\n```tsx\nexport async function GET() {\n  const session = await auth();\n  if (!session?.user) {\n    return Response.json({ error: \"Non autorisé\" }, { status: 401 });\n  }\n  // ...\n}\n```\n\n## Layouts privés\n\n```tsx\n// app/account/layout.tsx\nexport default async function AccountLayout({ children }) {\n  const session = await auth();\n  if (!session) redirect(\"/login\");\n  return <div>{children}</div>;\n}\n```\n\n> **À retenir** : le middleware protège la première couche ; chaque page ou API sensible doit vérifier la session elle-même. Ne vous fiez pas à une seule couche.",
    },
    {
      title: "Sécurité : headers, CSRF, secrets",
      description: "Les protections HTTP essentielles pour la production.",
      duration: 28,
      order: 19,
      free: false,
      content:
        "# Sécurité en production\n\n## Headers de sécurité\n\n```tsx\n// next.config.ts\nexport default {\n  async headers() {\n    return [\n      {\n        source: \"/:path*\",\n        headers: [\n          { key: \"X-Frame-Options\", value: \"DENY\" },\n          { key: \"X-Content-Type-Options\", value: \"nosniff\" },\n          { key: \"Referrer-Policy\", value: \"strict-origin-when-cross-origin\" },\n          { key: \"X-XSS-Protection\", value: \"1; mode=block\" },\n        ],\n      },\n    ];\n  },\n};\n```\n\n## Les secrets\n\n- Jamais de secrets dans le code ou en clair dans les commits\n- Utilisez `.env` et `.env.example`\n- Les variables préfixées `NEXT_PUBLIC_` sont visibles côté client — n'y mettez que des valeurs publiques\n\n## Vérifier les dépendances\n\n```bash\nnpm audit\n```\n\n## Mot de passe\n\n```ts\nimport bcrypt from \"bcryptjs\";\nconst hash = await bcrypt.hash(password, 12);\nconst ok = await bcrypt.compare(password, hash);\n```\n\n> **À retenir** : la sécurité est un état d'esprit. Chaque route, chaque variable d'environnement, chaque dépendance est une surface d'attaque.",
    },
    // Module 6 — API & Intégrations
    {
      title: "Webhooks et intégrations",
      description: "Recevoir des événements externes et les traiter en toute sécurité.",
      duration: 34,
      order: 20,
      free: false,
      content:
        "# Webhooks\n\n## Le principe\n\nUn service externe appelle votre API pour vous informer d'un événement (paiement, livraison, build...).\n\n## Route dédiée\n\n```tsx\n// app/api/webhooks/stripe/route.ts\nexport async function POST(req: Request) {\n  const payload = await req.text();\n  const signature = req.headers.get(\"stripe-signature\");\n\n  const event = stripe.webhooks.constructEvent(\n    payload,\n    signature,\n    process.env.STRIPE_WEBHOOK_SECRET!,\n  );\n\n  switch (event.type) {\n    case \"checkout.session.completed\":\n      await grantAccess(event.data.object);\n      break;\n  }\n\n  return Response.json({ received: true });\n}\n```\n\n## Vérifier la signature\n\nToujours vérifier la signature avant de traiter. Ne faites jamais confiance à un appel non authentifié.\n\n## Idempotence\n\nUn webhook peut être livré plusieurs fois. Rendez le traitement idempotent :\n\n```ts\nexport async function grantAccess(sessionId: string) {\n  const existing = await db.purchase.findUnique({ where: { stripeSessionId: sessionId } });\n  if (existing) return;\n  // ...\n}\n```\n\n> **À retenir** : trois règles : vérifier la signature, répondre vite, rendre le traitement idempotent.",
    },
    {
      title: "Paiements Stripe Checkout",
      description: "Créer une session de paiement et traiter le succès.",
      duration: 44,
      order: 21,
      free: false,
      content:
        "# Paiements Stripe\n\n## Installer\n\n```bash\nnpm install stripe\n```\n\n## Créer une session\n\n```tsx\n// app/api/checkout/route.ts\nimport Stripe from \"stripe\";\n\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);\n\nexport async function POST(req: Request) {\n  const { priceId, userId } = await req.json();\n\n  const session = await stripe.checkout.sessions.create({\n    mode: \"payment\",\n    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,\n    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,\n    line_items: [{ price: priceId, quantity: 1 }],\n    metadata: { userId },\n  });\n\n  return Response.json({ url: session.url });\n}\n```\n\n## Produits\n\nCréez les produits sur le dashboard Stripe ou via l'API :\n\n```ts\nawait stripe.products.create({ name: \"Cours Next.js\" });\nawait stripe.prices.create({\n  product: product.id,\n  currency: \"eur\",\n  unit_amount: 3900, // 39,00€\n});\n```\n\n## Traiter le succès (webhook)\n\nSur `checkout.session.completed` : vérifiez le paiement, puis accordez l'accès.\n\n> **À retenir** : le prix est TOUJOURS défini côté serveur. La quantité du panier peut venir du client, pas le montant.",
    },
    // Module 7 — Performance & SEO
    {
      title: "Images et polices optimisées",
      description: "next/image, priority, formats modernes, next/font.",
      duration: 30,
      order: 22,
      free: false,
      content:
        "# Images et polices\n\n## next/image\n\n```tsx\nimport Image from \"next/image\";\n\n<Image\n  src=\"/hero.png\"\n  alt=\"Hero\"\n  width={1200}\n  height={630}\n  priority\n  sizes=\"(max-width: 768px) 100vw, 50vw\"\n/>\n```\n\n`next/image` optimise : format WebP/AVIF, dimensions, lazy loading, préchargement (`priority`).\n\n## Polices avec next/font\n\n```tsx\nimport { Inter } from \"next/font/google\";\n\nconst inter = Inter({ subsets: [\"latin\"] });\n\n<html className={inter.className}>\n```\n\nAucun flash de texte invisible (FOIT), polices auto-hébergées, pas de requête vers Google.\n\n## Les bonnes pratiques\n\n- Toujours fournir `width`/`height` ou `sizes`\n- Utiliser `priority` sur le LCP (contenu visible au premier écran)\n- Limiter les polices à 2-3 familles\n\n> **À retenir** : les images représentent la majorité du poids d'une page. `next/image` s'en occupe automatiquement.",
    },
    {
      title: "SEO avancé et JSON-LD",
      description: "Breadcrumbs, FAQ schema et données structurées.",
      duration: 32,
      order: 23,
      free: false,
      content:
        "# SEO avancé\n\n## JSON-LD\n\n```tsx\nconst schema = {\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Article\",\n  headline: post.title,\n  datePublished: post.publishedAt,\n  author: { \"@type\": \"Person\", name: \"Wabtechs\" },\n  image: post.coverImage,\n};\n\nreturn (\n  <>\n    <script type=\"application/ld+json\" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />\n    ...\n  </>\n);\n```\n\n## Sitemap\n\n```tsx\n// app/sitemap.ts\nexport default function sitemap() {\n  return [\n    { url: \"https://...\", lastModified: new Date(), changeFrequency: \"weekly\", priority: 1 },\n  ];\n}\n```\n\n## Robots\n\n```tsx\n// app/robots.ts\nexport default function robots() {\n  return { rules: [{ userAgent: \"*\", allow: \"/\" }], sitemap: \"https://.../sitemap.xml\" };\n}\n```\n\n## Canonical\n\n```tsx\nexport const metadata = { alternates: { canonical: \"/page\" } };\n```\n\n> **À retenir** : le JSON-LD aide Google à afficher des résultats enrichis. Le sitemap et robots.txt sont la base du crawl.",
    },
    {
      title: "Mesurer et améliorer la performance",
      description: "Core Web Vitals et outils de mesure.",
      duration: 25,
      order: 24,
      free: false,
      content:
        "# Performance\n\n## Core Web Vitals\n\n- **LCP** : temps de chargement du plus grand élément (cible : < 2,5s)\n- **INP** : réactivité aux interactions (cible : < 200ms)\n- **CLS** : stabilité visuelle (cible : < 0,1)\n\n## Outils\n\n- Lighthouse (Audits dans les DevTools)\n- Vercel Analytics\n- web.dev/measure\n\n## Leviers principaux\n\n1. Réduire le JavaScript client (`\"use client\"` au minimum)\n2. Images optimisées et `priority` sur le LCP\n3. Polices locales via `next/font`\n4. ISR pour le contenu qui change peu\n\n> **À retenir** : mesurez avant d'optimiser. Améliorez ce que la mesure montre, pas ce que vous supposez.",
    },
    // Module 8 — Production & déploiement
    {
      title: "Tests : unitaires et e2e",
      description: "Vitest et Playwright pour un projet fiable.",
      duration: 38,
      order: 25,
      free: false,
      content:
        "# Tests\n\n## Tests unitaires avec Vitest\n\n```bash\nnpm install -D vitest\n```\n\n```ts\nexport function formatPrice(price: number) {\n  return new Intl.NumberFormat(\"fr-FR\", { style: \"currency\", currency: \"EUR\" }).format(price);\n}\n\n// __tests__/formatPrice.test.ts\nimport { expect, test } from \"vitest\";\n\ntest(\"formate 39 en euros\", () => {\n  expect(formatPrice(39)).toBe(\"39,00 €\");\n});\n```\n\n## Tests e2e avec Playwright\n\n```bash\nnpm init playwright\n```\n\n```ts\nimport { test, expect } from \"@playwright/test\";\n\ntest(\"la page d'accueil se charge\", async ({ page }) => {\n  await page.goto(\"/\");\n  await expect(page.getByRole(\"heading\", { level: 1 })).toBeVisible();\n});\n```\n\n## CI\n\n```yaml\nname: CI\non: [push, pull_request]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n      - run: npm ci\n      - run: npm run typecheck\n      - run: npx vitest run\n```\n\n> **À retenir** : les tests protègent la confiance. Un test e2e sur le parcours d'achat vaut dix tests unitaires triviaux.",
    },
    {
      title: "CI/CD et déploiement Vercel",
      description: "De git à la production en quelques minutes.",
      duration: 32,
      order: 26,
      free: false,
      content:
        "# Déploiement\n\n## Vercel\n\n1. Connectez le dépôt GitHub dans le dashboard Vercel\n2. À chaque push sur `main`, Vercel build et déploie\n3. Chaque Pull Request reçoit une preview URL\n4. Vercel fournit SSL, CDN et domaine automatiquement\n\n## Variables d'environnement\n\nConfigurez sur Vercel (Production, Preview, Development) :\n\n- `DATABASE_URL`\n- `AUTH_SECRET`\n- `NEXT_PUBLIC_BASE_URL`\n- `RESEND_API_KEY`\n\n## Déploiement en ligne de commande\n\n```bash\nnpx vercel --prod\n```\n\n## Le processus de release\n\n1. Branche `main` toujours déployable\n2. PRs courtes et revues\n3. CI vert avant merge (typecheck, tests, build)\n4. Preview link testé avant la prod\n\n> **À retenir** : le déploiement doit être ennuyeux — automatique, reproductible, vérifié. Si vous avez peur de déployer, votre process a un problème.",
    },
    {
      title: "Projet final : build complet",
      description: "Récapitulatif et exercice complet pour valider vos acquis.",
      duration: 60,
      order: 27,
      free: false,
      content:
        "# Projet final\n\n## Objectif\n\nConstruisez une mini-plateforme de blog + cours avec :\n\n1. **Authentification** — inscription, connexion, profil\n2. **Blog** — liste, détail, pagination (ISR)\n3. **Academy** — cours avec leçons, inscription, progression\n4. **Paiement** — un cours premium payant via Stripe\n5. **Admin** — CRUD protégé par rôle\n\n## Étapes\n\n```bash\nnpx create-next-app@latest mon-projet --typescript --tailwind --app\nnpm install prisma @prisma/client next-auth@beta @auth/prisma-adapter\nnpx prisma init\n```\n\nPuis, dans l'ordre :\n\n1. Modèles Prisma : User, Post, Course, Lesson, Enrollment\n2. Layout racine + thème\n3. Pages publiques (SSG/ISR)\n4. Auth (Credentials)\n5. Server Actions pour les mutations\n6. Route handlers + webhook Stripe\n7. Pages admin protégées\n8. CI + déploiement Vercel\n\n## Critères de réussite\n\n- [ ] Typecheck et build passent\n- [ ] Un utilisateur peut s'inscrire et se connecter\n- [ ] Un admin peut créer un cours\n- [ ] Un utilisateur peut s'inscrire à un cours\n- [ ] Le paiement accorde l'accès au cours premium\n- [ ] CI verte sur le dépôt\n\n## Ressources\n\n- nextjs.org/docs\n- prisma.io/docs\n- authjs.dev\n- vercel.com/docs\n\n> Félicitations, vous avez construit une application complète de niveau production. Partagez votre résultat — la communauté Wabtechs est curieuse de voir vos projets !",
    },
  ];

  const course = await prisma.course.create({
    data: {
      slug: SLUG,
      title: "Next.js 16 — De zéro à pro",
      description:
        "Apprenez à construire des applications web complètes et de niveau production avec Next.js 16 : App Router, React 19, Prisma, Auth, Stripe et déploiement Vercel.",
      price: 0,
      level: "beginner",
      duration: "10h",
      published: true,
      featured: true,
      lessons: {
        create: lessons.map(({ title, description, duration, order, free, content }) => ({
          title,
          description,
          duration,
          order,
          free,
          content,
        })),
      },
    },
  });

  console.log(`✓ Course created: ${course.title} (${lessons.length} leçons)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
