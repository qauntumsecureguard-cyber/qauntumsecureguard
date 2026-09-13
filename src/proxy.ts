import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "./lib/auth";


export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/register")
    ) {
      return NextResponse.next();
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.redirect(
        new URL(`/login?redirectUrl=${pathname}`, request.url)
      );
    }


    if (pathname.startsWith("/admin")) {
      if (session.user.role !== "admin") {
        return NextResponse.redirect(
          new URL("/dashboard", request.url)
        );
      }
    }

    return NextResponse.next();

  } catch (err) {
    console.error("proxy error:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/buy/:path*",
    "/settings/:path*",
    "/notifications",
    "/benefits",
    "/grants/:path*",
    "/tax-refund/:path*",

    "/swap/:path*",
    "/card/:path*",
    "/send/:path*",
    "/connect-wallet",
    "/receive/:path*",
    "/crypto/:path*",
    "/admin/:path*",
  ],
};