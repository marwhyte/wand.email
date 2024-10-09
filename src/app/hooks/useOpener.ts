import { useCallback, useState } from 'react'

export interface Opener {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export function useOpener(initialState: boolean = false): Opener {
  const [isOpen, setIsOpen] = useState<boolean>(initialState)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, open, close, toggle }
}
