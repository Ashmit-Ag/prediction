import { NextRequest, NextResponse } from "next/server";
import { authProxy } from "@/lib/auth-proxy";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  console.log("PROXY RUNNING:", pathname);

  // ✅ Allow login page without auth
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  return authProxy(req);
}

export const config = {
  matcher: [
    "/user/:path*",
    "/admin/:path*",
    "/manager/:path*",
    "/api/admin/:path*",
  ],
};
