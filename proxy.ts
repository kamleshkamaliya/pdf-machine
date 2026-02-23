import { NextResponse } from "next/server";

export function proxy(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Allow non-admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Allow login page always
  if (pathname === "/admin/login") return NextResponse.next();

  // Cookie check (simple protection)
  const cookieHeader = req.headers.get("cookie") || "";
  const hasToken = cookieHeader.includes("admin_token=");

  if (!hasToken) {
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
