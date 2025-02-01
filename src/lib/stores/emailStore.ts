import { create } from 'zustand'

export interface EmailStore {
  currentBlock: EmailBlock | RowBlock | null
  setCurrentBlock: (block: EmailBlock | RowBlock | null) => void
  email: Email | undefined
  setEmail: (email: Email | undefined) => void
}

export const useEmailStore = create<EmailStore>((set) => ({
  currentBlock: null,
  setCurrentBlock: (block) => set({ currentBlock: block }),
  email: undefined,
  setEmail: (email) => set({ email }),
}))
