'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

interface EmailContextType {
  currentBlock: EmailBlock | RowBlock | null
  setCurrentBlock: (block: EmailBlock | RowBlock | null) => void
  email: Email
  setEmail: (email: Email) => void
}

const EmailContext = createContext<EmailContextType | undefined>(undefined)

interface EmailProviderProps {
  children: ReactNode
  defaultEmail: Email
}

export function EmailProvider({ children, defaultEmail }: EmailProviderProps) {
  const [currentBlock, setCurrentBlock] = useState<EmailBlock | RowBlock | null>(null)
  const [email, setEmail] = useState<Email>(defaultEmail)

  return (
    <EmailContext.Provider value={{ currentBlock, setCurrentBlock, email, setEmail }}>{children}</EmailContext.Provider>
  )
}

export function useEmail() {
  const context = useContext(EmailContext)
  if (context === undefined) {
    throw new Error('useEmail must be used within an EmailProvider')
  }
  return context
}
