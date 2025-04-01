import { Email, EmailBlock, RowBlock } from '@/app/components/email-workspace/types'
import { create } from 'zustand'

// Command bus for editor actions
export type EditorCommand = {
  type: 'bold' | 'italic' | 'underline' | 'link' | 'focus' | 'insertText'
  payload?: any
}

export interface EmailStore {
  currentBlock: EmailBlock | RowBlock | null
  setCurrentBlock: (block: EmailBlock | RowBlock | null) => void
  email: Email | null
  setEmail: (email: Email | null) => void
  editorCommand: EditorCommand | null
  executeCommand: (command: EditorCommand) => void
  clearCommand: () => void
}

export const useEmailStore = create<EmailStore>((set) => ({
  currentBlock: null,
  setCurrentBlock: (block) => set({ currentBlock: block }),
  email: null,
  setEmail: (email) => set({ email }),
  // Command bus
  editorCommand: null,
  executeCommand: (command) => set({ editorCommand: command }),
  clearCommand: () => set({ editorCommand: null }),
}))
