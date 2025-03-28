import { create } from 'zustand'

interface ToolbarPosition {
  top: number
  left: number
  visible: boolean
}

interface ToolbarStore {
  position: ToolbarPosition
  setPosition: (position: ToolbarPosition) => void
  show: (top: number, left: number) => void
  hide: () => void
}

export const useToolbarStore = create<ToolbarStore>((set) => ({
  position: {
    top: 0,
    left: 0,
    visible: false,
  },
  setPosition: (position) => set({ position }),
  show: (top, left) => set({ position: { top, left, visible: true } }),
  hide: () => set({ position: { top: 0, left: 0, visible: false } }),
}))
