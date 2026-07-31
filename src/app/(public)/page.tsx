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
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { db } from "@/lib/prisma";

export default async function HomePage() {
  const [services, skills, resumeItems, pricingPlans, testimonials, clients, dbPosts] = await Promise.all([
    db.service.findMany({ orderBy: { order: "asc" } }),
    db.skill.findMany({ orderBy: { order: "asc" } }),
    db.resumeItem.findMany({ orderBy: { order: "asc" } }),
    db.pricingPlan.findMany({ orderBy: { order: "asc" } }),
    db.testimonial.findMany({ orderBy: { order: "asc" } }),
    db.client.findMany({ orderBy: { order: "asc" } }),
    db.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 2,
      where: { published: true },
      select: {
        slug: true,
        title: true,
        createdAt: true,
        publishedAt: true,
        coverImage: true,
        tags: { select: { name: true } },
      },
    }),
  ]);

  const posts = dbPosts.map(p => ({
    slug: p.slug,
    title: p.title,
    date: p.publishedAt ?? p.createdAt,
    tags: p.tags.map(t => t.name),
    coverImage: p.coverImage,
  }));

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
              {resumeItems.map((item, i) => (
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
            {services.map((service, i) => (
              <AnimateOnScroll key={service.num} delay={i * 0.05}>
                <div className="service-item">
                  <div className="mr-12 text-2xl font-bold text-white">{service.num}</div>
                  <div className="flex-1">
                    <h4 className="mb-2 font-semibold text-white">{service.title}</h4>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
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
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </AnimateOnScroll>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
                {skills.map((skill, i) => (
                  <AnimateOnScroll key={skill.name} delay={i * 0.08}>
                    <div className="skill-item">
                      <div className="flex h-16 items-center justify-center">
                        <Image
                          src={skill.image ?? "/images/skills/skill1.png"}
                          alt={skill.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 object-contain"
                        />
                      </div>
                      <h5 className="mt-4 font-semibold text-white">{skill.name}</h5>
                      <span className="percent">{skill.percent}%</span>
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
            {pricingPlans.map((plan, i) => (
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
              {testimonials.map((t, i) => (
                <AnimateOnScroll key={t.name} delay={i * 0.15}>
                  <div className="rounded-[14px] border border-white/10 bg-[#1F1F1F] p-8 transition-all hover:border-primary/30">
                    <Quote className="mb-4 h-8 w-8 text-primary/30" />
                    <p className="mb-6 leading-relaxed text-muted-foreground">{t.text}</p>
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full">
                        <Image src={t.image ?? "/images/testimonials/author1.png"} alt={t.name} fill className="object-cover" />
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
                Dernières <span className="text-primary">Actualités & Articles</span>
              </h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {posts.map((post, i) => (
              <AnimateOnScroll key={post.slug} delay={i * 0.1}>
                <Link href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-xl border border-white/10 bg-[#1F1F1F] transition-all hover:border-primary">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.coverImage ?? "/images/blog/blog1.png"}
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
                Voir plus d&apos;articles
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
              <span className="text-primary">{clients.length}+ clients internationaux</span> &amp; beaucoup de projets terminés
            </h6>
          </AnimateOnScroll>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {clients.map((client, i) => (
              <AnimateOnScroll key={client.id} delay={i * 0.05}>
                <div className="relative h-10 w-24 opacity-50 grayscale transition-all hover:scale-110 hover:opacity-100 hover:grayscale-0">
                  {client.logo && (
                    <Image src={client.logo} alt={client.name} fill className="object-contain" />
                  )}
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
