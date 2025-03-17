import { Email, EmailBlock, RowBlock } from '@/app/components/email-workspace/types'
import { create } from 'zustand'

export interface EmailStore {
  currentBlock: EmailBlock | RowBlock | null
  setCurrentBlock: (block: EmailBlock | RowBlock | null) => void
  email: Email | null
  setEmail: (email: Email | undefined) => void
}

export const useEmailStore = create<EmailStore>((set) => ({
  currentBlock: null,
  setCurrentBlock: (block) => set({ currentBlock: block }),
  email: null,
  setEmail: (email) => set({ email }),
}))
