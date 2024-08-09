import { createContext, ReactNode, useContext, useState } from 'react'

interface Block {
  id: string
  // Add other block properties as needed
}

interface BlockContextType {
  currentBlock: Block | null
  setCurrentBlock: (block: Block | null) => void
}

const BlockContext = createContext<BlockContextType | undefined>(undefined)

export function BlockProvider({ children }: { children: ReactNode }) {
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null)

  return <BlockContext.Provider value={{ currentBlock, setCurrentBlock }}>{children}</BlockContext.Provider>
}

export function useBlock() {
  const context = useContext(BlockContext)
  if (context === undefined) {
    throw new Error('useBlock must be used within a BlockProvider')
  }
  return context
}
