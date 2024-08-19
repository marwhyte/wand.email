'use client'

import { Text } from '@/app/components/text'
import { getTemplate } from '@/lib/data/templates'
import { Session } from 'next-auth'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { BlockProvider } from './block-provider'
import EmailEditor from './email-editor'
import EmailHeader from './email-header'
import EmailRenderer from './email-renderer'

type Props = {
  id: string
  session: Session | null
}

export default function Workspace({ id, session }: Props) {
  const [email, setEmail] = useState<Email | null>(getTemplate(id))

  const handleSave = (email: Email) => {
    setEmail(email)
  }

  const [width, setWidth] = useState<'600' | '360'>('600')

  if (!email) {
    return <div>Email not found</div>
  }

  return (
    <BlockProvider>
      <DndProvider backend={HTML5Backend}>
        <div>
          <EmailHeader email={email} session={session} setWidth={setWidth} />
          {email ? (
            <div className="flex h-full w-full flex-row overflow-hidden" style={{ height: 'calc(100vh - 65px)' }}>
              <EmailRenderer onSave={handleSave} width={width} email={email} />
              <EmailEditor email={email} onSave={handleSave} />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Text>Template not found</Text>
            </div>
          )}
        </div>
      </DndProvider>
    </BlockProvider>
  )
}
