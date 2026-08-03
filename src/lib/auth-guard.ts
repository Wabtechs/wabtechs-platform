import { auth } from "@/auth";
import { AppError, ErrorCode } from "@/lib/errors";

export type Role = "ADMIN" | "MODERATOR" | "USER";

export async function requireRole(...roles: Role[]) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || !role || !roles.includes(role as Role)) {
    throw new AppError("Non autorisé", 401, ErrorCode.UNAUTHORIZED);
  }
  return session.user;
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}

export async function requireModerator() {
  return requireRole("ADMIN", "MODERATOR");
}
