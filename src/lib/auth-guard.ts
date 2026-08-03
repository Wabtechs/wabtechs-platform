import { auth } from "@/auth";
import { AppError, ErrorCode } from "@/lib/errors";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    throw new AppError("Non autorisé", 401, ErrorCode.UNAUTHORIZED);
  }
  return session.user;
}
