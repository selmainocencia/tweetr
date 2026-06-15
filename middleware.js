import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production",
  });
  const { pathname } = request.nextUrl;

  const protectedPaths = ["/profile"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/settings/:path*"],
};
