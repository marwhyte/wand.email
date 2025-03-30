import { create } from 'zustand'
import { Company } from '../database/types'

interface ChatStore {
  chatStarted: boolean
  chatId: string | undefined
  company: Company | null
  title: string | undefined
  setChatId: (id: string | undefined) => void
  setTitle: (title: string | undefined) => void
  setCompany: (company: Company | undefined) => void
  setChatStarted: (chatStarted: boolean) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  chatStarted: false,
  chatId: undefined,
  company: null,
  title: undefined,
  setChatId: (id) => set({ chatId: id }),
  setTitle: (title) => set({ title }),
  setCompany: (company) => set({ company }),
  setChatStarted: (chatStarted) => set({ chatStarted }),
}))
