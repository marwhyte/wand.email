import { createCheckoutSession } from '@/app/actions/checkoutSessions'
import { notifySlack } from '@/app/actions/notifySlack'
import { usePersistedState } from '@/app/hooks/usePersistedState'
import { Tier, tiers } from '@/lib/data/plans'
import { Radio, RadioGroup } from '@headlessui/react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AlertBox from '../alert-box'
import { Badge } from '../badge'
import { Button } from '../button'
import { Heading } from '../heading'
import Loading from '../loading'
import { usePlan } from '../payment/plan-provider'
import { Switch } from '../switch'
import { Strong, Text, TextLink } from '../text'
import { Dialog, DialogBody, DialogTitle } from './dialog'

const UpgradeDialog = () => {
  const router = useRouter()
  const pathname = usePathname()

  const { plan, refetchUser, upgradeDialogOpen, setUpgradeDialogOpen } = usePlan()

  const [step, setStep] = useState<'select-plan' | 'success-loading' | 'success'>('select-plan')

  const [selectedTier, setSelectedTier] = usePersistedState<Tier>('selectedTier', () => tiers[1], 'upgrade_dialog')

  const [annually, setAnnually] = usePersistedState<boolean>('annually', false, 'upgrade_dialog')

  const [upgradeSuccess, setUpgradeSuccess] = usePersistedState<boolean>('upgradeSuccess', false, 'upgrade_dialog')

  const [error, setError] = useState<string | null>(null)

  const onClose = () => {
    setUpgradeDialogOpen(false)
  }

  useEffect(() => {
    if (upgradeSuccess) {
      setStep('success-loading')
      setUpgradeSuccess(false)

      const checkSuccess = async () => {
        while (true) {
          const updatedUser = await refetchUser()

          if (updatedUser?.plan !== 'free') {
            notifySlack(`${updatedUser?.email} upgraded to ${updatedUser?.plan} plan`, 'upgrade')
            setStep('success')
            break
          }
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      }

      checkSuccess()
    }
  }, [upgradeSuccess, refetchUser, setUpgradeSuccess])

  const handleUpgrade = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    try {
      await createCheckoutSession(selectedTier.id, annually, window.location.href)
      setUpgradeSuccess(true)
    } catch (error) {
      setError('An error occurred while creating the checkout session. Please try again.')
    }
  }

  const handleSelectTier = (tier: Tier) => {
    setSelectedTier(tier)
  }

  const handleSelectAnnually = (annually: boolean) => {
    setAnnually(annually)
  }

  return (
    <Dialog background="gray" size="3xl" open={upgradeDialogOpen || step === 'success-loading'} onClose={onClose}>
      {step === 'select-plan' ? (
        <>
          <DialogTitle>
            <div className="mx-auto grid max-w-4xl grid-cols-3 items-center">
              <div className="flex items-center gap-2">
                <div>
                  <Text>Yearly Billing</Text>
                  <Text
                    className={`!text-xs !${
                      selectedTier.color === 'blue'
                        ? 'text-blue-500'
                        : selectedTier.color === 'green'
                          ? 'text-green-500'
                          : 'text-purple-500'
                    }`}
                  >
                    Save 20%
                  </Text>
                </div>
                <Switch color={selectedTier.color} checked={annually} onChange={handleSelectAnnually} />
              </div>
              <Heading level={1} className="text-center">
                Upgrade Your Plan
              </Heading>
              <div className="flex justify-end">
                <Button plain onClick={onClose}>
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DialogTitle>
          <DialogBody>
            <div className="mt-6 space-y-4">
              <RadioGroup
                className="mx-auto grid max-w-xl grid-cols-3 divide-x divide-gray-200 overflow-hidden rounded-lg bg-transparent bg-white px-1 text-center text-xs font-semibold leading-5 text-white shadow"
                value={selectedTier.id}
                onChange={(value) => handleSelectTier(tiers.find((tier) => tier.id === value) || tiers[0])}
              >
                {tiers.map((tier) => (
                  <Radio
                    key={tier.id}
                    value={tier.id}
                    className={`!mb-0 cursor-pointer border-b-4 py-3 ${
                      selectedTier.id === tier.id
                        ? selectedTier.color === 'blue'
                          ? '!border-b-blue-500'
                          : selectedTier.color === 'green'
                            ? '!border-b-green-500'
                            : '!border-b-purple-500'
                        : '!border-b-white'
                    }`}
                  >
                    <div className="flex w-full items-center justify-center">
                      <Text>{tier.name}</Text>
                      {plan === tier.id && <Badge className="ml-2">Your plan</Badge>}
                    </div>
                  </Radio>
                ))}
              </RadioGroup>
              {selectedTier && (
                <div
                  key={selectedTier.name}
                  className="mx-auto flex h-[300px] min-h-60 max-w-2xl flex-grow flex-col justify-between overflow-scroll rounded-lg border bg-white p-4"
                >
                  <div>
                    <Strong>{selectedTier.name}</Strong>
                    <Text className="mt-2 text-2xl font-bold">
                      {annually ? selectedTier.price.annually : selectedTier.price.monthly}
                      {annually ? ' / year' : ' / month'}
                    </Text>
                    <ul className="mt-4 grid grid-cols-2 space-y-2">
                      {selectedTier.highlights.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <CheckIcon
                            className={`mr-2 h-5 w-5 ${selectedTier.color === 'blue' ? 'text-blue-500' : selectedTier.color === 'green' ? 'text-green-500' : 'text-purple-500'}`}
                          />
                          <Text>{feature}</Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <form className="flex justify-center" onSubmit={handleUpgrade}>
                    <Button
                      type="submit"
                      tooltip={plan === selectedTier.id ? 'You are already on this plan' : ''}
                      disabled={plan === selectedTier.id}
                      color={selectedTier.color}
                      className="mx-auto mt-4 w-full max-w-lg"
                    >
                      {plan === 'free' ? 'Upgrade' : 'Switch'} to {selectedTier.name}
                    </Button>
                  </form>
                </div>
              )}
              {error && (
                <AlertBox status="error" action={{ onClick: () => setError(null), text: 'Dismiss' }}>
                  {error}
                </AlertBox>
              )}
            </div>

            <Text className="mt-6 text-center text-sm">
              Have questions? <TextLink href="mailto:support@wand.email">Contact support</TextLink>
            </Text>
          </DialogBody>
        </>
      ) : step === 'success-loading' ? (
        <div className="flex h-[300px] flex-col items-center justify-center">
          <Heading level={1}>Upgrading your plan! Please wait...</Heading>
          <div className="mt-4">
            <Loading />
          </div>
        </div>
      ) : (
        <div className="flex h-[300px] flex-col items-center justify-center">
          <video controls={false} className="h-[150px] w-[150px]" autoPlay muted playsInline>
            <source src="/email-animation.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <Heading level={1}>Welcome to {selectedTier.name} plan!</Heading>
          <div className="mt-4">
            <Button color="blue" onClick={onClose}>
              Continue
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  )
}

export default UpgradeDialog
