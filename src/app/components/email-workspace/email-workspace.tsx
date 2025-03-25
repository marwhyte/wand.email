'use client'

import { useEmailStore } from '@/lib/stores/emailStore'
import { motion } from 'motion/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import EmailEditor from './email-editor'
import EmailRenderer from './email-renderer'

type Props = {
  isStreaming: boolean
}

export default function Workspace({ isStreaming }: Props) {
  const { email } = useEmailStore()

  if (!email) {
    return (
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 65px)' }}>
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"></div>
          <p className="text-gray-500">Loading email content...</p>
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="flex flex-row" style={{ height: 'calc(100vh - 65px)' }}>
          <EmailRenderer email={email} />
          <EmailEditor email={email} />
        </div>
      </motion.div>
    </DndProvider>
  )
}
