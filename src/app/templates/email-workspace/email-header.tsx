'use client'

import { Button } from '@/app/components/button'
import DarkModeToggle from '@/app/components/dark-mode-toggle'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/app/components/dialog'
import Loading from '@/app/components/loading'
import { Navbar, NavbarItem } from '@/app/components/navbar'
import Notification from '@/app/components/notification'
import { Tab, TabGroup, TabList } from '@/app/components/tab'
import {
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/20/solid'
import { render } from '@react-email/components'
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import EmailRendererFinal from './email-renderer-final'

type Props = {
  email: Email
  session: Session | null
  setMobileView: (mobileView: boolean) => void
}

const EmailHeader = ({ email, session, setMobileView }: Props) => {
  const router = useRouter()
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [showSignUpDialog, setShowSignUpDialog] = useState(false)

  const deviceOptions: { name: React.ReactNode; value: 'desktop' | 'mobile' }[] = [
    { name: <ComputerDesktopIcon className="h-5 w-5" />, value: 'desktop' },
    { name: <DevicePhoneMobileIcon className="h-5 w-5" />, value: 'mobile' },
  ]

  const handleDeviceChange = (index: number) => {
    const newValue: 'desktop' | 'mobile' = deviceOptions[index].value
    setMobileView(newValue === 'mobile')
    setSelectedDevice(newValue)
  }

  const sendTestEmail = async () => {
    if (!session?.user?.email) {
      setShowSignUpDialog(true)
      return
    }

    if (!session?.user?.email || !email) return

    setEmailStatus('loading')

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        body: JSON.stringify({
          html: render(EmailRendererFinal({ email: email })),
          email: session.user.email,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setEmailStatus('success')
      } else {
        setEmailStatus('error')
      }
    } catch (error) {
      setEmailStatus('error')
      console.error('Error sending email:', error)
    }
  }

  return (
    <>
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Navbar className="h-16">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                <NavbarItem href="/templates" className="ml-4">
                  <ChevronLeftIcon className="size-4" />
                  Back to Templates
                </NavbarItem>
              </div>
              <div className="flex items-center space-x-4">
                <DarkModeToggle />
                <TabGroup value={selectedDevice} className="flex justify-center" onChange={handleDeviceChange}>
                  <TabList>
                    {deviceOptions.map((option) => (
                      <Tab selected={option.value === selectedDevice} key={option.value}>
                        {option.name}
                      </Tab>
                    ))}
                  </TabList>
                </TabGroup>
                <Button onClick={sendTestEmail} disabled={emailStatus === 'loading'}>
                  {emailStatus === 'loading' ? <Loading height={24} width={24} /> : 'Send test email'}
                </Button>
                <Button color="blue">
                  <ArrowDownTrayIcon className="!text-white" />
                  {session?.user?.email ? 'Export' : 'Sign up to export'}
                </Button>
              </div>
            </div>
          </Navbar>
        </div>
        {emailStatus === 'success' && <Notification title="Test email sent successfully!" status="success" />}
        {emailStatus === 'error' && <Notification title="Failed to send test email" status="failure" />}
      </header>
      <Dialog open={showSignUpDialog} onClose={() => setShowSignUpDialog(false)} className="z-50">
        <DialogTitle>Sign Up Required</DialogTitle>
        <DialogBody>
          <DialogDescription>
            You need to sign up or log in to send a test email. Create an account to unlock this feature and more!
          </DialogDescription>
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setShowSignUpDialog(false)}>Cancel</Button>
          <Button color="blue" onClick={() => router.push('/signup')}>
            Sign Up
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EmailHeader
