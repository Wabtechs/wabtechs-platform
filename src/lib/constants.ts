export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/blog", label: "Blog" },
  { href: "/docs", label: "Documentation" },
  { href: "/projects", label: "Projets" },
  { href: "/podcast", label: "Podcast" },
  { href: "/videos", label: "Vidéos" },
  { href: "/academy", label: "Academy" },
  { href: "/community", label: "Communauté" },
] as const;

export const FOOTER_LINKS = {
  plateforme: [
    { href: "/blog", label: "Blog" },
    { href: "/docs", label: "Documentation" },
    { href: "/projects", label: "Projets" },
    { href: "/podcast", label: "Podcast" },
    { href: "/videos", label: "Vidéos" },
    { href: "/tutorials", label: "Tutoriels" },
    { href: "/academy", label: "Academy" },
  ],
  resources: [
    { href: "/snippets", label: "Snippets" },
    { href: "/resources", label: "Ressources" },
    { href: "/downloads", label: "Téléchargements" },
    { href: "/roadmaps", label: "Roadmaps" },
    { href: "/events", label: "Événements" },
    { href: "/open-source", label: "Open Source" },
  ],
  company: [
    { href: "/about", label: "À propos" },
    { href: "/contact", label: "Contact" },
    { href: "/support", label: "Support" },
    { href: "/pricing", label: "Tarifs" },
    { href: "/sponsors", label: "Sponsors" },
    { href: "/faq", label: "FAQ" },
    { href: "/newsletter", label: "Newsletter" },
    { href: "/changelog", label: "Changelog" },
  ],
  legal: [
    { href: "/privacy", label: "Politique de confidentialité" },
    { href: "/terms", label: "Conditions d'utilisation" },
  ],
} as const;

export const SOCIAL_LINKS = [
  { href: "https://github.com/wabtechs", label: "GitHub", icon: "github" },
  { href: "https://twitter.com/wabtechs", label: "Twitter", icon: "twitter" },
  { href: "https://youtube.com/@wabtechs", label: "YouTube", icon: "youtube" },
  { href: "https://linkedin.com/in/wabtechs", label: "LinkedIn", icon: "linkedin" },
] as const;
