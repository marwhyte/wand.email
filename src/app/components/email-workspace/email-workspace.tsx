'use client'

import { Session } from 'next-auth'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import EmailEditor from './email-editor'
import EmailHeader from './email-header'
import EmailRenderer from './email-renderer'

type Props = {
  session: Session | null
  isProjects?: boolean
}

export default function Workspace({ session, isProjects = false }: Props) {
  const [mobileView, setMobileView] = useState(false)

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <EmailHeader isProjects={isProjects} session={session} setMobileView={setMobileView} />
        <div className="flex h-full w-full flex-row overflow-hidden" style={{ height: 'calc(100vh - 65px)' }}>
          <EmailRenderer mobileView={mobileView} />
          <EmailEditor />
        </div>
      </div>
    </DndProvider>
  )
}
