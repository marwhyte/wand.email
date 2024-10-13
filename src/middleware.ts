import { auth } from '@/auth'
import { PUBLIC_ROUTES, ROOT } from './lib/routes'

export default auth((req) => {
  if (!req.auth && !PUBLIC_ROUTES.includes(req.nextUrl.pathname) && req.nextUrl.pathname !== ROOT) {
    const newUrl = new URL('/', req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
