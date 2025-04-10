import { create } from 'zustand'

interface ImageLimitState {
  // Track which chats have shown the limit warning
  shownLimitWarningForChats: Set<string>
  // Track if we've hit the limit in the current session
  hasHitLimit: boolean
  // Track which images are currently loading
  loadingImageIds: Map<string, boolean>
  // Track which images were generated using Pexels
  pexelsImageIds: Set<string>
  // Add a chat ID to the list of chats that have shown the warning
  markLimitWarningShown: (chatId: string) => void
  // Set the limit hit status
  setHasHitLimit: (hasHit: boolean) => void
  // Check if we should show the warning for a specific chat
  shouldShowLimitWarning: (chatId: string) => boolean
  // Set an image as loading
  setImageLoading: (imageId: string, isLoading: boolean) => void
  // Check if an image is loading
  isImageLoading: (imageId: string) => boolean
  // Mark an image as coming from Pexels
  markImageAsPexels: (imageId: string) => void
  // Check if an image is from Pexels
  isImageFromPexels: (imageId: string) => boolean
  // Reset the store state
  reset: () => void
}

export const useImageStore = create<ImageLimitState>((set, get) => ({
  shownLimitWarningForChats: new Set<string>(),
  hasHitLimit: false,
  loadingImageIds: new Map<string, boolean>(),
  pexelsImageIds: new Set<string>(),

  markLimitWarningShown: (chatId: string) => {
    set((state) => {
      const newSet = new Set(state.shownLimitWarningForChats)
      newSet.add(chatId)
      return { shownLimitWarningForChats: newSet }
    })
  },

  setHasHitLimit: (hasHit: boolean) => {
    set({ hasHitLimit: hasHit })
  },

  shouldShowLimitWarning: (chatId: string) => {
    const state = get()
    // Only show the warning if we've hit the limit and haven't shown it for this chat yet
    return state.hasHitLimit && !state.shownLimitWarningForChats.has(chatId)
  },

  setImageLoading: (imageId: string, isLoading: boolean) => {
    set((state) => {
      const newMap = new Map(state.loadingImageIds)
      if (isLoading) {
        newMap.set(imageId, true)
      } else {
        newMap.delete(imageId)
      }
      return { loadingImageIds: newMap }
    })
  },

  isImageLoading: (imageId: string) => {
    return get().loadingImageIds.has(imageId)
  },

  markImageAsPexels: (imageId: string) => {
    set((state) => {
      const newSet = new Set(state.pexelsImageIds)
      newSet.add(imageId)
      return { pexelsImageIds: newSet }
    })
  },

  isImageFromPexels: (imageId: string) => {
    return get().pexelsImageIds.has(imageId)
  },

  reset: () => {
    set({
      shownLimitWarningForChats: new Set<string>(),
      hasHitLimit: false,
      loadingImageIds: new Map<string, boolean>(),
      pexelsImageIds: new Set<string>(),
    })
  },
}))
