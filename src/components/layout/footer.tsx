import Link from "next/link";
import { Github, Twitter, Youtube, Linkedin, MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";
import { BgLines } from "@/components/shared/bg-lines";

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
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="bg-gradient-to-r from-[#842ae3] to-[#a855f7] bg-clip-text text-transparent">Wab</span>
              <span className="text-white">Techs</span>
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
            <form className="mt-6 flex max-w-[430px] items-end gap-0 border-b border-white/20 pb-3">
              <Mail className="mb-1 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-white/30"
                required
              />
              <button type="submit" className="rounded-[14px] bg-[#842ae3] px-5 py-2.5 text-xs font-semibold text-[#1e1e1e] transition-colors hover:bg-[#9333ea]">
                S&apos;inscrire <ArrowRight className="ml-1 inline h-3 w-3" />
              </button>
            </form>
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
