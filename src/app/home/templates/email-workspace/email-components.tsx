import { Button } from '@/app/components/button'
import Loading from '@/app/components/loading'
import Notification from '@/app/components/notification'
import { SidebarItem, SidebarLabel } from '@/app/components/sidebar'
import { Tab, TabGroup, TabList } from '@/app/components/tab'
import { capitalizeFirstLetter } from '@/lib/utils/misc'
import {
  ArrowTopRightOnSquareIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  H1Icon,
  LinkIcon,
  PhotoIcon,
} from '@heroicons/react/20/solid'
import { render } from '@react-email/components'
import { Session } from 'next-auth'
import { useState } from 'react'
import EmailRenderer from './email-renderer'

type Props = {
  setWidth: (width: '600' | '360') => void
  email: Email
  session: Session | null
}

export default function EmailComponents({ setWidth, email, session }: Props) {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const deviceOptions = [
    { name: <ComputerDesktopIcon className="h-5 w-5" />, value: 'desktop' },
    { name: <DevicePhoneMobileIcon className="h-5 w-5" />, value: 'mobile' },
  ]

  const [selectedDevice, setSelectedDevice] = useState(deviceOptions[0].value)

  const handleDeviceChange = (index: number) => {
    const newValue = deviceOptions[index].value
    setSelectedDevice(newValue)

    if (newValue === 'mobile') {
      setWidth('360')
    } else {
      setWidth('600')
    }
  }

  const sendEmail = async () => {
    if (!session?.user?.email) return
    if (!email) return

    setEmailStatus('loading')

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        body: JSON.stringify({
          html: render(EmailRenderer({ email: email, renderFullEmail: true })),
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

  const editableTypes: EmailBlockType[] = ['text', 'button', 'image', 'link', 'heading']

  const iconForType = (type: EmailBlockType) => {
    switch (type) {
      case 'text':
        return <DocumentTextIcon />
      case 'image':
        return <PhotoIcon />
      case 'button':
        return <ArrowTopRightOnSquareIcon />
      case 'link':
        return <LinkIcon />
      case 'heading':
        return <H1Icon />
    }
  }

  return (
    <div>
      {emailStatus === 'success' && <Notification title="Email sent successfully!" status="success" />}
      {emailStatus === 'error' && <Notification title="Failed to send email" status="failure" />}
      <div className="flex h-full w-full min-w-[180px] max-w-[226px] flex-col justify-start gap-4 border-l-[0.5px] border-r-[0.5px] border-zinc-200 bg-white px-2 py-4 align-middle lg:min-w-[270px] lg:max-w-[300px] dark:border-zinc-700 dark:bg-zinc-900">
        <TabGroup className="flex justify-center" onChange={handleDeviceChange}>
          <TabList>
            {deviceOptions.map((option) => (
              <Tab key={option.value}>{option.name}</Tab>
            ))}
          </TabList>
        </TabGroup>

        <Button onClick={sendEmail} disabled={emailStatus === 'loading'}>
          {emailStatus === 'loading' ? <Loading height={24} width={24} /> : 'Send'}
        </Button>
        <div>
          {editableTypes.map((type) => (
            <SidebarItem key={type}>
              {iconForType(type)}
              <SidebarLabel>{capitalizeFirstLetter(type)}</SidebarLabel>
            </SidebarItem>
          ))}
        </div>
      </div>
    </div>
  )
}
