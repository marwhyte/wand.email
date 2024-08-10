'use client'

import { Text } from '@/app/components/text'
import { getTemplate } from '@/lib/data/templates'
import { Session } from 'next-auth'
import { useEffect, useState } from 'react'
import { BlockProvider } from './block-provider'
import EmailComponents from './email-components'
import EmailEditor from './email-editor'
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

  // trigger a rerender when template changes
  const [key, setKey] = useState(0)
  useEffect(() => {
    setKey((prev) => prev + 1)
  }, [email])

  if (!email) {
    return <div>Email not found</div>
  }

  return (
    <BlockProvider>
      <div>
        {email ? (
          <div className="flex h-full w-full flex-row gap-4 overflow-hidden" style={{ height: 'calc(100vh - 65px)' }}>
            <EmailComponents email={email} session={session} setWidth={setWidth} />
            <EmailRenderer width={width} email={email} />
            <EmailEditor email={email} onSave={handleSave} />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Text>Template not found</Text>
          </div>
        )}
      </div>
    </BlockProvider>
  )
}
