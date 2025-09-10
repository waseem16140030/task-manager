import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const AUTH_ROUTES = ["/auth", "/auth/signin", "/auth/signup"];
const isPublicRoute = (pathname: string): boolean =>
  AUTH_ROUTES.some((route) => pathname.startsWith(route));

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value ?? "";
  const payload = token ? jwtDecode<TokenPayload>(token) : null;
  const isAuthenticated = !!token;
  const isLoginRoute = pathname === "/auth/signin";

  if (isAuthenticated && isLoginRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const allowedRoutes = [
      "/auth/reset-password",
      "/auth/reset-password/success",
    ];
    if (allowedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const res = NextResponse.next();
  res.headers.delete("X-Powered-By");
  res.headers.delete("Server");
  return res;
}


export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)",
  ],
};
