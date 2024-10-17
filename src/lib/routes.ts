export const LOGIN = '/login'
export const SIGNUP = '/signup'
export const ROOT = '/'
export const HOME = '/home'
export const TEMPLATES = '/templates'
export const PUBLIC_ROUTES = [
  ROOT,
  LOGIN,
  SIGNUP,
  '/api/auth/callback/google',
  '/api/stripe-webhook',
  '/api',
  '/home',
  '/templates',
  '/templates/:id',
  '/pricing',
]
export const DEFAULT_REDIRECT = ROOT
