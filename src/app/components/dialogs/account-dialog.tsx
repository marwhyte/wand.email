import { cancelSubscription } from '@/app/actions/cancelSubscription'
import { createCheckoutSession } from '@/app/actions/checkoutSessions'
import { notifySlack } from '@/app/actions/notifySlack'
import { Dialog } from '@/app/components/dialogs/dialog'
import AccountForm from '@/app/forms/account-form'
import DeleteAccountForm from '@/app/forms/delete-account-form'
import { useAccountStore } from '@/lib/stores/accountStore'
import { Radio, RadioGroup } from '@headlessui/react'
import { CheckIcon, Cog6ToothIcon, CreditCardIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AlertBox from '../alert-box'
import { Badge } from '../badge'
import { Button } from '../button'
import { Divider } from '../divider'
import Loading from '../loading'
import { usePlan } from '../payment/plan-provider'
import { Switch } from '../switch'
import { Strong, Text, TextLink } from '../text'

type AccountDialogProps = {
  isOpen: boolean
  onClose: () => void
}

type Tier = {
  id: 'free' | 'pro'
  name: string
  color: 'blue' | 'purple'
  price: { monthly: string; annually: string }
  highlights: string[]
}

// Simplified tiers for two options
const tiers: Tier[] = [
  {
    id: 'free',
    name: 'Free',
    color: 'blue',
    price: {
      monthly: 'Free',
      annually: 'Free',
    },
    highlights: ['Create unlimited emails', 'Up to 5 exports per month', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    color: 'purple',
    price: {
      monthly: '$15',
      annually: '$180',
    },
    highlights: ['All Free features', 'Unlimited exports', 'Priority feature requests', 'Priority support'],
  },
]

const AccountDialog = ({ isOpen, onClose }: AccountDialogProps) => {
  const { stepType, setStepType, showAccountDialog, setShowAccountDialog } = useAccountStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  const session = useSession()
  const { plan, refetchUser } = usePlan()

  // Subscription state
  const [selectedTier, setSelectedTier] = useState(tiers[1])
  const [annually, setAnnually] = useState(false)
  const [upgradeSuccess, setUpgradeSuccess] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const menuItems: { id: 'general' | 'subscription'; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <Cog6ToothIcon className="h-5 w-5" /> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCardIcon className="h-5 w-5" /> },
  ]

  useEffect(() => {
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')

    if (success === 'true') {
      setShowAccountDialog(true)
      setStepType('subscription')
      setUpgradeSuccess(true)
      notifySlack(`${session.data?.user?.email} upgraded to ${selectedTier.id} plan`, 'upgrade')

      // Add retry mechanism with timeout
      const startTime = Date.now()
      const timeout = 30000 // 30 seconds timeout
      const interval = 2000 // Check every 2 seconds

      const checkSubscription = async () => {
        await refetchUser()
        const timeElapsed = Date.now() - startTime

        if (plan === 'pro' || timeElapsed >= timeout) {
          // Either plan is updated or we've timed out
          router.replace(window.location.pathname)
        } else {
          // Try again after interval
          setTimeout(checkSubscription, interval)
        }
      }

      checkSubscription()
    } else if (canceled === 'true') {
      setShowAccountDialog(true)
      setStepType('subscription')
      router.replace(window.location.pathname)
    }
  }, [searchParams, setShowAccountDialog, setStepType, router, plan, refetchUser])

  const handleUpgrade = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await createCheckoutSession(selectedTier.id, annually, window.location.href)
    } catch (error) {
      setError('An error occurred while creating the checkout session. Please contact support.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelClick = () => {
    setShowCancelConfirm(true)
  }

  const handleConfirmCancel = async () => {
    setError(null)
    setIsCanceling(true)

    try {
      await cancelSubscription()
      await refetchUser()
      notifySlack(`${session.data?.user?.email} cancelled their subscription`, 'upgrade')
      setCancelSuccess(true)
    } catch (error) {
      setError('An error occurred while canceling the subscription. Please try again.')
    } finally {
      setIsCanceling(false)
      setShowCancelConfirm(false)
    }
  }

  return (
    <>
      <Dialog className="overflow-hidden !p-0" open={isOpen} onClose={onClose} size="3xl">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="border-b border-gray-200 bg-gray-50 p-4 md:w-48 md:border-b-0 md:border-r">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setStepType(item.id)}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm ${
                    stepType === item.id ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{menuItems.find((i) => i.id === stepType)?.label}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {stepType === 'general' && (
              <div>
                <AccountForm />
                <Divider className="my-10" soft />
                <DeleteAccountForm />
              </div>
            )}

            {stepType === 'subscription' && (
              <div className="space-y-6">
                {upgradeSuccess && (
                  <AlertBox status="success" action={{ onClick: () => setUpgradeSuccess(false), text: 'Dismiss' }}>
                    Successfully upgraded your subscription!
                  </AlertBox>
                )}

                {cancelSuccess && (
                  <AlertBox status="success" action={{ onClick: () => setCancelSuccess(false), text: 'Dismiss' }}>
                    Successfully canceled your subscription!
                  </AlertBox>
                )}

                {plan === 'pro' ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="space-y-2">
                        <Strong>Current Plan: Pro</Strong>
                        <Text>You currently have access to all premium features.</Text>
                      </div>
                    </div>
                    <Button color="red" className="w-full" onClick={handleCancelClick} disabled={isCanceling}>
                      Cancel Subscription
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Billing Toggle */}
                    <div className="flex justify-end gap-2">
                      <Text>Monthly</Text>
                      <Switch checked={annually} onChange={setAnnually} color={selectedTier.color} />
                      <div>
                        <Text>Yearly</Text>
                        <Text
                          className={`text-xs ${selectedTier.color === 'purple' ? '!text-purple-500' : '!text-blue-500'}`}
                        >
                          Save 20%
                        </Text>
                      </div>
                    </div>

                    {/* Plan Selection */}
                    <RadioGroup
                      className="grid grid-cols-1 gap-4 md:grid-cols-2"
                      value={selectedTier.id}
                      onChange={(value) => setSelectedTier(tiers.find((tier) => tier.id === value) || tiers[1])}
                    >
                      {tiers.map((tier) => (
                        <Radio
                          key={tier.id}
                          value={tier.id}
                          className={`cursor-pointer rounded-lg border p-4 ${
                            selectedTier.id === tier.id
                              ? `border-${tier.color}-500 bg-${tier.color}-50`
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Strong>{tier.name}</Strong>
                              {plan === tier.id && <Badge>Current Plan</Badge>}
                            </div>
                            <Text className="text-2xl font-bold">
                              {annually ? tier.price.annually : tier.price.monthly}
                              <span className="text-sm font-normal text-gray-500">
                                {annually ? ' / year' : ' / month'}
                              </span>
                            </Text>
                            <ul className="space-y-2">
                              {tier.highlights.map((feature) => (
                                <li key={feature} className="flex items-center">
                                  <CheckIcon className={`mr-2 h-5 w-5 text-${tier.color}-500`} />
                                  <Text>{feature}</Text>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Radio>
                      ))}
                    </RadioGroup>

                    {/* Upgrade Button */}
                    <form onSubmit={handleUpgrade} className="mt-6">
                      <Button
                        type="submit"
                        color={selectedTier.color}
                        className="w-full"
                        disabled={plan === selectedTier.id || isLoading}
                      >
                        {isLoading ? (
                          <Loading width={20} height={20} />
                        ) : plan === selectedTier.id ? (
                          'Current Plan'
                        ) : (
                          `Upgrade to ${selectedTier.name}`
                        )}
                      </Button>
                    </form>
                  </>
                )}

                {error && (
                  <AlertBox status="error" action={{ onClick: () => setError(null), text: 'Dismiss' }}>
                    {error}
                    <br />
                    <TextLink href="mailto:support@wand.email">Contact support</TextLink>
                  </AlertBox>
                )}

                <Text className="mt-6 text-center text-sm">
                  Have questions? <TextLink href="mailto:support@wand.email">Contact support</TextLink>
                </Text>
              </div>
            )}
          </div>
        </div>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog darkBackdrop open={showCancelConfirm} onClose={() => setShowCancelConfirm(false)}>
        <div className="p-6">
          <Strong className="mb-4 block">Cancel Subscription</Strong>
          <Text>
            Are you sure you want to cancel your subscription? You&apos;ll lose access to Pro features at the end of
            your current billing period.
          </Text>
          <div className="mt-6 flex justify-end gap-3">
            <Button onClick={() => setShowCancelConfirm(false)} color="light">
              Keep Subscription
            </Button>
            <Button onClick={handleConfirmCancel} color="red">
              {isCanceling ? <Loading width={20} height={20} /> : 'Yes, Cancel'}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default AccountDialog
