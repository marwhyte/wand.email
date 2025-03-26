import { create } from 'zustand'

interface AccountStore {
  showAccountDialog: boolean
  setShowAccountDialog: (showAccountDialog: boolean) => void
  stepType: 'general' | 'subscription'
  setStepType: (stepType: 'general' | 'subscription') => void
}

export const useAccountStore = create<AccountStore>((set) => ({
  showAccountDialog: false,
  stepType: 'general',
  setShowAccountDialog: (showAccountDialog) => set({ showAccountDialog }),
  setStepType: (stepType) => set({ stepType }),
}))
