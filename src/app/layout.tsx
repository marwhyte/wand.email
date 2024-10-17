import { auth } from '@/auth'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { Inter } from 'next/font/google'
import Content from './content'

import { fetchUser } from './actions'
import PlanProvider from './components/payment/plan-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s - SentSwiftly',
    default: 'SentSwiftly - Create stunning emails with ease',
  },
  description: 'SentSwiftly is an email integration that allows you to create stunning emails with ease.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  const initialUser = await fetchUser()

  return (
    <html
      suppressHydrationWarning
      className="text-zinc-950 antialiased dark:bg-zinc-900 dark:text-white lg:bg-zinc-100 dark:lg:bg-zinc-950"
    >
      <head>
        <link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className={inter.className + ' h-full'}>
        <SessionProvider session={session}>
          <PlanProvider fetchUser={fetchUser} plan={initialUser?.plan}>
            <Content session={session}>{children}</Content>
          </PlanProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
