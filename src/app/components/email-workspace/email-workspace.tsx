'use client'

import { useEmailStore } from '@/lib/stores/emailStore'
import { motion } from 'framer-motion'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import EmailEditor from './email-editor'
import EmailRenderer from './email-renderer'

type Props = {
  chatStarted: boolean
  isStreaming: boolean
}

export default function Workspace({ chatStarted, isStreaming }: Props) {
  const { email } = useEmailStore()

  console.log('hi')

  if (!email || !chatStarted) {
    return null
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
