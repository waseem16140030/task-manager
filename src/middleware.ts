import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/auth", "/auth/signin", "/auth/signup"];
const PUBLIC_ROUTES = ["/about", "/privacy"];
const RESET_ROUTES = ["/auth/reset-password", "/auth/reset-password/success"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const isLoginRoute = pathname === "/auth/signin";
  const isPublicRoute =
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect to home if already logged in but visiting login page
  if (isAuthenticated && isLoginRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow public/auth routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Allow reset-password routes without auth
  if (RESET_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Default: allow request
  const response = NextResponse.next();
  response.headers.delete("X-Powered-By");
  response.headers.delete("Server");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|api/auth).*)"],
};
