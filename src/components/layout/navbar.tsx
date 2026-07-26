"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Command, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useUIStore } from "@/stores/ui-store";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, toggleCommandPalette } = useUIStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled ? "bg-[#1c1c1c]/95 backdrop-blur-xl shadow-[0_0_30px_0_rgba(87,95,245,0.1)]" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logos/logo.png" alt="WabTechs" width={60} height={60} className="h-[60px] w-auto" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "text-primary"
                  : "text-[#cccccc]",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleCommandPalette} className="hidden md:inline-flex gap-2 text-[#cccccc] hover:text-white hover:bg-white/5">
            <Search className="h-4 w-4" />
            Rechercher
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-[#cccccc]">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </Button>

          <ThemeToggle />

          {session ? (
            <Button asChild className="hidden md:inline-flex bg-primary text-[#1e1e1e] hover:bg-[#9333ea]">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost" size="sm" className="text-[#cccccc] hover:text-white hover:bg-white/5">
                <Link href="/login">
                  <LogIn className="mr-1 h-4 w-4" />
                  Connexion
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-[#1e1e1e] hover:bg-[#9333ea]">
                <Link href="/register">
                  <UserPlus className="mr-1 h-4 w-4" />
                  S&apos;inscrire
                </Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden text-[#cccccc]" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-white/10 bg-[#232323] md:hidden"
          >
            <div className="space-y-1 px-4 pb-4 pt-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-[#cccccc]",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                {session ? (
                  <Button asChild className="w-full bg-primary text-[#1e1e1e] hover:bg-[#9333ea]">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full border-white/10 text-[#cccccc] hover:bg-white/5">
                      <Link href="/login">Connexion</Link>
                    </Button>
                    <Button asChild className="w-full bg-primary text-[#1e1e1e] hover:bg-[#9333ea]">
                      <Link href="/register">S&apos;inscrire</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
