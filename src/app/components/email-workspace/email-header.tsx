'use client'

import { Button } from '@/app/components/button'
import DarkModeToggle from '@/app/components/dark-mode-toggle'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/app/components/dialog'
import { Input } from '@/app/components/input'
import Loading from '@/app/components/loading'
import { Navbar, NavbarItem } from '@/app/components/navbar'
import Notification from '@/app/components/notification'
import { Tab, TabGroup, TabList } from '@/app/components/tab'
import {
  ArrowDownTrayIcon,
  BookmarkSquareIcon,
  ChevronLeftIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/20/solid'
import { render } from '@react-email/components'
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Heading } from '../heading'
import { useEmail } from './email-provider'
import EmailRendererFinal from './email-renderer-final'

type Props = {
  session: Session | null
  setMobileView: (mobileView: boolean) => void
}

const EmailHeader = ({ session, setMobileView }: Props) => {
  const { email } = useEmail()
  const router = useRouter()
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [showSignUpDialog, setShowSignUpDialog] = useState(false)
  const [showProjectDialog, setShowProjectDialog] = useState(false)
  const [projectTitle, setProjectTitle] = useState('')

  const deviceOptions: { name: React.ReactNode; value: 'desktop' | 'mobile' }[] = [
    { name: <ComputerDesktopIcon className="h-5 w-5" />, value: 'desktop' },
    { name: <DevicePhoneMobileIcon className="h-5 w-5" />, value: 'mobile' },
  ]

  const handleDeviceChange = (index: number) => {
    const newValue: 'desktop' | 'mobile' = deviceOptions[index].value
    setMobileView(newValue === 'mobile')
    setSelectedDevice(newValue)
  }

  const handleSave = () => {}

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

  const handleAddToProjects = () => {
    if (!session?.user?.email) {
      setShowSignUpDialog(true)
    } else {
      setShowProjectDialog(true)
    }
  }

  const handleSaveProject = () => {
    // TODO: Implement project saving logic
    console.log('Saving project:', projectTitle)
    setShowProjectDialog(false)
    setProjectTitle('')
  }

  return (
    <>
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar className="h-16">
            <div className="flex w-full items-center">
              <div className="flex flex-1 items-center">
                <NavbarItem href="/templates" className="ml-4">
                  <ChevronLeftIcon className="size-4" />
                  Back to Templates
                </NavbarItem>
              </div>
              <div className="flex-1 text-center">
                <Heading level={1}>{email.name}</Heading>
              </div>
              <div className="flex flex-1 items-center justify-end space-x-4">
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
                <Button
                  tooltipPosition="bottom"
                  tooltip="Send test email"
                  onClick={sendTestEmail}
                  disabled={emailStatus === 'loading'}
                >
                  {emailStatus === 'loading' ? (
                    <Loading height={24} width={24} />
                  ) : (
                    <PaperAirplaneIcon className="h-4 w-4 !text-white" />
                  )}
                </Button>
                <Button color="green" onClick={handleAddToProjects}>
                  <BookmarkSquareIcon className="h-4 w-4 !text-white" />
                  Add to projects
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
      <Dialog open={showProjectDialog} onClose={() => setShowProjectDialog(false)} className="z-50">
        <DialogTitle>Add to Projects</DialogTitle>
        <DialogBody>
          <DialogDescription>
            Give your project a title and click &quot;Add&quot; to save it to your projects.
          </DialogDescription>
          <Input
            type="text"
            placeholder="Project title"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="mt-2"
          />
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setShowProjectDialog(false)}>Cancel</Button>
          <Button color="blue" onClick={handleSaveProject} disabled={!projectTitle.trim()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EmailHeader
