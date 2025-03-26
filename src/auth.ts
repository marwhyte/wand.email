import NextAuth, { NextAuthConfig } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { authConfig } from './auth.config'
import { sendVerificationRequest } from './lib/auth/authSendRequest'
import KyselyAdapter from './lib/database/custom-adapter'
import { db } from './lib/database/db'

export const authOptions: NextAuthConfig = {
  ...authConfig,
  adapter: KyselyAdapter(db),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: 'noreply@wand.email',
      sendVerificationRequest: async (params) => {
        if (!params.provider.apiKey) {
          console.error('Missing Resend API key')
          throw new Error('Missing Resend API key')
        }

        console.log('Verification request params:', {
          to: params.identifier,
          from: params.provider.from,
          url: params.url,
          hasApiKey: !!params.provider.apiKey,
        })

        try {
          await sendVerificationRequest(params)
          console.log('Verification email sent successfully')
        } catch (error) {
          console.error('Detailed send error:', error)
          throw error
        }
      },
      async generateVerificationToken() {
        return crypto.randomUUID()
      },
    }),
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub as string
      }
      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions)
