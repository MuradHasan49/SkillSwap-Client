import { NextResponse } from "next/server";

export default function proxy(request) {
  const { pathname } = request.nextUrl;

  // Only redirect bare /dashboard → let server components handle auth
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    // We can't know role here without a session fetch (which causes slowdowns)
    // So redirect to a page.jsx that reads role server-side
    return NextResponse.redirect(new URL("/dashboard/redirect", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};