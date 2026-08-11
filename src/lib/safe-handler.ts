import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ErrorCode, isAppError } from "@/lib/errors";
import { getHttpStatusMessage, isTechnicalError, Messages } from "@/lib/messages";

export type Handler<Ctx = undefined> = (req: Request, ctx: Ctx) => Promise<Response | NextResponse>;

export type SafeHandler<Ctx> = Ctx extends undefined
  ? (req: Request) => Promise<Response | NextResponse>
  : (req: Request, ctx: Ctx) => Promise<Response | NextResponse>;

function logTechnicalError(error: unknown, code: string) {
  console.error(`[${code}]`, error, {
    timestamp: new Date().toISOString(),
  });
}

interface PrismaRequestError {
  code?: string;
}

const PRISMA_ERROR_MAP: Record<string, { message: string; status: number; code: ErrorCode }> = {
  P2002: { message: "Cette ressource existe déjà.", status: 409, code: ErrorCode.CONFLICT },
  P2003: {
    message: "La référence fournie est invalide.",
    status: 400,
    code: ErrorCode.BAD_REQUEST,
  },
  P2023: {
    message: "L’identifiant fourni est invalide.",
    status: 400,
    code: ErrorCode.BAD_REQUEST,
  },
  P2025: {
    message: "La ressource demandée est introuvable.",
    status: 404,
    code: ErrorCode.NOT_FOUND,
  },
};

function toPrismaError(
  error: unknown,
): { message: string; status: number; code: ErrorCode } | null {
  if (typeof error !== "object" || error === null || !("code" in error)) return null;
  const code = (error as PrismaRequestError).code;
  if (!code) return null;
  const mapped = PRISMA_ERROR_MAP[code];
  if (!mapped) return null;
  return { message: mapped.message, status: mapped.status, code: mapped.code };
}

function isJsonParseError(error: unknown): boolean {
  return (
    (error instanceof SyntaxError && /JSON|Unexpected (token|end)/i.test(error.message)) ||
    (error instanceof TypeError && /body|JSON/i.test(error.message))
  );
}

function toZodMessage(error: ZodError): string {
  const first = error.issues[0];
  if (!first) return "Les données envoyées sont invalides.";
  const path = first.path.length > 0 ? first.path.join(".") : null;
  return path ? `${path} : ${first.message}` : first.message;
}

export function toErrorResponse(error: unknown): NextResponse {
  if (isAppError(error)) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[${error.code}]`, error.message, {
        timestamp: new Date().toISOString(),
      });
    }

    const userMessage = isTechnicalError(error.message)
      ? getHttpStatusMessage(error.status)
      : error.message;

    return NextResponse.json(
      { success: false, error: userMessage, code: error.code },
      { status: error.status, headers: error.headers },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: toZodMessage(error),
        code: ErrorCode.VALIDATION,
      },
      { status: 400 },
    );
  }

  if (isJsonParseError(error)) {
    return NextResponse.json(
      { success: false, error: "Le corps JSON envoyé est invalide.", code: ErrorCode.BAD_REQUEST },
      { status: 400 },
    );
  }

  const prismaError = toPrismaError(error);
  if (prismaError) {
    return NextResponse.json(
      { success: false, error: prismaError.message, code: prismaError.code },
      { status: prismaError.status },
    );
  }

  logTechnicalError(error, ErrorCode.INTERNAL);
  return NextResponse.json(
    { success: false, error: Messages.errors.internal, code: ErrorCode.INTERNAL },
    { status: 500 },
  );
}

export function safeHandler<Ctx = undefined>(handler: Handler<Ctx>): SafeHandler<Ctx> {
  const wrapped = async (req: Request, ctx?: Ctx) => {
    try {
      return await handler(req, ctx as Ctx);
    } catch (error) {
      return toErrorResponse(error);
    }
  };
  return wrapped as SafeHandler<Ctx>;
}
