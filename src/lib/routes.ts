export const LOGIN = '/login'
export const SIGNUP = '/signup'
export const ROOT = '/'
export const HOME = '/home'
export const TEMPLATES = '/templates'
export const PUBLIC_ROUTES = [
  ROOT,
  LOGIN,
  SIGNUP,
  '/onboarding',
  '/api/auth/callback/google',
  '/api/auth/signin/google',
  '/api/auth/session',
  '/monitoring',
  '/api/auth/providers',
  '/api/register',
  '/api/auth/error',
  '/api/stripe-webhook',
  '/api',
  '/home',
  '/templates',
  '/templates/:id',
  '/pricing',
  '/google-signin',
]
export const DEFAULT_REDIRECT = ROOT
