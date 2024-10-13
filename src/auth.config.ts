import { NextAuthConfig } from 'next-auth'

export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    error: '/',
    signIn: '/',
    signOut: '/',
  },
  callbacks: {
    async authorized({ auth }) {
      const isAuthenticated = !!auth?.user

      return isAuthenticated
    },
  },
  providers: [],
} satisfies NextAuthConfig
