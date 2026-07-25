"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema, type NewsletterInput } from "@/lib/validators";
import { Mail, Loader2 } from "lucide-react";

export function NewsletterForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
  });

  async function onSubmit(data: NewsletterInput) {
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <div className="flex-1">
        <input
          type="email"
          placeholder="votre@email.com"
          className="form-control w-full"
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-[#ef4444]">{errors.email.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="theme-btn">
        {isSubmitting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Mail className="mr-1 h-4 w-4" />}
        S&apos;inscrire
      </button>
    </form>
  );
}
