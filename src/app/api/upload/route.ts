import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { safeHandler } from "@/lib/safe-handler";
import { requireAdmin } from "@/lib/auth-guard";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { sanitizeFilename, validateUpload } from "@/lib/upload";

export const POST = safeHandler(async (req: Request) => {
  await requireAdmin();
  rateLimit(`upload:${getClientIp(req)}`, { windowMs: 60_000, max: 30 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
  }

  const validationError = validateUpload(file);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public/uploads");
  await mkdir(uploadDir, { recursive: true });

  const uniqueName = `${Date.now()}-${sanitizeFilename(file.name)}`;
  const filePath = path.join(uploadDir, uniqueName);
  await writeFile(filePath, buffer);

  const url = `/uploads/${uniqueName}`;

  return NextResponse.json({ url, name: file.name, size: file.size });
});
