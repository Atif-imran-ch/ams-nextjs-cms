import { auth } from "@/auth";
import { isAdminRole } from "@/lib/role";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = [
    "/",
    "/login",
    "/register",
    "/articles",
    "/api/categories",
    "/api/articles",
  ].includes(nextUrl.pathname) ||
  nextUrl.pathname.startsWith("/articles/") ||
  nextUrl.pathname.startsWith("/uploads/");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin") || nextUrl.pathname.startsWith("/api/admin");

  if (isApiAuthRoute) return;

  if (!isLoggedIn && !isPublicRoute) {
    if (nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else {
      return Response.redirect(new URL("/login", nextUrl));
    }
  }

  if (isAdminRoute && !isAdminRole(req.auth?.user?.role as string | undefined)) {
    if (nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    } else {
      return Response.redirect(new URL("/", nextUrl));
    }
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/admin/:path*", "/api/((?!auth|articles).*)"],
};
