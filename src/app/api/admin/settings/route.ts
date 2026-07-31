import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

const DEFAULTS: Record<string, Record<string, string>> = {
  general: {
    siteName: "Wabtechs",
    siteDescription: "Plateforme technologique — Développement, Articles, Projets, Formations.",
    siteUrl: "https://wabtechs-platform.vercel.app",
    authorName: "Emmanuel Mulonda Johannes",
    authorEmail: "contact@wabtechs.com",
    authorPhone: "+243 850 060 060",
    authorAddress: "n°27 bis Katakombe 2 Ngalima Kinshasa RDC",
    logo: "/images/logos/logo.png",
  },
  hero: {
    greeting: "Salut, Je suis",
    name: "Emmanuel Mulonda Johannes",
    role: "Développeur",
    description: "Nous utilisons des langages de programmation, des outils et des frameworks pour concevoir et mettre en œuvre des sites web qui sont à la fois fonctionnels et attrayants.",
    ctaText: "Suis-là",
    cvText: "Download my CV",
    heroImage: "/images/hero/Emmanuel Mulonda Johannes.png",
    progressShape: "/images/hero/progress-shape.png",
  },
  about: {
    badge: "À propos de moi",
    title: "Ingenieur Informaticien En Génie Électrique",
    description: "Je suis Technicien Ingénieur Informatique de l'Institut Supérieur de Techniques Appliquée ISTA Kinshasa, Licencié en génie électrique, spécialisation en informatique appliquée.",
    image: "/images/about/Emmanuel Mulonda Johannes.jpg",
    aboutDot: "/images/shape/about-dot.png",
    viraza: "/images/about/viraza.png",
  },
  resume: {
    badge: "Mon CV",
    title: "Expérience de solutions à des problèmes réels",
    items: JSON.stringify([
      { years: "2014 - Present", title: "Concepteur de produits principal", company: "Wabtechs Company" },
      { years: "2015 - 2017", title: "Concepteur UX/UI junior", company: "Google Online" },
      { years: "2017 - 2018", title: "Concepteur de produits senior", company: "Chance Sport Bet" },
      { years: "2019 - Présent", title: "Graphiste et Webmaster", company: "Viraza" },
    ]),
  },
  services: {
    badge: "Services Populaires",
    title: "Mon service spécial pour le développement de votre entreprise",
    items: JSON.stringify([
      { num: "01.", title: "Conception d'identité de marque", desc: "L'identité de marque est l'essence d'une entreprise." },
      { num: "02.", title: "Conception de sites Web", desc: "La conception de sites Web est un processus créatif." },
      { num: "03.", title: "Conception d'applications mobiles", desc: "La conception d'applications mobiles implique la création d'une interface." },
      { num: "04.", title: "Conception graphique animée", desc: "La conception graphique animée, ou motion design." },
      { num: "05.", title: "Développement de sites Web", desc: "Le développement Web est le processus technique." },
      { num: "06.", title: "Référencement et marketing numérique", desc: "Le référencement et le marketing numérique." },
    ]),
  },
  skills: {
    badge: "Mes compétences",
    title: "Explorons les compétences et l'expérience populaires",
    description: "Que ce soit dans le domaine de la technologie, du marketing, de la finance, de l'éducation ou de la santé.",
    items: JSON.stringify([
      { name: "Figma", percent: "95", img: "/images/skills/skill1.png" },
      { name: "Framer", percent: "83", img: "/images/skills/skill2.png" },
      { name: "Photoshop", percent: "93", img: "/images/skills/skill3.png" },
      { name: "WordPress", percent: "84", img: "/images/skills/skill4.png" },
      { name: "Angular", percent: "65", img: "/images/skills/skill5.png" },
      { name: "Webflow", percent: "86", img: "/images/skills/skill6.png" },
      { name: "Python", percent: "62", img: "/images/skills/skill7.png" },
      { name: "Sketch", percent: "94", img: "/images/skills/skill8.png" },
    ]),
  },
  pricing: {
    badge: "Tarifs forfaitaires",
    title: "Des prix incroyables pour vos projets",
    items: JSON.stringify([
      { name: "Basic Plan", save: "20%", price: "49.95", features: ["Conception de sites Web", "Conception d'applications mobiles", "Conception de produits"], disabled: ["Marketing numérique", "Support personnalisé"] },
      { name: "Forfait standard", save: "35%", price: "79.95", features: ["Conception de sites Web", "Conception d'applications mobiles", "Conception de produits", "Marketing numérique", "Assistance personnalisée"], disabled: [] },
      { name: "Premium Plan", save: "45%", price: "199.95", features: ["Conception de sites Web", "Conception d'applications mobiles", "Conception de produits", "Marketing numérique", "Assistance personnalisée"], disabled: [] },
    ]),
  },
  testimonials: {
    badge: "Témoignages",
    title: "Ce que disent mes clients",
    items: JSON.stringify([
      { name: "Client Happy", role: "CEO, TechStart", text: "Excellent travail ! Emmanuel a transformé notre vision en une réalité numérique impressionnante.", img: "/images/testimonials/author1.png" },
      { name: "Marie Dupont", role: "Directrice Marketing, InnovateCo", text: "Une collaboration extraordinaire. La qualité du code et le respect des délais were parfait.", img: "/images/testimonials/author2.png" },
    ]),
  },
  clients: {
    badge: "Clients",
    title: "183+ clients internationaux & beaucoup de projets terminés",
    logos: JSON.stringify(Array.from({ length: 8 }, (_, i) => `/images/client-logos/client-logo${i + 1}.png`)),
  },
  footer: {
    copyright: "Wabtechs Company",
    quickLinks: JSON.stringify([
      { label: "Service", href: "/services" },
      { label: "Projects", href: "/projects" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQs", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ]),
  },
  seo: {
    ogImage: "/images/hero/Emmanuel Mulonda Johannes.png",
    twitter: "@wabtechs",
  },
};

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const settings = await db.siteSetting.findMany();
    if (settings.length === 0) {
      const entries = Object.entries(DEFAULTS).flatMap(([group, items]) =>
        Object.entries(items).map(([key, value]) => ({ key, value, group }))
      );
      await db.siteSetting.createMany({ data: entries });
      const fresh = await db.siteSetting.findMany();
      return NextResponse.json(fresh);
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { key, value, group } = body as { key: string; value: string; group: string };

    const existing = await db.siteSetting.findUnique({ where: { key } });
    if (existing) {
      await db.siteSetting.update({ where: { key }, data: { value, group } });
      await createAuditLog({ action: "UPDATE", entity: "Paramètre", entityId: key, userId: session.user.id as string, details: JSON.stringify({ key, value, group }) });
    } else {
      await db.siteSetting.create({ data: { key, value, group } });
      await createAuditLog({ action: "CREATE", entity: "Paramètre", entityId: key, userId: session.user.id as string, details: JSON.stringify({ key, value, group }) });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body as { settings: { key: string; value: string; group: string }[] };

    for (const s of settings) {
      await db.siteSetting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: { key: s.key, value: s.value, group: s.group },
      });
    }
    await createAuditLog({ action: "UPDATE", entity: "Paramètre", entityId: "bulk", userId: session.user.id as string, details: JSON.stringify({ count: settings.length }) });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
