import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Youtube, Linkedin, MapPin, Mail, Phone } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";
import { BgLines } from "@/components/shared/bg-lines";
import { NewsletterForm } from "@/components/shared/newsletter-form";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
};

const quickLinks = [
  { label: "Service", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#1e1e1e]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logos/logo.png" alt="Wabtechs" width={60} height={60} className="h-[60px] w-auto" />
            </Link>
          </div>

          <div>
            <h6 className="mb-7 text-sm font-semibold text-white">Quick Link</h6>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 max-w-[430px]">
              <NewsletterForm />
            </div>
          </div>

          <div>
            <h6 className="mb-7 text-sm font-semibold text-white">Adresse</h6>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                n° 27 bis Katakombe 2 Ngalima Kinshasa RDC
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:contact@wabtechs.com" className="hover:text-white">contact@wabtechs.com</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+243850060060" className="hover:text-white">+243 850 060 060</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-white">
            Copyright ©{new Date().getFullYear()}, <Link href="/" className="text-primary">Wabtechs Company</Link> All Rights Reserved
          </p>
          <div className="flex items-center gap-5">
            {SOCIAL_LINKS.map((social) => {
              const Icon = iconMap[social.icon];
              return Icon ? (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{social.label}</span>
                </a>
              ) : null;
            })}
          </div>
        </div>
      </div>
      <BgLines />
    </footer>
  );
}
