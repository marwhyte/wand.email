import { createContext, ReactNode, useContext, useState } from 'react'

interface BlockContextType {
  currentBlock: EmailBlock | null
  setCurrentBlock: (block: EmailBlock | null) => void
}

const BlockContext = createContext<BlockContextType | undefined>(undefined)

export function BlockProvider({ children }: { children: ReactNode }) {
  const [currentBlock, setCurrentBlock] = useState<EmailBlock | null>(null)

  return <BlockContext.Provider value={{ currentBlock, setCurrentBlock }}>{children}</BlockContext.Provider>
}

export function useBlock() {
  const context = useContext(BlockContext)
  if (context === undefined) {
    return { currentBlock: null, setCurrentBlock: null }
  }
  return context
}
