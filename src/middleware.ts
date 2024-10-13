import { authConfig } from '@/auth.config'
import { PUBLIC_ROUTES, ROOT } from '@/lib/routes'
import NextAuth from 'next-auth'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req

  const isAuthenticated = !!req.auth
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)

  if (!isAuthenticated && !isPublicRoute) return Response.redirect(new URL(ROOT, nextUrl))
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
