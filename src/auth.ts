import bcrypt from 'bcryptjs'
import NextAuth, { NextAuthConfig } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { authConfig } from './auth.config'
import { addUser, getUserByEmail, userExists } from './lib/database/queries/users'

interface Credentials {
  email: string
  password: string
}

export const authOptions: NextAuthConfig = {
  ...authConfig,
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          const user = await getUserByEmail(credentials.email as string)

          if (!user) {
            throw new Error('User not found')
          }

          if (!user.password) {
            throw new Error('Invalid credentials')
          }

          const isMatch = await bcrypt.compare(credentials.password as string, user.password)

          if (!isMatch) {
            throw new Error('Invalid credentials')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          if (error instanceof Error && error.message === 'User not found') {
            console.error('User not found')
            throw new Error('User not found')
          }

          console.error('Error during authorization:', error)
          throw new Error('Invalid credentials')
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      if (account?.provider === 'google') {
        try {
          let dbUser = await getUserByEmail(credentials?.email as string)
          if (!dbUser) {
            addUser({
              googleId: account.providerAccountId,
              name: profile?.name as string,
              email: user.email as string,
            })
          }
          user.id = dbUser?.id
          return true
        } catch (error) {
          console.error('Error during Google sign-in:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      const exists = await userExists(session.user.email as string)
      if (!exists) {
        // Instead of calling signOut, we'll return a modified session
        return { ...session, user: undefined }
      }
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === 'update') {
        console.log('session', session)
        const dbUser = await getUserByEmail(token.email as string)
        if (dbUser) {
          token.name = dbUser.name

          console.log(dbUser)
        }

        return token
      }
      if (user) {
        token.id = user.id
      }
      if (account && account.provider === 'google') {
        try {
          const dbUser = await getUserByEmail(token.email as string)
          if (dbUser) {
            token.id = dbUser.id
          }
        } catch (error) {
          console.error('Error fetching user from database:', error)
        }
      }
      return token
    },
  },
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions)
