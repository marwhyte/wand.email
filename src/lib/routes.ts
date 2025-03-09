export const LOGIN = '/login'
export const SIGNUP = '/signup'
export const ROOT = '/'
export const CHAT = '/chat'

export const PUBLIC_ROUTES = [
  ROOT,
  LOGIN,
  SIGNUP,
  '/api/auth/callback/google',
  '/api/auth/signin/google',
  '/api/auth/session',
  '/monitoring',
  '/api/auth/providers',
  '/api/register',
  '/api/auth/error',
  '/api/stripe-webhook',
  '/api',
  '/pricing',
  '/google-signin',
]
export const DEFAULT_REDIRECT = ROOT
