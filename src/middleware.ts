import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";

import { PUBLIC_ROUTES, ROOT, LOGIN, HOME } from "./lib/routes";

const { auth } = NextAuth(authConfig);
export async function middleware(request: any) {
  const session = await auth();
  const { nextUrl } = request;

  const isAuthenticated = !!session?.user;

  const isPublicRoute =
    PUBLIC_ROUTES.find((route) => nextUrl.pathname.startsWith(route)) ||
    nextUrl.pathname === ROOT;

  const isRoot = nextUrl.pathname === ROOT || nextUrl.pathname === "";

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isAuthenticated && isRoot) {
    return NextResponse.redirect(new URL(HOME, nextUrl));
  }

  // redirect /home to /home/templates
  if (isAuthenticated && nextUrl.pathname === HOME) {
    return NextResponse.redirect(new URL("/home/templates", nextUrl));
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
