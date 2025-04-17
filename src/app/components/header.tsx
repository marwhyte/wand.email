'use client'

import { useEmailPreprocessor } from '@/app/hooks/useEmailPreprocessor'
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
  PaperAirplaneIcon,
} from '@heroicons/react/20/solid'
import { render } from '@react-email/components'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useIsMobile, useOpener } from '../hooks'
import { useEmailSave } from '../hooks/useEmailSave'
import { Logo } from './Logo'
import { Button } from './button'
import { AuthDialog } from './dialogs/auth-dialog'
import ExportDialog from './dialogs/export-dialog'
import ContentValidator from './email-workspace/content-validator'
import EmailRendererFinal from './email-workspace/email-renderer-final'
import { defaultEbayTemplate } from './email-workspace/templates/ecommerce/default-ebay-template'
import { defaultStripeTemplate } from './email-workspace/templates/newsletter/default-stripe'
import { outlineStocktwitsTemplate } from './email-workspace/templates/newsletter/outline-stocktwits'
import { defaultNikeVerificationTemplate } from './email-workspace/templates/transactional/default-nike-verification'
import { magicLinkTemplate } from './email-workspace/templates/transactional/magic-link'
import { outlineGoogleTemplate } from './email-workspace/templates/transactional/outline-google'
import { Email } from './email-workspace/types'
import Loading from './loading'
import Notification from './notification'
import { Tab, TabGroup, TabList } from './tab'

type Props = {
  chatStarted: boolean
  monthlyExportCount: number | null
}

// Rate limiting constants
const EMAIL_BURST_LIMIT = 3 // Allow 3 emails immediately
const RATE_LIMIT_RESET_TIME = 30 * 60 * 1000 // 30 minutes in milliseconds
const COOLDOWN_PERIODS = [
  { emailsSent: 3, cooldown: 60 }, // After 3 emails, wait 1 minute
  { emailsSent: 4, cooldown: 180 }, // After 4 emails, wait 3 minutes
  { emailsSent: 5, cooldown: 600 }, // After 5 emails, wait 10 minutes
  { emailsSent: 6, cooldown: 1800 }, // After 6 emails, wait 30 minutes
]

