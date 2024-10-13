import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'

import { authOptions } from './auth'
import { PUBLIC_ROUTES, ROOT } from './lib/routes'

const { auth } = NextAuth(authOptions)

export async function middleware(request: any) {
  const session = await auth()
  const { nextUrl } = request

  const isAuthenticated = !!session?.user?.email

  const isPublicRoute = PUBLIC_ROUTES.find((route) => nextUrl.pathname.startsWith(route)) || nextUrl.pathname === ROOT

  const isRoot = nextUrl.pathname === ROOT || nextUrl.pathname === ''

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/', nextUrl))
  }
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
