import Link from "next/link";
import { Github, Twitter, Youtube, Linkedin, Heart } from "lucide-react";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { SITE_CONFIG } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold capitalize">{category === "plateforme" ? "Plateforme" : category === "resources" ? "Ressources" : category === "company" ? "Entreprise" : "Légal"}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => {
              const Icon = iconMap[social.icon];
              return Icon ? (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{social.label}</span>
                </a>
              ) : null;
            })}
          </div>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          Fait avec <Heart className="h-3 w-3 fill-red-500 text-red-500" /> par {SITE_CONFIG.author}
        </p>
      </div>
    </footer>
  );
}
