import { auth } from '@/auth'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'
import Content from './content'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s - SwiftMailer',
    default: 'SwiftMailer - Create stunning emails with ease',
  },
  description: 'SwiftMailer is an email integration that allows you to create stunning emails with ease.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html
      suppressHydrationWarning
      className="text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950"
    >
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className={inter.className + ' h-full'}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Content session={session}>{children}</Content>
        </ThemeProvider>
      </body>
    </html>
  )
}
