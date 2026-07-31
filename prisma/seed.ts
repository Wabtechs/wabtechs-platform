import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@wabtechs.com";
  const password = await bcrypt.hash("Admin@12345", 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Emmanuel Mulonda Johannes",
      password,
      role: "ADMIN",
      bio: "Développeur full-stack et fondateur de Wabtechs.",
      github: "https://github.com/wabtechs",
    },
  });

  console.log("✓ Admin user created");

  const skills = [
    { name: "Figma", percent: 95, image: "/images/skills/skill1.png", order: 1 },
    { name: "Framer", percent: 83, image: "/images/skills/skill2.png", order: 2 },
    { name: "Photoshop", percent: 93, image: "/images/skills/skill3.png", order: 3 },
    { name: "WordPress", percent: 84, image: "/images/skills/skill4.png", order: 4 },
    { name: "Angular", percent: 65, image: "/images/skills/skill5.png", order: 5 },
    { name: "Webflow", percent: 86, image: "/images/skills/skill6.png", order: 6 },
    { name: "Python", percent: 62, image: "/images/skills/skill7.png", order: 7 },
    { name: "Sketch", percent: 94, image: "/images/skills/skill8.png", order: 8 },
    { name: "Oracle APEX", percent: 78, image: "/images/skills/skill9.png", order: 9 },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: { percent: skill.percent, image: skill.image, order: skill.order },
      create: skill,
    });
  }

  console.log("✓ Skills seeded");

  await prisma.service.deleteMany();
  const services = [
    { num: "01.", title: "Conception d'identité de marque", description: "L'identité de marque est l'essence d'une entreprise. Elle englobe les valeurs, la mission et la présentation de l'entreprise au monde.", order: 1 },
    { num: "02.", title: "Conception de sites Web", description: "La conception de sites Web est un processus créatif qui implique la planification, la création et la mise en page d'un site Web.", order: 2 },
    { num: "03.", title: "Conception d'applications mobiles", description: "La conception d'applications mobiles implique la création d'une interface utilisateur attrayante et fonctionnelle.", order: 3 },
    { num: "04.", title: "Conception graphique animée", description: "La conception graphique animée, ou motion design, est une forme d'art visuel qui utilise le mouvement comme principal outil.", order: 4 },
    { num: "05.", title: "Développement de sites Web", description: "Le développement Web est le processus technique qui permet à un site Web de fonctionner.", order: 5 },
    { num: "06.", title: "Référencement et marketing numérique", description: "Le référencement et le marketing numérique sont essentiels pour augmenter la visibilité en ligne d'une entreprise.", order: 6 },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }

  console.log("✓ Services seeded");

  await prisma.resumeItem.deleteMany();
  const resumeItems = [
    { years: "2014 - Present", title: "Concepteur de produits principal", company: "Wabtechs Company", order: 1 },
    { years: "2015 - 2017", title: "Concepteur UX/UI junior", company: "Google Online", order: 2 },
    { years: "2017 - 2018", title: "Concepteur de produits senior", company: "Chance Sport Bet", order: 3 },
    { years: "2019 - Présent", title: "Graphiste et Webmaster", company: "Viraza", order: 4 },
  ];

  for (const item of resumeItems) {
    await prisma.resumeItem.create({ data: item });
  }

  console.log("✓ Resume items seeded");

  const pricingPlans = [
    { name: "Basic Plan", save: "20%", price: "49.95", features: ["Conception de sites Web", "Conception d'applications mobiles", "Conception de produits"], disabled: ["Marketing numérique", "Support personnalisé"], order: 1 },
    { name: "Forfait standard", save: "35%", price: "79.95", features: ["Conception de sites Web", "Conception d'applications mobiles", "Conception de produits", "Marketing numérique", "Assistance personnalisée"], disabled: [], featured: true, order: 2 },
    { name: "Premium Plan", save: "45%", price: "199.95", features: ["Conception de sites Web", "Conception d'applications mobiles", "Conception de produits", "Marketing numérique", "Assistance personnalisée"], disabled: [], order: 3 },
  ];

  await prisma.pricingPlan.deleteMany();
  for (const plan of pricingPlans) {
    await prisma.pricingPlan.create({ data: plan });
  }

  console.log("✓ Pricing plans seeded");

  await prisma.testimonial.deleteMany();
  const testimonials = [
    { name: "Client Happy", role: "CEO, TechStart", text: "Excellent travail ! Emmanuel a transformé notre vision en une réalité numérique impressionnante.", image: "/images/testimonials/author1.png", order: 1 },
    { name: "Marie Dupont", role: "Directrice Marketing, InnovateCo", text: "Une collaboration extraordinaire. La qualité du code, le respect des délais et la communication étaient parfaits.", image: "/images/testimonials/author2.png", order: 2 },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  console.log("✓ Testimonials seeded");

  const clients = [
    { name: "Client 1", logo: "/images/client-logos/client-logo1.png", order: 1 },
    { name: "Client 2", logo: "/images/client-logos/client-logo2.png", order: 2 },
    { name: "Client 3", logo: "/images/client-logos/client-logo3.png", order: 3 },
    { name: "Client 4", logo: "/images/client-logos/client-logo4.png", order: 4 },
    { name: "Client 5", logo: "/images/client-logos/client-logo5.png", order: 5 },
    { name: "Client 6", logo: "/images/client-logos/client-logo6.png", order: 6 },
    { name: "Client 7", logo: "/images/client-logos/client-logo7.png", order: 7 },
    { name: "Client 8", logo: "/images/client-logos/client-logo8.png", order: 8 },
  ];

  await prisma.client.deleteMany();
  for (const c of clients) {
    await prisma.client.create({ data: c });
  }

  console.log("✓ Clients seeded");

  await prisma.faqItem.deleteMany();
  const faqItems = [
    { question: "Qu'est-ce que Wabtechs ?", answer: "Wabtechs est une plateforme technologique proposant des articles, tutoriels, projets open source, podcasts et outils pour développeurs.", category: "Général", order: 1 },
    { question: "Comment puis-je contribuer ?", answer: "Vous pouvez contribuer via GitHub en ouvrant une issue ou une pull request sur nos repositories open source.", category: "Général", order: 2 },
    { question: "Les cours sont-ils gratuits ?", answer: "Certains cours sont gratuits, d'autres sont payants. Consultez notre Academy pour plus de détails.", category: "Academy", order: 3 },
    { question: "Puis-je utiliser vos templates pour mes projets ?", answer: "Oui, nos templates sont sous licence MIT et peuvent être utilisés librement pour vos projets personnels et commerciaux.", category: "Templates", order: 4 },
    { question: "Comment vous contacter ?", answer: "Utilisez le formulaire de contact ou envoyez un email à contact@wabtechs.com.", category: "Support", order: 5 },
  ];

  for (const faq of faqItems) {
    await prisma.faqItem.create({ data: faq });
  }

  console.log("✓ FAQ items seeded");

  const pages = [
    {
      slug: "about",
      title: "À propos",
      content: "Wabtechs est une plateforme technologique fondée par Emmanuel Mulonda Johannes. Nous proposons des articles, tutoriels, projets open source et outils pour la communauté des développeurs.",
      published: true,
    },
    {
      slug: "privacy",
      title: "Politique de confidentialité",
      content: "Votre vie privée est importante pour nous. Cette politique décrit comment nous collectons, utilisons et protégeons vos données personnelles.",
      published: true,
    },
    {
      slug: "terms",
      title: "Conditions d'utilisation",
      content: "En utilisant Wabtechs, vous acceptez nos conditions d'utilisation. Veuillez les lire attentivement.",
      published: true,
    },
  ];

  await prisma.page.deleteMany();
  for (const page of pages) {
    await prisma.page.create({ data: page });
  }

  console.log("✓ Pages seeded");

  const templates = [
    {
      slug: "admin-dashboard",
      name: "Admin Dashboard",
      description: "Dashboard admin complet avec sidebar, KPIs et thème sombre. Dérivé du dashboard Wabtechs.",
      longDescription:
        "# Admin Dashboard\n\nUn dashboard admin moderne et complet, directement inspiré de celui de Wabtechs.\n\n- Sidebar collapsible avec navigation groupée\n- Cartes KPI et graphiques\n- Thème clair/sombre\n- Tableaux de données réactifs\n- 60+ pages et composants",
      price: 29,
      category: "dashboard",
      stack: "Next.js, Tailwind, shadcn/ui, Prisma",
      demoUrl: "https://github.com/wabtechs/wabtechs-platform",
      repoUrl: "https://github.com/wabtechs/wabtechs-platform",
      version: "1.0.0",
      published: true,
      featured: true,
      downloads: 120,
    },
    {
      slug: "saas-landing",
      name: "Landing Page SaaS",
      description: "Landing page orientée conversion : hero, social proof, tarifs, FAQ.",
      longDescription:
        "# Landing Page SaaS\n\nUne landing page conçue pour convertir les visiteurs en clients.\n\n- Hero avec CTA principal et secondaire\n- Preuve sociale (logos, stats, témoignages)\n- Grille de tarifs\n- FAQ accordéon\n- Newsletter CTA",
      price: 0,
      category: "landing",
      stack: "Next.js, Tailwind, shadcn/ui",
      demoUrl: "https://github.com/wabtechs/wabtechs-platform",
      repoUrl: "https://github.com/wabtechs/wabtechs-platform",
      version: "1.1.0",
      published: true,
      featured: true,
      downloads: 340,
    },
    {
      slug: "mdx-blog",
      name: "Blog MDX",
      description: "Blog performant avec MDX, SEO, tags et article apparentés.",
      longDescription:
        "# Blog MDX\n\nUn blog prêt pour la production.\n\n- Contenu en MDX avec frontmatter\n- SEO complet (JSON-LD, Open Graph)\n- Tags et articles similaires\n- Sitemap généré automatiquement\n- Mode sombre",
      price: 19,
      category: "blog",
      stack: "Next.js, MDX, Tailwind",
      demoUrl: "https://github.com/wabtechs/wabtechs-platform",
      repoUrl: "https://github.com/wabtechs/wabtechs-platform",
      version: "1.0.0",
      published: true,
      featured: false,
      downloads: 85,
    },
    {
      slug: "dev-portfolio",
      name: "Portfolio Développeur",
      description: "Portfolio professionnel avec projets, compétences et section blog.",
      longDescription:
        "# Portfolio Développeur\n\nUn portfolio qui met en avant vos projets et vos compétences.\n\n- Section projets avec filtres\n- Compétences et expériences\n- Témoignages\n- Blog intégré\n- Formulaire de contact",
      price: 0,
      category: "portfolio",
      stack: "Next.js, Tailwind, shadcn/ui",
      demoUrl: "https://github.com/wabtechs/wabtechs-platform",
      repoUrl: "https://github.com/wabtechs/wabtechs-platform",
      version: "1.2.0",
      published: true,
      featured: true,
      downloads: 510,
    },
    {
      slug: "saas-starter-kit",
      name: "SaaS Starter Kit",
      description: "Le kit complet pour lancer un SaaS : auth, paiements, emails, billing.",
      longDescription:
        "# SaaS Starter Kit\n\nTout ce qu'il faut pour lancer votre SaaS.\n\n- Authentification (NextAuth)\n- Paiements Stripe et abonnements\n- Emails transactionnels (Resend)\n- Gestion de la facturation\n- Tableau de bord admin\n- Analytics intégrés",
      price: 49,
      category: "saas",
      stack: "Next.js, Prisma, Stripe, Resend, PostHog",
      demoUrl: "https://github.com/wabtechs/wabtechs-platform",
      repoUrl: "https://github.com/wabtechs/wabtechs-platform",
      version: "0.9.0",
      published: true,
      featured: true,
      downloads: 60,
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      update: { ...template },
      create: { ...template },
    });
  }

  console.log("✓ Templates seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
