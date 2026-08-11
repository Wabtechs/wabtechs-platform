import { auth } from "@/auth";
import { AppError, ErrorCode } from "@/lib/errors";
import { Messages } from "@/lib/messages";

export type Role = "ADMIN" | "MODERATOR" | "USER";

export async function requireRole(...roles: Role[]) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user) {
    throw new AppError(Messages.errors.unauthorized, 401, ErrorCode.UNAUTHORIZED);
  }

  if (!role || !roles.includes(role as Role)) {
    throw new AppError(Messages.errors.forbidden, 403, ErrorCode.FORBIDDEN);
  }

  return session.user;
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}

export async function requireModerator() {
  return requireRole("ADMIN", "MODERATOR");
}
