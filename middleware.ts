import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "vyayam_session";

export async function middleware(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE)?.value;
  const { pathname } = req.nextUrl;

  const requiresAuth = pathname === "/dashboard" || pathname.startsWith("/dashboard");
  const isLogin = pathname === "/login" || pathname.startsWith("/auth");
  const isRoot = pathname === "/";
  const isProfileCreate = pathname === "/profile/create";

  // Not authenticated and trying to access protected route
  if (!session && requiresAuth) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Authenticated users accessing dashboard need profile check
  if (session && requiresAuth) {
    try {
      const profileRes = await fetch(new URL("/api/profile", req.url), {
        headers: { Cookie: `${SESSION_COOKIE}=${session}` },
      });
      
      if (profileRes.status === 404) {
        const data = await profileRes.json();
        if (data.profileExists === false) {
          const url = req.nextUrl.clone();
          url.pathname = "/profile/create";
          return NextResponse.redirect(url);
        }
      }
    } catch (err) {
      // If profile check fails, allow through (fallback behavior)
      console.error("Profile check failed:", err);
    }
  }

  // Authenticated users on login or root should go to dashboard
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
