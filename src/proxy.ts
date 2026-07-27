import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_ROUTES = ["/admin", "/dashboard"];

function isProtectedRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

function hasSessionCookie(request: NextRequest): boolean {
  const cookies = request.cookies;
  return (
    cookies.has("authjs.session-token") ||
    cookies.has("__Secure-authjs.session-token") ||
    cookies.has("next-auth.session-token") ||
    cookies.has("__Secure-next-auth.session-token")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  if (hasSessionCookie(request)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
