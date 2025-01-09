import { create } from 'zustand'

interface ChatState {
  started: boolean
  aborted: boolean
  showChat: boolean
  setKey: (key: keyof Omit<ChatState, 'setKey'>, value: boolean) => void
}

export const chatStore = create<ChatState>((set) => ({
  started: false,
  aborted: false,
  showChat: true,
  setKey: (key, value) => set({ [key]: value }),
}))
