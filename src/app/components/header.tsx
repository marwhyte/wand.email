'use client'

import { useChatStore } from '@/lib/stores/chatStore'
import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { classNames } from '@/lib/utils/misc'
import {
  ArrowDownTrayIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/20/solid'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Logo } from './Logo'
import { Button } from './button'
import { Tab, TabGroup, TabList } from './tab'

type Props = {
  chatStarted: boolean
}

export function Header({ chatStarted }: Props) {
  const session = useSession()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const { title } = useChatStore()
  const { mobileView, setMobileView } = useMobileViewStore()

  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'mobile'>(mobileView ? 'mobile' : 'desktop')

  const deviceOptions: { name: React.ReactNode; value: 'desktop' | 'mobile' }[] = [
    { name: <ComputerDesktopIcon className="h-5 w-5" />, value: 'desktop' },
    { name: <DevicePhoneMobileIcon className="h-5 w-5" />, value: 'mobile' },
  ]

  const handleDeviceChange = (index: number) => {
    const newValue: 'desktop' | 'mobile' = deviceOptions[index].value
    setMobileView?.(newValue === 'mobile')
    setSelectedDevice(newValue)
  }

  return (
    <header>
      <div
        className={classNames(
          'z-100 flex w-full items-center justify-between bg-white px-4 py-4',
          chatStarted ? 'border-b border-gray-200' : ''
        )}
      >
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">SentSwiftly</span>
          <Logo className="z-100" text={false} />
        </Link>

        {title && <div className="absolute left-1/2 -translate-x-1/2 truncate font-medium">{title}</div>}

        {id && (
          <div className="flex items-center space-x-4">
            <TabGroup value={selectedDevice} className="flex justify-center" onChange={handleDeviceChange}>
              <TabList>
                {deviceOptions.map((option) => (
                  <Tab selected={option.value === selectedDevice} key={option.value}>
                    {option.name}
                  </Tab>
                ))}
              </TabList>
            </TabGroup>

            <Button tooltipPosition="bottom" tooltip="Send test email">
              <PaperAirplaneIcon className="h-4 w-4" />
            </Button>

            <Button color="purple">
              <ArrowDownTrayIcon className="h-4 w-4" />
              {session?.data?.user ? 'Export' : 'Sign up to export'}
            </Button>

            {!session?.data?.user && pathname !== '/login' && <Button href="/login">Log in</Button>}
            {!session?.data?.user && pathname !== '/signup' && (
              <Button color="purple" href="/signup">
                Get Started
              </Button>
            )}
          </div>
        )}
        {!session?.data?.user && (
          <div className="flex items-center space-x-4">
            <Button color="white" href="/login">
              Log in
            </Button>
            <Button color="purple" href="/signup">
              Sign up
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
