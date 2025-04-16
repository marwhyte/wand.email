import { create } from 'zustand'

interface CompanyDialogStore {
  isOpen: boolean
  focusAddressField: boolean
  open: (focusAddress?: boolean) => void
  close: () => void
}

export const useCompanyDialogStore = create<CompanyDialogStore>((set) => ({
  isOpen: false,
  focusAddressField: false,
  open: (focusAddress = false) => set({ isOpen: true, focusAddressField: focusAddress }),
  close: () => set({ isOpen: false, focusAddressField: false }),
}))
