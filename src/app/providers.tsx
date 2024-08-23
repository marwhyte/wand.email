'use client'

import { ReactNode } from 'react'

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    // <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    { children }
    // </ThemeProvider>
  )
}
