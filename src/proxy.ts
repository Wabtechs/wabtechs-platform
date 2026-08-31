import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_ROUTES = ["/admin"];

function isProtectedRoute(pathname: string): boolean {
	return ADMIN_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (!isProtectedRoute(pathname)) {
		return NextResponse.next();
	}

	try {
		const { auth } = await import("@/auth");
		const session = await auth();

		if (session?.user) {
			return NextResponse.next();
		}
	} catch (error) {
		console.error("[proxy] Erreur lors de la vérification de session:", error);
	}

	const loginUrl = new URL("/login", request.url);
	loginUrl.searchParams.set("callbackUrl", pathname);
	return NextResponse.redirect(loginUrl);
}

export default proxy;

export const config = {
	matcher: ["/admin/:path*"],
};
