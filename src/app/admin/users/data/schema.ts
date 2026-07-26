import { z } from "zod";

export const userRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN", "MODERATOR"]),
});

export const userFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100).optional(),
  email: z.string().email("Adresse email invalide"),
  role: z.enum(["USER", "ADMIN", "MODERATOR"]),
});

export const deleteUserSchema = z.object({
  id: z.string().min(1),
});

export type UserRole = z.infer<typeof userRoleSchema>["role"];
export type UserFormData = z.infer<typeof userFormSchema>;
