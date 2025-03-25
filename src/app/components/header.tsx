'use client'

import { useAuthStore } from '@/lib/stores/authStore'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { getEmailAttributes } from '@/lib/utils/attributes'
import { classNames } from '@/lib/utils/misc'
import {
  ArrowDownTrayIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/20/solid'
import { render } from '@react-email/components'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { useOpener } from '../hooks'
import { useEmailSave } from '../hooks/useEmailSave'
import { Logo } from './Logo'
import { Button } from './button'
import { AuthDialog } from './dialogs/auth-dialog'
import ExportDialog from './dialogs/export-dialog'
import PreviewDialog from './dialogs/preview-dialog'
import EmailRendererFinal from './email-workspace/email-renderer-final'
import { defaultEbayTemplate } from './email-workspace/templates/ecommerce/default-ebay-template'
import { defaultStripeTemplate } from './email-workspace/templates/newsletter/default-stripe'
import { outlineStocktwitsTemplate } from './email-workspace/templates/newsletter/outline-stocktwits'
import { defaultNikeVerificationTemplate } from './email-workspace/templates/transactional/default-nike-verification'
import { outlineGoogleTemplate } from './email-workspace/templates/transactional/outline-google'
import { Email, EmailStyleVariant } from './email-workspace/types'
import Loading from './loading'
import Notification from './notification'
import { Select } from './select'
import { Tab, TabGroup, TabList } from './tab'

type Props = {
  chatStarted: boolean
  monthlyExportCount: number | null
}

export function Header({ chatStarted, monthlyExportCount }: Props) {
  const session = useSession()
  const { email, setEmail } = useEmailStore()
  const { chatId } = useChatStore()
  const emailAttributes = getEmailAttributes(email)
  const { title, setTitle, company } = useChatStore()
  const { mobileView, setMobileView } = useMobileViewStore()
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const saveEmail = useEmailSave(chatId)
  const { showSignUpDialog, setShowSignUpDialog, stepType, setStepType } = useAuthStore()

  const exportOpener = useOpener()
  const previewOpener = useOpener()

  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'mobile'>(mobileView ? 'mobile' : 'desktop')

  const deviceOptions: { name: React.ReactNode; value: 'desktop' | 'mobile' }[] = [
    { name: <ComputerDesktopIcon className="h-5 w-5" />, value: 'desktop' },
    { name: <DevicePhoneMobileIcon className="h-5 w-5" />, value: 'mobile' },
  ]

  const handleChange = useCallback(
    (attributes: Partial<Email>) => {
      if (!email) return
      const updatedEmail = { ...email, ...attributes }
      saveEmail(updatedEmail)
    },
    [email]
  )

  const handleDeviceChange = (index: number) => {
    const newValue: 'desktop' | 'mobile' = deviceOptions[index].value
    setMobileView?.(newValue === 'mobile')
    setSelectedDevice(newValue)
  }

  const templates = [
    {
      name: 'Stocktwits',
      value: outlineStocktwitsTemplate(),
    },
    {
      name: 'Ebay',
      value: defaultEbayTemplate,
    },
    {
      name: 'Google',
      value: outlineGoogleTemplate(),
    },
    {
      name: 'Stripe',
      value: defaultStripeTemplate(),
    },
    {
      name: 'Nike Verification',
      value: defaultNikeVerificationTemplate(),
    },
  ]

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
        <Link
          onClick={() => {
            setEmail(undefined)
            setTitle(undefined)
          }}
          href="/"
          className="-m-1.5 p-1.5"
        >
          <span className="sr-only">wand.email</span>
          <Logo className="z-100" />
        </Link>

        {title && <div className="absolute left-1/2 -translate-x-1/2 truncate font-medium">{title}</div>}

        {email && session?.data?.user && (
          <div className="flex items-center space-x-4">
            {process.env.NODE_ENV === 'development' && (
              <Select
                value={emailAttributes.styleVariant}
                onChange={(e) => setEmail(templates.find((t) => t.name === e.target.value)?.value)}
              >
                {templates.map((template) => (
                  <option key={template.name}>{template.name}</option>
                ))}
              </Select>
            )}
            <Select
              value={emailAttributes.styleVariant}
              onChange={(e) => handleChange({ styleVariant: e.target.value as EmailStyleVariant })}
            >
              <option value="default">Default</option>
              <option value="outline">Outline</option>
              <option value="clear">Clear</option>
            </Select>
            <TabGroup
              value={selectedDevice}
              className="flex min-w-fit flex-nowrap justify-center"
              onChange={handleDeviceChange}
            >
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
          </div>
        )}
        {!session?.data?.user && (
          <div className="hidden items-center space-x-4 md:flex">
            <Button
              color="white"
              onClick={() => {
                setStepType('login')
                setShowSignUpDialog(true)
              }}
            >
              Log in
            </Button>
            <Button
              color="purple"
              onClick={() => {
                setStepType('signup')
                setShowSignUpDialog(true)
              }}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
      {emailStatus === 'success' && <Notification title="Test email sent successfully!" status="success" />}
      {emailStatus === 'error' && <Notification title="Failed to send test email" status="failure" />}
      <ExportDialog open={exportOpener.isOpen} onClose={exportOpener.close} monthlyExportCount={monthlyExportCount} />
      <PreviewDialog open={previewOpener.isOpen} onClose={previewOpener.close} />

      <AuthDialog
        open={showSignUpDialog}
        onClose={() => setShowSignUpDialog(false)}
        stepType={stepType}
        onSwitchType={(type) => setStepType(type)}
      />
    </header>
  )
}
