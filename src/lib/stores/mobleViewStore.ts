import { create } from 'zustand'

interface MobileViewStore {
  mobileView: boolean
  setMobileView: (mobileView: boolean) => void
}

export const useMobileViewStore = create<MobileViewStore>((set) => ({
  mobileView: false,
  setMobileView: (mobileView) => set({ mobileView }),
}))
