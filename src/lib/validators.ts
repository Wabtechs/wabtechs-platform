import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères.").max(100),
  email: z.string().email("Veuillez saisir une adresse e-mail valide."),
  subject: z.string().min(3, "Le sujet doit contenir au moins 3 caractères.").max(200),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères.").max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Veuillez saisir une adresse e-mail valide."),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
