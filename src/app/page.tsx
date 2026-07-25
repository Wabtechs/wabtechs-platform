import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Phone,
  Check,
} from "lucide-react";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { CTASection } from "@/components/home/cta-section";
import { BgLines } from "@/components/shared/bg-lines";
import { getAllPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const SERVICES = [
  { num: "01.", title: "Conception d'identité de marque", desc: "L'identité de marque est l'essence d'une entreprise. Elle englobe les valeurs, la mission et la présentation de l'entreprise au monde. Une identité de marque forte crée une connexion émotionnelle avec les clients." },
  { num: "02.", title: "Conception de sites Web", desc: "La conception de sites Web est un processus créatif qui implique la planification, la création et la mise en page d'un site Web. Le but est de créer un site attrayant et facile à utiliser." },
  { num: "03.", title: "Conception d'applications mobiles", desc: "La conception d'applications mobiles implique la création d'une interface utilisateur attrayante et fonctionnelle pour une application mobile. Cela comprend la conception de l'interface utilisateur et l'expérience utilisateur globale." },
  { num: "04.", title: "Conception graphique animée", desc: "La conception graphique animée, ou motion design, est une forme d'art visuel qui utilise le mouvement comme principal outil graphique et artistique." },
  { num: "05.", title: "Développement de sites Web", desc: "Le développement Web est le processus technique qui permet à un site Web de fonctionner. Il comprend le codage du site Web et l'intégration des fonctionnalités nécessaires." },
  { num: "06.", title: "Référencement et marketing numérique", desc: "Le référencement et le marketing numérique sont essentiels pour augmenter la visibilité en ligne d'une entreprise. Cela comprend l'optimisation du site Web pour les moteurs de recherche et la création de contenu pertinent." },
];

const SKILLS = [
  { name: "Figma", percent: "95%" },
  { name: "Framer", percent: "83%" },
  { name: "Photoshop", percent: "93%" },
  { name: "WordPress", percent: "84%" },
  { name: "Angular", percent: "65%" },
  { name: "Webflow", percent: "86%" },
  { name: "Python", percent: "62%" },
  { name: "Sketch", percent: "94%" },
];

const RESUME = [
  { years: "2014 - Present", title: "Concepteur de produits principal", company: "Wabtechs Company" },
  { years: "2015 - 2017", title: "Concepteur UX/UI junior", company: "Google Online" },
  { years: "2017 - 2018", title: "Concepteur de produits senior", company: "Chance Sport Bet" },
  { years: "2019 - Présent", title: "Graphiste et Webmaster", company: "Viraza" },
];

const PRICING = [
  { name: "Basic Plan", save: "20%", price: "49.95", app: "SNEN App", features: ["Conception de sites Web", "Conception d'applications mobiles", "Conception de produits"], disabled: ["Marketing numérique", "Support personnalisé"] },
  { name: "Forfait standard", save: "35%", price: "79.95", app: "SNEN App", features: ["Conception de sites Web", "Conception d'applications mobiles", "Conception de produits", "Marketing numérique", "Assistance personnalisée"], disabled: [] },
  { name: "Premium Plan", save: "45%", price: "199.95", app: "SNEN App", features: ["Conception de sites Web", "Conception d'applications mobiles", "Conception de produits", "Marketing numérique", "Assistance personnalisée"], disabled: [] },
];

export default function HomePage() {
  const posts = getAllPosts().slice(0, 2);

  return (
    <>
      <HeroSection />

      <section id="about" className="relative border-t border-white/10">
        <div className="for-bgc-black py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <div>
                <span className="sub-title">À propos de moi</span>
                <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
                  Ingenieur <span className="text-primary">Informaticien</span> En Génie Électrique
                </h2>
                <p className="max-w-[620px] text-muted-foreground">
                  Je suis Technicien Ingénieur Informatique de l&apos;Institut Supérieur de Techniques Appliquée ISTA Kinshasa,
                  Licencié en génie électrique, spécialisation en informatique appliquée.
                </p>
                <ul className="mt-8 grid grid-cols-2 gap-3">
                  {["Image de marque et conception", "Marketing numérique", "Développement Web", "Conception de produits"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-6 rounded-[20px] border border-white/10 bg-[#1F1F1F] px-10 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#842ae3]">
                      <Mail className="h-4 w-4 text-[#1e1e1e]" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">E-mail</span>
                      <a href="mailto:contact@wabtechs.com" className="block text-sm text-foreground hover:text-[#842ae3]">contact@wabtechs.com</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#842ae3]">
                      <Phone className="h-4 w-4 text-[#1e1e1e]" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Passer un coup de fil</span>
                      <a href="tel:+243850060060" className="block text-sm text-foreground hover:text-[#842ae3]">+243 850 060 060</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative flex justify-center">
                <div className="flex h-[400px] w-[400px] items-center justify-center rounded-[50%] bg-[#1F1F1F]">
                  <span className="text-7xl font-bold text-primary/20">EM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BgLines />
      </section>

      <section id="resume" className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_2fr]">
            <div>
              <span className="sub-title">Mon CV</span>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Expérience <span className="text-primary">de solutions à des problèmes</span> réels
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {RESUME.map((item) => (
                <div key={item.title} className="resume-item">
                  <div className="icon">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">{item.years}</span>
                    <h4 className="mt-1 font-semibold text-white">{item.title}</h4>
                    <span className="text-sm text-muted-foreground">{item.company}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <BgLines />
      </section>

      <section id="services" className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="sub-title">Services Populaires</span>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Mon <span className="text-primary">service spécial</span> pour le développement de votre entreprise
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
            {SERVICES.map((service) => (
              <div key={service.num} className="service-item">
                <div className="mr-12 text-2xl font-bold text-white">{service.num}</div>
                <div className="flex-1">
                  <h4 className="mb-2 font-semibold text-white">{service.title}</h4>
                  <p className="text-sm text-muted-foreground">{service.desc}</p>
                </div>
                <Link href="/services" className="details-btn">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
        <BgLines />
      </section>

      <section id="skills" className="relative border-t border-white/10">
        <div className="for-bgc-black py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_2fr]">
              <div>
                <span className="sub-title">Mes compétences</span>
                <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
                  Explorons <span className="text-primary">les compétences et l&apos;expérience</span> populaires
                </h2>
                <p className="mb-8 max-w-md text-muted-foreground">
                  Que ce soit dans le domaine de la technologie, du marketing, de la finance, de l&apos;éducation ou de la santé,
                  il existe une multitude de compétences et d&apos;expériences qui sont très appréciées.
                </p>
                <Link href="/about" className="theme-btn">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
                {SKILLS.map((skill) => (
                  <div key={skill.name} className="skill-item">
                    <div className="flex h-16 items-center justify-center text-3xl font-bold text-primary/30">
                      {skill.name[0]}
                    </div>
                    <h5 className="mt-4 font-semibold text-white">{skill.name}</h5>
                    <span className="percent">{skill.percent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <BgLines />
      </section>

      <section id="pricing" className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="sub-title">Tarifs forfaitaires</span>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Des prix <span className="text-primary">incroyables</span> pour vos projets
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {PRICING.map((plan) => (
              <div key={plan.name} className="pricing-item">
                <div className="pricing-header text-center">
                  <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Essayez le forfait de base <span className="text-primary">{plan.save}</span>
                  </p>
                  <span className="mt-4 block text-[48px] font-medium text-primary">{plan.price}</span>
                </div>
                <div className="pricing-details">
                  <p className="mb-6 text-sm font-semibold text-white">{plan.app}</p>
                  <ul className="space-y-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        {f}
                      </li>
                    ))}
                    {plan.disabled.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-foreground/35">
                        <Check className="h-4 w-4" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="theme-btn mt-8 w-full">
                    Choisir le forfait
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <BgLines />
      </section>

      <section id="blog" className="relative border-t border-white/10">
        <div className="for-bgc-black py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <span className="sub-title">News & Blog</span>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Latest News & <span className="text-primary">Blog</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block rounded-xl border border-white/10 bg-[#1F1F1F] transition-all hover:border-[#842ae3]">
                  <div className="p-6">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <h5 className="mb-4 text-lg font-semibold text-white group-hover:text-[#842ae3] transition-colors">
                      {post.title}
                    </h5>
                    <hr className="border-white/10" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      {formatDate(post.date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            {posts.length > 0 && (
              <div className="mt-12 text-center">
                <Link href="/blog" className="theme-btn">
                  View More Posts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
        <BgLines />
      </section>

      <section className="relative border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h6 className="text-lg">
            Je <span className="text-primary">183+ clients internationaux</span> &amp; beaucoup de projets terminés
          </h6>
        </div>
        <BgLines />
      </section>

      <StatsSection />
      <CTASection />
    </>
  );
}
