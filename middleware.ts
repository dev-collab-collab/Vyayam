import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "vyayam_session";

export function middleware(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE)?.value;
  const { pathname } = req.nextUrl;

  const requiresAuth = pathname === "/dashboard" || pathname.startsWith("/dashboard");
  const isLogin = pathname === "/login" || pathname.startsWith("/auth");
  const isRoot = pathname === "/";

  if (!session && requiresAuth) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (session && (isLogin || isRoot)) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/auth/:path*", "/dashboard/:path*"],
};
