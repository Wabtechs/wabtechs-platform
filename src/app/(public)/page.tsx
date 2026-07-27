import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Mail,
  Phone,
  Check,
  Quote,
} from "lucide-react";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { CTASection } from "@/components/home/cta-section";
import { BgLines } from "@/components/shared/bg-lines";
import { getAllPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";

const SERVICES = [
  { num: "01.", title: "Conception d'identité de marque", desc: "L'identité de marque est l'essence d'une entreprise. Elle englobe les valeurs, la mission et la présentation de l'entreprise au monde. Une identité de marque forte crée une connexion émotionnelle avec les clients." },
  { num: "02.", title: "Conception de sites Web", desc: "La conception de sites Web est un processus créatif qui implique la planification, la création et la mise en page d'un site Web. Le but est de créer un site attrayant et facile à utiliser." },
  { num: "03.", title: "Conception d'applications mobiles", desc: "La conception d'applications mobiles implique la création d'une interface utilisateur attrayante et fonctionnelle pour une application mobile. Cela comprend la conception de l'interface utilisateur et l'expérience utilisateur globale." },
  { num: "04.", title: "Conception graphique animée", desc: "La conception graphique animée, ou motion design, est une forme d'art visuel qui utilise le mouvement comme principal outil graphique et artistique." },
  { num: "05.", title: "Développement de sites Web", desc: "Le développement Web est le processus technique qui permet à un site Web de fonctionner. Il comprend le codage du site Web et l'intégration des fonctionnalités nécessaires." },
  { num: "06.", title: "Référencement et marketing numérique", desc: "Le référencement et le marketing numérique sont essentiels pour augmenter la visibilité en ligne d'une entreprise. Cela comprend l'optimisation du site Web pour les moteurs de recherche et la création de contenu pertinent." },
];

const SKILLS = [
  { name: "Figma", percent: "95%", img: "/images/skills/skill1.png" },
  { name: "Framer", percent: "83%", img: "/images/skills/skill2.png" },
  { name: "Photoshop", percent: "93%", img: "/images/skills/skill3.png" },
  { name: "WordPress", percent: "84%", img: "/images/skills/skill4.png" },
  { name: "Angular", percent: "65%", img: "/images/skills/skill5.png" },
  { name: "Webflow", percent: "86%", img: "/images/skills/skill6.png" },
  { name: "Python", percent: "62%", img: "/images/skills/skill7.png" },
  { name: "Sketch", percent: "94%", img: "/images/skills/skill8.png" },
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

const TESTIMONIALS = [
  { name: "Client Happy", role: "CEO, TechStart", text: "Excellent travail ! Emmanuel a transformé notre vision en une réalité numérique impressionnante. Son expertise technique et créative est remarquable.", img: "/images/testimonials/author1.png" },
  { name: "Marie Dupont", role: "Directrice Marketing, InnovateCo", text: "Une collaboration extraordinaire. La qualité du code, le respect des délais et la communicationwere were parfait tout au long du projet.", img: "/images/testimonials/author2.png" },
];

const BLOG_IMAGES = ["/images/blog/blog1.png", "/images/blog/blog2.png"];

const CLIENT_LOGOS = Array.from({ length: 8 }, (_, i) => `/images/client-logos/client-logo${i + 1}.png`);

export default function HomePage() {
  const posts = getAllPosts().slice(0, 2);

  return (
    <>
      <HeroSection />

      <section id="about" className="relative border-t border-white/10">
        <div className="for-bgc-black py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <AnimateOnScroll>
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                        <Mail className="h-4 w-4 text-[#1e1e1e]" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">E-mail</span>
                        <a href="mailto:contact@wabtechs.com" className="block text-sm text-foreground hover:text-primary">contact@wabtechs.com</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                        <Phone className="h-4 w-4 text-[#1e1e1e]" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Passer un coup de fil</span>
                        <a href="tel:+243850060060" className="block text-sm text-foreground hover:text-primary">+243 850 060 060</a>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={0.2}>
                <div className="relative flex justify-center">
                  <div className="about-image-part relative">
                    <div className="relative z-10 w-full max-w-[500px] overflow-hidden rounded-[20px]">
                      <Image
                        src="/images/about/Emmanuel Mulonda Johannes.jpg"
                        alt="Emmanuel Mulonda Johannes"
                        width={676}
                        height={500}
                        className="w-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 z-20">
                      <Image
                        src="/images/about/viraza.png"
                        alt="Viraza"
                        width={50}
                        height={50}
                        className="h-[50px] w-[50px]"
                      />
                    </div>
                    <Image
                      src="/images/shape/about-dot.png"
                      alt=""
                      width={120}
                      height={120}
                      className="dot-shape absolute -left-8 -top-8 z-0 opacity-50"
                    />
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
        <BgLines />
      </section>

      <section id="resume" className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_2fr]">
            <AnimateOnScroll>
              <div>
                <span className="sub-title">Mon CV</span>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Expérience <span className="text-primary">de solutions à des problèmes</span> réels
                </h2>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {RESUME.map((item, i) => (
                <AnimateOnScroll key={item.title} delay={i * 0.1}>
                  <div className="resume-item">
                    <div className="icon">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{item.years}</span>
                      <h4 className="mt-1 font-semibold text-white">{item.title}</h4>
                      <span className="text-sm text-muted-foreground">{item.company}</span>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
        <BgLines />
      </section>

      <section id="services" className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="mb-16 text-center">
              <span className="sub-title">Services Populaires</span>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Mon <span className="text-primary">service spécial</span> pour le développement de votre entreprise
              </h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
            {SERVICES.map((service, i) => (
              <AnimateOnScroll key={service.num} delay={i * 0.05}>
                <div className="service-item">
                  <div className="mr-12 text-2xl font-bold text-white">{service.num}</div>
                  <div className="flex-1">
                    <h4 className="mb-2 font-semibold text-white">{service.title}</h4>
                    <p className="text-sm text-muted-foreground">{service.desc}</p>
                  </div>
                  <Link href="/services" className="details-btn">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
        <BgLines />
      </section>

      <section id="skills" className="relative border-t border-white/10">
        <div className="for-bgc-black py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_2fr]">
              <AnimateOnScroll>
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
              </AnimateOnScroll>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
                {SKILLS.map((skill, i) => (
                  <AnimateOnScroll key={skill.name} delay={i * 0.08}>
                    <div className="skill-item">
                      <div className="flex h-16 items-center justify-center">
                        <Image
                          src={skill.img}
                          alt={skill.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 object-contain"
                        />
                      </div>
                      <h5 className="mt-4 font-semibold text-white">{skill.name}</h5>
                      <span className="percent">{skill.percent}</span>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </div>
        </div>
        <BgLines />
      </section>

      <section id="pricing" className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="mb-16 text-center">
              <span className="sub-title">Tarifs forfaitaires</span>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Des prix <span className="text-primary">incroyables</span> pour vos projets
              </h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {PRICING.map((plan, i) => (
              <AnimateOnScroll key={plan.name} delay={i * 0.1}>
                <div className="pricing-item">
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
              </AnimateOnScroll>
            ))}
          </div>
        </div>
        <BgLines />
      </section>

      <section id="testimonials" className="relative border-t border-white/10">
        <div className="for-bgc-black py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll>
              <div className="mb-16 text-center">
                <span className="sub-title">Témoignages</span>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Ce que disent <span className="text-primary">mes clients</span>
                </h2>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {TESTIMONIALS.map((t, i) => (
                <AnimateOnScroll key={t.name} delay={i * 0.15}>
                  <div className="rounded-[14px] border border-white/10 bg-[#1F1F1F] p-8 transition-all hover:border-primary/30">
                    <Quote className="mb-4 h-8 w-8 text-primary/30" />
                    <p className="mb-6 leading-relaxed text-muted-foreground">{t.text}</p>
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full">
                        <Image src={t.img} alt={t.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-white">{t.name}</h5>
                        <span className="text-sm text-muted-foreground">{t.role}</span>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
        <BgLines />
      </section>

      <section id="blog" className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="mb-16 text-center">
              <span className="sub-title">News & Blog</span>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Latest News & <span className="text-primary">Blog</span>
              </h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {posts.map((post, i) => (
              <AnimateOnScroll key={post.slug} delay={i * 0.1}>
                <Link href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-xl border border-white/10 bg-[#1F1F1F] transition-all hover:border-primary">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={BLOG_IMAGES[i % BLOG_IMAGES.length]!}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <h5 className="mb-4 text-lg font-semibold text-white group-hover:text-primary transition-colors">
                      {post.title}
                    </h5>
                    <hr className="border-white/10" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      {formatDate(post.date)}
                    </p>
                  </div>
                </Link>
              </AnimateOnScroll>
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
        <BgLines />
      </section>

      <section className="relative border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <h6 className="mb-12 text-center text-lg">
              Je <span className="text-primary">183+ clients internationaux</span> &amp; beaucoup de projets terminés
            </h6>
          </AnimateOnScroll>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {CLIENT_LOGOS.map((logo, i) => (
              <AnimateOnScroll key={logo} delay={i * 0.05}>
                <div className="relative h-10 w-24 opacity-50 grayscale transition-all hover:scale-110 hover:opacity-100 hover:grayscale-0">
                  <Image src={logo} alt={`Client ${i + 1}`} fill className="object-contain" />
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
        <BgLines />
      </section>

      <StatsSection />
      <CTASection />
    </>
  );
}
