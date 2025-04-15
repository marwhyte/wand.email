import { authConfig } from '@/auth.config'
import { PUBLIC_ROUTES, ROOT } from '@/lib/routes'
import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { userExists } from './lib/database/queries/users'

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  // @ts-ignore
  const { nextUrl } = req

  const isAuthenticated = !!req.auth?.user

  // Only check user existence when:
  // 1. User is authenticated
  // 2. Request is not to public routes
  // 3. Request is not to API routes (to avoid checking during API calls)
  if (req.auth?.user?.email && !nextUrl.pathname.startsWith('/api') && nextUrl.pathname === ROOT) {
    const user = await userExists(req.auth.user.email)
    if (!user) {
      return NextResponse.redirect(new URL('/signout', nextUrl))
    }
  }

  // Check if this is a public route
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) =>
      nextUrl.pathname === route || (route.endsWith('/:id') && nextUrl.pathname.startsWith(route.replace('/:id', '/')))
  )

  // Special case for OAuth callback pages - these need to be public
  const isOAuthCallbackPage = nextUrl.pathname.startsWith('/oauth-callback/')

  // Only redirect unauthenticated users when accessing protected routes
  if (!isAuthenticated && !isPublicRoute && !isOAuthCallbackPage) {
    return Response.redirect(new URL(ROOT, nextUrl))
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc|oauth-callback)(.*)'],
}
