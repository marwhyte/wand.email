import type { Message } from 'ai'
import { create } from 'zustand'

interface ChatStore {
  chatId: string | undefined
  messages: Message[]
  title: string | undefined
  setChatId: (id: string | undefined) => void
  setTitle: (title: string | undefined) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  chatId: undefined,
  messages: [],
  title: undefined,
  setChatId: (id) => set({ chatId: id }),
  setTitle: (title) => set({ title }),
}))
