import { create } from 'zustand'
import { Company } from '../database/types'

type BorderRadiusOption = 'square' | 'rounded' | 'default'

interface ChatStore {
  chatStarted: boolean
  chatId: string | undefined
  company: Company | null
  title: string | undefined
  themeColor: string
  borderRadius: BorderRadiusOption
  hasConfirmedOutline: boolean
  setChatId: (id: string | undefined) => void
  setTitle: (title: string | undefined) => void
  setCompany: (company: Company | undefined) => void
  setChatStarted: (chatStarted: boolean) => void
  setThemeColor: (color: string) => void
  setBorderRadius: (radius: BorderRadiusOption) => void
  setHasConfirmedOutline: (hasConfirmedOutline: boolean) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  chatStarted: false,
  chatId: undefined,
  company: null,
  title: undefined,
  themeColor: '#8e6ff7',
  borderRadius: 'rounded',
  hasConfirmedOutline: false,
  setChatId: (id) => set({ chatId: id }),
  setTitle: (title) => set({ title }),
  setCompany: (company) => set({ company }),
  setChatStarted: (chatStarted) => set({ chatStarted }),
  setThemeColor: (color) => set({ themeColor: color }),
  setBorderRadius: (radius) => set({ borderRadius: radius }),
  setHasConfirmedOutline: (hasConfirmedOutline) => set({ hasConfirmedOutline }),
}))
