'use client'

import { Button } from '@/app/components/button'
import { useAccountStore } from '@/lib/stores/accountStore'
import { useChatStore } from '@/lib/stores/chatStore'
import { useImageStore } from '@/lib/stores/imageStore'

export function ImageLimitBanner() {
  const { chatId } = useChatStore()
  const { shouldShowLimitWarning, markLimitWarningShown } = useImageStore()
  const { setStepType, setShowAccountDialog } = useAccountStore()

  const handleUpgradeClick = () => {
    // Set the account dialog to show the subscription step
    setStepType('subscription')
    setShowAccountDialog(true)
    // Mark this warning as shown so it doesn't appear again for this chat
    if (chatId) {
      markLimitWarningShown(chatId)
    }
  }

  // Mark the warning as shown if the user dismisses it
  const handleDismiss = () => {
    if (chatId) {
      markLimitWarningShown(chatId)
    }
  }

  // If there's no chat ID or we shouldn't show the warning, don't render anything
  if (!chatId || !shouldShowLimitWarning(chatId)) {
    return null
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom fixed bottom-4 right-4 z-50 max-w-sm duration-300">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-lg">
        <div className="flex flex-col gap-3">
          <div className="font-medium text-amber-900">You&apos;ve reached your monthly AI image limit</div>
          <p className="text-sm text-amber-700">
            Upgrade to our Pro plan to generate unlimited AI images for your emails. Images will now be generated using
            Pexels, a stock photo library.
          </p>
          <div className="flex justify-end gap-2">
            <Button outline onClick={handleDismiss}>
              Dismiss
            </Button>
            <Button color="purple" onClick={handleUpgradeClick}>
              Upgrade
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
