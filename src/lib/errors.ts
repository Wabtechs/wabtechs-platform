export enum ErrorCode {
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  VALIDATION = "VALIDATION",
  TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",
  INTERNAL = "INTERNAL",
}

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number,
    public readonly code: ErrorCode = ErrorCode.INTERNAL,
    public readonly headers?: Record<string, string>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
