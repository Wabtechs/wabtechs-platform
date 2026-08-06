import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { AppError, ErrorCode, isAppError } from "@/lib/errors";
import { generateCertificateNumber, generateCertificatePdf } from "@/lib/certificate";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new AppError("Authentification requise", 401, ErrorCode.UNAUTHORIZED);
    }

    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");
    if (!courseId) {
      throw new AppError("Paramètre courseId manquant", 400, ErrorCode.BAD_REQUEST);
    }

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new AppError("Cours introuvable", 404, ErrorCode.NOT_FOUND);
    }

    const userId = session.user.id as string;

    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) {
      throw new AppError("Inscription au cours requise", 403, ErrorCode.FORBIDDEN);
    }
    if (!enrollment.completed) {
      throw new AppError("Cours non terminé", 403, ErrorCode.FORBIDDEN);
    }

    const certificate = await db.certificate.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, number: generateCertificateNumber() },
      update: {},
    });

    const pdf = await generateCertificatePdf({
      name: session.user.name ?? session.user.email ?? "Étudiant",
      courseTitle: course.title,
      number: certificate.number,
      date: new Date(certificate.issuedAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    });

    return new Response(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificat-${course.slug}.pdf"`,
      },
    });
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status, headers: error.headers },
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
