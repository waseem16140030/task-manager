import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/auth", "/auth/signin", "/auth/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const role = token?.role;
  const isAuthenticated = !!token;
  const isLoginRoute = pathname === "/auth/signin";
  const isPublicRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect to home if already logged in but visiting login page
  if (isAuthenticated && isLoginRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Block "/" for users with role === "user"
  if (pathname === "/" && role === "user") {
    return NextResponse.redirect(new URL("/tasks-management", request.url));
  }

  // Allow public/auth routes
  if (isPublicRoute) {
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
