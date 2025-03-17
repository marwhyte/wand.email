import { create } from 'zustand'
import { Company } from '../database/types'

interface ChatStore {
  chatId: string | undefined
  company: Company | null
  title: string | undefined
  setChatId: (id: string | undefined) => void
  setTitle: (title: string | undefined) => void
  setCompany: (company: Company | undefined) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  chatId: undefined,
  company: null,
  title: undefined,
  setChatId: (id) => set({ chatId: id }),
  setTitle: (title) => set({ title }),
  setCompany: (company) => set({ company }),
}))
