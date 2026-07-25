"use client";

import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validators";
import { BgLines } from "@/components/shared/bg-lines";
import Link from "next/link";

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(_data: ContactInput) {
    await new Promise((r) => setTimeout(r, 1000));
    reset();
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_2fr]">
          <div>
            <span className="sub-title">Entrez en contact</span>
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
              Parlons de vos <span className="text-[#842ae3]">prochains projets</span>
            </h2>
            <p className="mb-8 max-w-md text-muted-foreground">
              Que ce soit pour un projet personnel ou professionnel, c&apos;est l&apos;occasion de partager
              vos idées, vos ambitions et de définir les étapes nécessaires pour les réaliser.
              N&apos;hésitez pas à partager plus de détails sur vos projets !
            </p>
            <ul className="space-y-3">
              {["Plus de 4 années d'expérience", "Concepteur Web professionnel", "Conception d'applications mobiles", "Support de conception personnalisée"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#842ae3]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-6">
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
                  <span className="text-xs text-muted-foreground">Téléphone</span>
                  <a href="tel:+243850060060" className="block text-sm text-foreground hover:text-[#842ae3]">+243 850 060 060</a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-white/10 bg-[#1F1F1F] p-8 sm:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-medium text-white">Nom complet</label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="form-control w-full"
                    {...register("name")}
                  />
                  {errors.name && <p className="mt-1 text-xs text-[#ef4444]">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-white">Adresse e-mail</label>
                  <input
                    type="email"
                    placeholder="contact@wabtechs.com"
                    className="form-control w-full"
                    {...register("email")}
                  />
                  {errors.email && <p className="mt-1 text-xs text-[#ef4444]">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-white">Sujet</label>
                <input
                  type="text"
                  placeholder="Sujet"
                  className="form-control w-full"
                  {...register("subject")}
                />
                {errors.subject && <p className="mt-1 text-xs text-[#ef4444]">{errors.subject.message}</p>}
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-white">Message</label>
                <textarea
                  placeholder="Votre message"
                  rows={5}
                  className="form-control w-full resize-none"
                  {...register("message")}
                />
                {errors.message && <p className="mt-1 text-xs text-[#ef4444]">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="theme-btn">
                {isSubmitting ? "Envoi en cours..." : "Envoie-nous un message"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
