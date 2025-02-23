'use client'

import { updateChat } from '@/lib/database/queries/chats'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { classNames } from '@/lib/utils/misc'
import {
  ArrowDownTrayIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/20/solid'
import { render } from '@react-email/components'
import debounce from 'lodash.debounce'
import { useSession } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useOpener } from '../hooks'
import { Logo } from './Logo'
import { Badge } from './badge'
import { Button } from './button'
import EmailRendererFinal from './email-workspace/email-renderer-final'
import ExportDialog from './email-workspace/export-dialog'
import PreviewDialog from './email-workspace/preview-dialog'
import { CommonAttributes, Email, EmailBlockType } from './email-workspace/types'
import Loading from './loading'
import Notification from './notification'
import { Tab, TabGroup, TabList } from './tab'

type Props = {
  chatStarted: boolean
  monthlyExportCount: number | null
}

// Add new types for changelog
type ChangelogEntry = {
  timestamp: Date
  changes: ChangeType[]
  email: Email
}

type ChangeType =
  | { type: 'content'; blockId: string; field: string; old: string; new: string }
  | { type: 'attributes'; blockId: string; field: keyof CommonAttributes; old: string; new: string }
  | { type: 'structure'; action: 'add' | 'remove' | 'move'; blockId: string; blockType: EmailBlockType }
  | { type: 'email_settings'; field: keyof Email; old: string; new: string }

export function Header({ chatStarted, monthlyExportCount }: Props) {
  const session = useSession()
  const { email } = useEmailStore()
  const { chatId } = useChatStore()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([])

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const exportOpener = useOpener()
  const previewOpener = useOpener()
  const id = searchParams.get('id')
  const { title, company } = useChatStore()
  const { mobileView, setMobileView } = useMobileViewStore()
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const detectChanges = (oldEmail: Email, newEmail: Email): ChangeType[] => {
    const changes: ChangeType[] = []

    // Define type-safe email settings to check
    const emailSettings: (keyof Email)[] = ['fontFamily', 'bgColor', 'color', 'linkColor', 'width']

    // Check email-level settings
    emailSettings.forEach((field) => {
      if (oldEmail[field] !== newEmail[field]) {
        changes.push({
          type: 'email_settings' as const,
          field: field,
          old: String(oldEmail[field]),
          new: String(newEmail[field]),
        })
      }
    })

    // Compare rows and blocks
    const oldBlocks = oldEmail.rows.flatMap((row) => row.columns.flatMap((col) => col.blocks))
    const newBlocks = newEmail.rows.flatMap((row) => row.columns.flatMap((col) => col.blocks))

    // Check for content changes in existing blocks
    oldBlocks.forEach((oldBlock) => {
      const newBlock = newBlocks.find((b) => b.id === oldBlock.id)
      if (newBlock && 'content' in oldBlock && 'content' in newBlock) {
        if (oldBlock.content !== newBlock.content) {
          changes.push({
            type: 'content',
            blockId: oldBlock.id,
            field: 'content',
            old: oldBlock.content,
            new: newBlock.content,
          })
        }
      }
    })

    return changes
  }

  const debouncedSave = useCallback(
    debounce(async (email: Email) => {
      if (!chatId) return
      setSaveStatus('saving')

      try {
        await updateChat(chatId, { email: email })

        // Add new changelog entry
        setChangelog((prev) => {
          const lastEntry = prev[0]
          const changes = lastEntry
            ? detectChanges(lastEntry.email, email)
            : [
                {
                  type: 'email_settings' as const,
                  field: 'fontFamily' as keyof Email,
                  old: 'Initial state',
                  new: 'First save',
                },
              ]

          return [
            {
              timestamp: new Date(),
              changes,
              email: email,
            },
            ...prev,
          ]
        })

        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch (error) {
        console.error('Failed to save:', error)
        setSaveStatus('error')
      }
    }, 1500),
    [chatId]
  )

  useEffect(() => {
    if (!email || !chatId) return

    // Don't set saving status here anymore
    debouncedSave(email)

    // Cleanup function to cancel debounced save if component unmounts
    return () => debouncedSave.cancel()
  }, [debouncedSave, email, chatId])

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

  const sendTestEmail = async () => {
    if (!session?.data?.user?.email || !email) return

    setEmailStatus('loading')

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        body: JSON.stringify({
          html: render(EmailRendererFinal({ email: email, company: company })),
          email: session.data.user.email,
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
    <header>
      <div
        className={classNames(
          'z-100 flex w-full items-center justify-between bg-white px-4 py-4',
          chatStarted ? 'border-b border-gray-200' : ''
        )}
      >
        <a href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">SentSwiftly</span>
          <Logo className="z-100" text={false} />
        </a>

        {title && <div className="absolute left-1/2 -translate-x-1/2 truncate font-medium">{title}</div>}

        {id && session?.data?.user && (
          <div className="flex items-center space-x-4">
            {chatId && saveStatus === 'saving' && <Badge color="yellow">Saving...</Badge>}
            {chatId && saveStatus === 'saved' && <Badge color="lime">Saved!</Badge>}
            {chatId && saveStatus === 'error' && <Badge color="red">Save failed</Badge>}

            <TabGroup value={selectedDevice} className="flex justify-center" onChange={handleDeviceChange}>
              <TabList>
                {deviceOptions.map((option) => (
                  <Tab selected={option.value === selectedDevice} key={option.value}>
                    {option.name}
                  </Tab>
                ))}
              </TabList>
            </TabGroup>

            <Button onClick={previewOpener.open} tooltipPosition="left" tooltip="Preview email">
              <EyeIcon className="h-4 w-4" />
            </Button>

            <Button
              disabled={emailStatus === 'loading'}
              onClick={sendTestEmail}
              tooltipPosition="left"
              tooltip="Send test email"
            >
              {emailStatus === 'loading' ? (
                <Loading height={24} width={24} />
              ) : (
                <PaperAirplaneIcon className="h-4 w-4" />
              )}
            </Button>

            <Button onClick={exportOpener.open} color="purple">
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
      {emailStatus === 'success' && <Notification title="Test email sent successfully!" status="success" />}
      {emailStatus === 'error' && <Notification title="Failed to send test email" status="failure" />}
      <ExportDialog open={exportOpener.isOpen} onClose={exportOpener.close} monthlyExportCount={monthlyExportCount} />
      <PreviewDialog open={previewOpener.isOpen} onClose={previewOpener.close} />
    </header>
  )
}
