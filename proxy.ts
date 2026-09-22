import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_HOSTS = new Set(["admin.tryaceley.com", "admin.localhost:3000", "admin.localhost:3001"]);

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";

  if (!ADMIN_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  if (url.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  url.pathname = url.pathname === "/" ? "/admin" : `/admin${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
