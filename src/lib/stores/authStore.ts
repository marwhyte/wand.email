import { create } from 'zustand'

interface AuthStore {
  showSignUpDialog: boolean
  stepType: 'login' | 'signup'
  setShowSignUpDialog: (showSignUpDialog: boolean) => void
  setStepType: (stepType: 'login' | 'signup') => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  showSignUpDialog: false,
  stepType: 'signup',
  setShowSignUpDialog: (showSignUpDialog) => set({ showSignUpDialog }),
  setStepType: (stepType) => set({ stepType }),
}))
