'use client'

import { Button } from '@/app/components/button'
import CustomIframe from '@/app/components/custom-iframe'
import { Heading } from '@/app/components/heading'
import Loading from '@/app/components/loading'
import Notification from '@/app/components/notification'
import { Tab, TabGroup, TabList } from '@/app/components/tab'
import { Text } from '@/app/components/text'
import { getTemplate, getTemplateName } from '@/lib/data/templates'
import { ChevronLeftIcon, ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/20/solid'
import { render } from '@react-email/components'
import { Session } from 'next-auth'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BlockProvider } from './block-provider'
import EmailEditor from './email-editor'
import EmailRenderer from './email-renderer'

type Props = {
  id: string
  session: Session | null
}

export default function Workspace({ id, session }: Props) {
  const deviceOptions = [
    { name: <ComputerDesktopIcon className="h-5 w-5" />, value: 'desktop' },
    { name: <DevicePhoneMobileIcon className="h-5 w-5" />, value: 'mobile' },
  ]

  const [template, setTemplate] = useState<Email | null>(getTemplate(id))
  const [selectedBlock, setSelectedBlock] = useState<EmailBlock | null>(null)
  const name = getTemplateName(id)

  const handleSave = (template: Email) => {
    setTemplate(template)
  }

  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [width, setWidth] = useState('600')
  const [selected, setSelected] = useState(deviceOptions[0].value)

  const handleChange = (index: number) => {
    const newValue = deviceOptions[index].value
    setSelected(newValue)

    if (newValue === 'mobile') {
      setWidth('360')
    } else {
      setWidth('600')
    }
  }

  const sendEmail = async () => {
    if (!session?.user?.email) return
    if (!template) return

    setEmailStatus('loading')

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        body: JSON.stringify({
          html: render(EmailRenderer({ template })),
          id: id,
          email: session?.user?.email || '',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setEmailStatus('success')
        console.log('Email sent successfully')
      } else {
        const error = await response.text()
        setEmailStatus('error')
        console.error('Failed to send email:', error)
      }
    } catch (error) {
      setEmailStatus('error')
      console.error('Error sending email:', error)
    }
  }

  // trigger a rerender when template changes
  const [key, setKey] = useState(0)
  useEffect(() => {
    setKey((prev) => prev + 1)
  }, [template])

  if (!template) {
    return <div>Template not found</div>
  }

  return (
    <BlockProvider>
      <div>
        {emailStatus === 'success' && <Notification title="Email sent successfully!" status="success" />}
        {emailStatus === 'error' && <Notification title="Failed to send email" status="failure" />}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/home/templates"
            className="inline-flex w-40 items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400"
          >
            <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
            Templates
          </Link>
          <Heading level={2}>{name}</Heading>
          <div className="flex w-40 gap-8">
            <TabGroup onChange={handleChange}>
              <TabList>
                {deviceOptions.map((option) => (
                  <Tab key={option.value}>{option.name}</Tab>
                ))}
              </TabList>
            </TabGroup>

            <Button onClick={sendEmail} disabled={emailStatus === 'loading' || !template}>
              {emailStatus === 'loading' ? <Loading height={24} width={24} /> : 'Send'}
            </Button>
          </div>
        </div>

        {template ? (
          <div className="flex h-full w-full flex-row gap-4">
            <CustomIframe id={id} width={width}>
              <EmailRenderer template={template} />
            </CustomIframe>
            <EmailEditor template={template} onSave={handleSave} />
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
