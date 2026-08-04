import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { MobileCertificateRepository } from "@/modules/mobile-builder/database/repository";

const repo = new MobileCertificateRepository();

export const GET = safeHandler(async () => {
  await requireAdmin();
  const certs = await repo.getAll();
  return NextResponse.json(certs);
});

export const POST = safeHandler(async (req: Request) => {
  const user = await requireAdmin();
  const body = await req.json();
  const { appId, provider, name, encryptedSecret, expiresAt } = body as {
    appId: string;
    provider: string;
    name: string;
    encryptedSecret: string;
    expiresAt?: string;
  };

  const cert = await repo.create({
    appId,
    provider,
    name,
    encryptedSecret,
    expiresAt: expiresAt ? new Date(expiresAt) : undefined,
  });
  await createAuditLog({
    action: "CERTIFICATE_UPDATED",
    entity: "MobileCertificate",
    entityId: cert.id,
    userId: user.id as string,
    details: JSON.stringify({ appId, provider, name }),
  });

  return NextResponse.json(cert, { status: 201 });
});

export const DELETE = safeHandler(async (req: Request) => {
  await requireAdmin();
  const { id } = await req.json();
  await repo.delete(id);
  return NextResponse.json({ success: true });
});
