import { NextResponse } from "next/server";
import { ErrorCode, isAppError } from "@/lib/errors";

export type Handler = (req: Request) => Promise<Response | NextResponse>;

export function safeHandler(handler: Handler) {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error) {
      if (isAppError(error)) {
        if (process.env.NODE_ENV !== "production") {
          console.error(`[${error.code}] ${error.message}`);
        }
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.status, headers: error.headers },
        );
      }

      console.error("[INTERNAL]", error);
      return NextResponse.json(
        { error: "Erreur serveur", code: ErrorCode.INTERNAL },
        { status: 500 },
      );
    }
  };
}