export function Header({ chatStarted, monthlyExportCount }: Props) {
  const session = useSession()
  const { email, setEmail } = useEmailStore()
  const { title, setTitle, company, exportType } = useChatStore()
  const isMobile = useIsMobile()
  const emailAttributes = getEmailAttributes(email)
  const { mobileView, setMobileView } = useMobileViewStore()
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const saveEmail = useEmailSave()
  const { showSignUpDialog, setShowSignUpDialog, stepType, setStepType } = useAuthStore()
  const { preprocessAndGetEmail, isProcessing: isPreprocessing } = useEmailPreprocessor()

  // Rate limiting state
  const [emailCount, setEmailCount] = useState(0)
  const [firstEmailTimestamp, setFirstEmailTimestamp] = useState<number | null>(null)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [cooldownTimerActive, setCooldownTimerActive] = useState(false)
  const [rateLimitNotification, setRateLimitNotification] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const exportOpener = useOpener()

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
    {
      name: 'Magic Link',
      value: magicLinkTemplate(),
    },
  ]

  // Load rate limiting data from localStorage on mount
  useEffect(() => {
    const storedCount = localStorage.getItem('emailCount')
    const storedTimestamp = localStorage.getItem('firstEmailTimestamp')
    const storedCooldown = localStorage.getItem('emailCooldown')

    const currentTime = Date.now()

    if (storedCount && storedTimestamp) {
      const timeElapsed = currentTime - Number(storedTimestamp)

      if (timeElapsed < RATE_LIMIT_RESET_TIME) {
        // Still within the rate limit window
        setEmailCount(Number(storedCount))
        setFirstEmailTimestamp(Number(storedTimestamp))

        // If there was a cooldown in progress, restore it
        if (storedCooldown) {
          const remainingCooldown = Math.max(0, Number(storedCooldown) - Math.floor(timeElapsed / 1000))
          if (remainingCooldown > 0) {
            setCooldownTime(remainingCooldown)
            setCooldownTimerActive(true)
          }
        }
      } else {
        // Reset if more than the rate limit reset time has passed
        resetRateLimiting()
      }
    }
  }, [])

  // Handle cooldown timer countdown
  useEffect(() => {
    if (cooldownTime > 0 && cooldownTimerActive) {
      timerRef.current = setTimeout(() => {
        setCooldownTime((prev) => {
          const newTime = prev - 1
          // Update localStorage with the new cooldown time
          localStorage.setItem('emailCooldown', newTime.toString())
          return newTime
        })
      }, 1000)
    } else if (cooldownTime === 0 && cooldownTimerActive) {
      setCooldownTimerActive(false)
      localStorage.removeItem('emailCooldown')

      // Show notification that cooldown has ended
      if (emailCount >= EMAIL_BURST_LIMIT) {
        setRateLimitNotification('Cooldown completed! You can send another test email now.')
        setTimeout(() => setRateLimitNotification(null), 3000)
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [cooldownTime, cooldownTimerActive, emailCount])

  // Reset rate limiting data
  const resetRateLimiting = () => {
    setEmailCount(0)
    setFirstEmailTimestamp(null)
    setCooldownTime(0)
    setCooldownTimerActive(false)
    localStorage.removeItem('emailCount')
    localStorage.removeItem('firstEmailTimestamp')
    localStorage.removeItem('emailCooldown')
  }

  // Check if time-based reset is needed
  useEffect(() => {
    if (firstEmailTimestamp !== null) {
      const checkResetInterval = setInterval(() => {
        const currentTime = Date.now()
        const timeElapsed = currentTime - firstEmailTimestamp

        if (timeElapsed >= RATE_LIMIT_RESET_TIME) {
          resetRateLimiting()
          clearInterval(checkResetInterval)
        }
      }, 60000) // Check every minute

      return () => clearInterval(checkResetInterval)
    }
  }, [firstEmailTimestamp])

  // Get the appropriate cooldown time based on number of emails sent
  const getCooldownTime = (count: number) => {
    for (let i = COOLDOWN_PERIODS.length - 1; i >= 0; i--) {
      if (count >= COOLDOWN_PERIODS[i].emailsSent) {
        return COOLDOWN_PERIODS[i].cooldown
      }
    }
    return 0
  }

  const sendTestEmail = async () => {
    if (!session?.data?.user?.email || !email) return

    // Check if we're in cooldown
    if (cooldownTime > 0) {
      setRateLimitNotification(`Please wait ${formatTime(cooldownTime)} before sending another email`)
      setTimeout(() => setRateLimitNotification(null), 3000)
      return
    }

    // Calculate new count and check if we need to apply cooldown
    const newCount = emailCount + 1

    // Apply rate limiting if needed
    if (newCount > EMAIL_BURST_LIMIT) {
      const newCooldownTime = getCooldownTime(emailCount)

      if (newCooldownTime > 0) {
        setCooldownTime(newCooldownTime)
        setCooldownTimerActive(true)
        localStorage.setItem('emailCooldown', newCooldownTime.toString())

        setRateLimitNotification(
          `Rate limit applied: Please wait ${formatTime(newCooldownTime)} before sending another email`
        )
        setTimeout(() => setRateLimitNotification(null), 5000)
      }
    }

    setEmailStatus('loading')
    setEmailCount(newCount)

    // Set timestamp for the first email in this window
    const currentTime = Date.now()
    if (firstEmailTimestamp === null) {
      setFirstEmailTimestamp(currentTime)
      localStorage.setItem('firstEmailTimestamp', currentTime.toString())
    }

    // Update localStorage
    localStorage.setItem('emailCount', newCount.toString())

    try {
      const processedEmail = await preprocessAndGetEmail(email)

      if (!processedEmail) {
        throw new Error('Failed to process email')
      }

      const response = await fetch('/api/send', {
        method: 'POST',
        body: JSON.stringify({
          html: render(EmailRendererFinal({ email: processedEmail, company: company, exportType })),
          email: session?.data?.user?.email,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setEmailStatus('success')
      } else {
        setEmailStatus('error')
        // Don't reset count on error, but do display error notification
      }
    } catch (error) {
      setEmailStatus('error')
      console.error('Error sending email:', error)
    }
  }

  // Format seconds into a human-readable time string
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
    } else {
      const hours = Math.floor(seconds / 3600)
      const remainingMinutes = Math.floor((seconds % 3600) / 60)
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
    }
  }

  // This is called when export dialog is manually closed
  const handleExportDialogClose = () => {
    exportOpener.close()
  }

  return (
    <header>
      <div
        className={classNames(
          'z-100 flex min-h-[71px] w-full items-center bg-white px-4 py-4 pt-5',
          chatStarted ? 'border-b border-gray-200' : '',
          isMobile && chatStarted ? 'justify-between' : 'justify-between',
          isMobile && session?.data?.user ? 'pl-[68px]' : ''
        )}
      >
        {!chatStarted || !isMobile ? (
          <Link
            onClick={() => {
              setEmail(null)
              setTitle(undefined)
            }}
            href="/"
            className="z-100 -m-1.5 p-1.5"
          >
            <span className="sr-only">wand.email</span>
            <Logo />
          </Link>
        ) : (
          <div className="flex-shrink-0">
            {title && <div className="max-w-[140px] truncate text-left text-sm font-medium">{title}</div>}
          </div>
        )}

        {title && !isMobile && (
          <div className="absolute left-1/2 max-w-[300px] -translate-x-1/2 truncate font-medium">{title}</div>
        )}

        {email && session?.data?.user && (
          <div className={classNames('flex items-center', isMobile && chatStarted ? 'space-x-2' : 'space-x-4')}>
            {(!isMobile || !chatStarted) && (
              <>
                {/* <Select
                  value={emailAttributes.styleVariant}
                  onChange={(e) => handleChange({ styleVariant: e.target.value as EmailStyleVariant })}
                >
                  <option value="default">Default</option>
                  <option value="outline">Outline</option>
                  <option value="clear">Clear</option>
                </Select> */}

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
              </>
            )}

            <Button
              disabled={emailStatus === 'loading' || cooldownTime > 0}
              onClick={sendTestEmail}
              tooltipPosition="left"
              tooltip={
                cooldownTime > 0
                  ? `Wait ${formatTime(cooldownTime)} to send again`
                  : emailCount >= EMAIL_BURST_LIMIT
                    ? `${EMAIL_BURST_LIMIT - (emailCount % EMAIL_BURST_LIMIT)} more before cooldown`
                    : 'Send test email'
              }
              tooltipId="send-test-email"
              size={isMobile && chatStarted ? 'small' : undefined}
            >
              {emailStatus === 'loading' ? (
                <Loading height={24} width={24} />
              ) : (
                <PaperAirplaneIcon className="h-4 w-4" />
              )}
            </Button>

            {!isMobile && <ContentValidator />}

            {!isMobile && (
              <Button
                onClick={exportOpener.open}
                color="purple"
                size={isMobile && chatStarted ? 'small' : undefined}
                tooltip="Export email"
                tooltipId="export-email"
                tooltipPosition="left"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                {session?.data?.user ? 'Export' : 'Sign up to export'}
              </Button>
            )}
          </div>
        )}
        {!session?.data?.user && (
          <>
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
            <div className="md:hidden">
              <Button
                outline
                size="small"
                onClick={() => {
                  setStepType('signup')
                  setShowSignUpDialog(true)
                }}
              >
                Get started
              </Button>
            </div>
          </>
        )}
      </div>
      {emailStatus === 'success' && <Notification title="Test email sent successfully!" status="success" />}
      {emailStatus === 'error' && <Notification title="Failed to send test email" status="failure" />}
      {rateLimitNotification && <Notification title={rateLimitNotification} status="failure" />}
      <ExportDialog
        open={exportOpener.isOpen}
        onClose={handleExportDialogClose}
        monthlyExportCount={monthlyExportCount}
      />

      <AuthDialog
        open={showSignUpDialog}
        onClose={() => setShowSignUpDialog(false)}
        stepType={stepType}
        onSwitchType={(type) => setStepType(type)}
      />
    </header>
  )
}
