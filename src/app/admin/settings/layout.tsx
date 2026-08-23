"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  Palette,
  Bell,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const NAV_ITEMS = [
  { href: "/admin/settings/profile", label: "Profil", icon: User },
  { href: "/admin/settings/account", label: "Compte", icon: Settings },
  { href: "/admin/settings/appearance", label: "Apparence", icon: Palette },
  { href: "/admin/settings/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/settings/display", label: "Affichage", icon: Monitor },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.05 } },
        }}
      >
        <motion.div variants={fadeUp} className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
            Paramètres
          </h1>
          <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
            Gérez vos préférences et paramètres de compte.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          {/* Mobile: horizontal scroll tabs */}
          <div className="flex flex-row gap-1 overflow-x-auto lg:hidden">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 whitespace-nowrap",
                    active
                      ? "bg-primary/[0.08] text-primary dark:bg-primary/[0.12]"
                      : "text-gray-500 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-accent/[0.04] dark:hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop: vertical sidebar */}
          <div className="hidden lg:flex lg:flex-col">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
                      active
                        ? "bg-primary/[0.08] text-primary dark:bg-primary/[0.12]"
                        : "text-gray-500 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-accent/[0.04] dark:hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Separator className="mt-4" />
          </div>

          {/* Content */}
          <div>{children}</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
