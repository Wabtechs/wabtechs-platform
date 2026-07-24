import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Adresse email invalide"),
  subject: z.string().min(3, "Le sujet doit contenir au moins 3 caractères").max(200),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const commentSchema = z.object({
  content: z.string().min(1, "Le commentaire ne peut pas être vide").max(2000),
  parentId: z.string().uuid().optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;

export const searchSchema = z.object({
  q: z.string().min(1).max(200),
  type: z.enum(["all", "blog", "docs", "projects"]).default("all"),
});

export type SearchInput = z.infer<typeof searchSchema>;
