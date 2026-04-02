import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const isFleet = host.startsWith("fleet.");

  if (isFleet) {
    const url = request.nextUrl.clone();
    if (url.pathname === "/") {
      url.pathname = "/fleet";
    } else if (
      url.pathname.startsWith("/dealer") ||
      url.pathname.startsWith("/api") ||
      url.pathname.startsWith("/_next") ||
      url.pathname.startsWith("/fleet")
    ) {
      return NextResponse.next();
    } else {
      url.pathname = "/fleet" + url.pathname;
    }
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
