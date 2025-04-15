import { useEmailPreprocessor } from '@/app/hooks/useEmailPreprocessor'
import { useEmailSave } from '@/app/hooks/useEmailSave'
import { isLocalDev } from '@/constants'
import { addExport } from '@/lib/database/queries/exports'
import { ExportType } from '@/lib/database/types'
import { useAccountStore } from '@/lib/stores/accountStore'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { ChevronLeftIcon, PencilIcon } from '@heroicons/react/20/solid'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'
import AlertBox from '../alert-box'
import { Button } from '../button'
import ButtonCard from '../button-card'
import { exportTypes } from '../export-types'
import { ExportTypeComponent } from '../export-types/export-type'
import { Input } from '../input'
import Notification from '../notification'
import { usePlan } from '../payment/plan-provider'
import { Text } from '../text'
import { Dialog, DialogBody, DialogTitle } from './dialog'

type Props = {
  open: boolean
  onClose: () => void
  monthlyExportCount: number | null
}

const ExportDialog = ({ open, onClose, monthlyExportCount }: Props) => {
  const { email } = useEmailStore()
  const { company, exportType: currentExportType } = useChatStore()
  const saveEmail = useEmailSave()
  const { data: session } = useSession()
  const { plan } = usePlan()
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)
  const { setStepType, setShowAccountDialog } = useAccountStore()
  const [selectedExportType, setSelectedExportType] = useState<ExportTypeComponent | null>(null)
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null)
  const [notificationStatus, setNotificationStatus] = useState<'success' | 'failure'>('success')
  const [isEditingPreview, setIsEditingPreview] = useState(false)
  const [previewText, setPreviewText] = useState(email?.preview || '')
  const [hasExportSucceeded, setHasExportSucceeded] = useState(false)
  const { preprocessAndGetEmail } = useEmailPreprocessor()
  const canExport = plan === 'pro' || (monthlyExportCount !== null && monthlyExportCount < 5) || isLocalDev

  // Find the default export type component based on the current export type from chat store
  const defaultExportTypeComponent = exportTypes.find((et) => et.name === currentExportType) || null

  const handleExportTypeSelection = (exportType: ExportTypeComponent) => {
    // Just set the selected export type to show its component
    // The export will be recorded on success
    setSelectedExportType(exportType)

    // For HTML export type, immediately record success since it's a direct export
    if (exportType.name === 'html' && email) {
      recordExport('html')
    }
  }

  // Add debugging for state changes
  useEffect(() => {
    console.log('selectedExportType changed:', selectedExportType?.name)
  }, [selectedExportType])

  const recordExport = async (type: ExportType) => {
    if (!email) return
    if (!canExport) return

    if (type === 'html') {
      setIsLoading(true)
    }

    try {
      // Preprocess the email to upload all icons to S3 using our hook
      const emailWithIcons = await preprocessAndGetEmail(email)

      if (!emailWithIcons) {
        throw new Error('Failed to process email')
      }

      // Record the export
      await addExport(emailWithIcons, type)
      mutate('/api/exports/count')
    } catch (error) {
      console.error('Error preprocessing email:', error)
      setNotificationMessage('Failed to record export.')
      setNotificationStatus('failure')
    } finally {
      if (type === 'html') {
        setIsLoading(false)
      }
    }
  }

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewText(e.target.value)
  }

  const handlePreviewSave = () => {
    if (!email) return
    saveEmail({ ...email, preview: previewText })
    setIsEditingPreview(false)
  }

  const handleExportSuccess = async () => {
    console.log('Export success called')

    // Mark export as succeeded before doing anything else
    setHasExportSucceeded(true)
    console.log('Export marked as succeeded')

    // Delay recording the export to ensure component updates are completed first
    setTimeout(async () => {
      try {
        // Only record the export if it was successful
        if (selectedExportType && email) {
          console.log('Recording export for:', selectedExportType.name)
          await recordExport(selectedExportType.name as ExportType)
        }

        // Update export count
        mutate('/api/exports/count')
      } catch (error) {
        console.error('Error recording export:', error)
        // Don't set notification message here to avoid UI updates
      }
    }, 500) // Half-second delay

    // We intentionally don't reset selectedExportType here to preserve the export view
  }

  // Custom close handler that respects export success state
  const handleDialogClose = () => {
    // Reset the success state when manually closing
    setHasExportSucceeded(false)
    // Reset selected export type
    setSelectedExportType(null)
    // Call the parent onClose
    onClose()
  }

  const handleExportError = (message: string) => {
    console.error('Export error:', message)
    setNotificationMessage(message)
    setNotificationStatus('failure')
  }

  if (!monthlyExportCount) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          <Text>You must be logged in to export</Text>
        </DialogTitle>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog size="xl" open={open} onClose={handleDialogClose}>
        <DialogTitle>
          {selectedExportType ? (
            <div className="flex items-center justify-between">
              <Button className="-ml-4" plain onClick={() => setSelectedExportType(null)}>
                <ChevronLeftIcon className="size-4" />
                Back to export options
              </Button>
              <div className="flex items-center text-sm">
                <Text className="mr-1 text-gray-500">Exporting as {selectedExportType.title}</Text>
              </div>
            </div>
          ) : (
            'Select an export type'
          )}
          <div className="mt-4">
            <AlertBox
              action={
                plan !== 'pro'
                  ? {
                      onClick: () => {
                        setStepType('subscription')
                        setShowAccountDialog(true)
                      },
                      text: 'Manage Subscription',
                    }
                  : undefined
              }
              status={!canExport ? 'error' : 'info'}
            >
              {plan === 'pro'
                ? `You have made ${monthlyExportCount} exports. You have unlimited exports on your current plan.`
                : `You have made ${monthlyExportCount} out of 5 monthly exports.`}
            </AlertBox>
          </div>
          {notificationMessage && (
            <div className="mt-2">
              <Notification
                title={notificationMessage}
                status={notificationStatus}
                onClose={() => setNotificationMessage(null)}
                skipClose={false}
              />
            </div>
          )}
        </DialogTitle>
        <DialogBody>
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
              <Text className="mt-4">Processing your email...</Text>
            </div>
          )}
          {!isLoading && !selectedExportType && (
            <>
              {defaultExportTypeComponent && (
                <div className="mb-6">
                  <Text className="mb-3 text-sm font-medium">Current Export Format</Text>
                  <ButtonCard
                    key={defaultExportTypeComponent.name}
                    icon={defaultExportTypeComponent.icon}
                    title={defaultExportTypeComponent.title}
                    description={defaultExportTypeComponent.description}
                    onClick={() => handleExportTypeSelection(defaultExportTypeComponent)}
                    disabled={!canExport}
                    highlight={true}
                  />
                </div>
              )}

              <div className="mb-6">
                <Text className="mb-3 text-sm font-medium">Other Export Options</Text>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                  {exportTypes
                    .filter((et) => et.name !== currentExportType)
                    .map((exportType) => (
                      <ButtonCard
                        key={exportType.name}
                        icon={exportType.icon}
                        title={exportType.title}
                        description={exportType.description}
                        onClick={() => handleExportTypeSelection(exportType)}
                        disabled={!canExport}
                      />
                    ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <Text className="text-sm font-medium">Email Preview</Text>
                  <Button
                    plain
                    onClick={() => setIsEditingPreview(!isEditingPreview)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <PencilIcon className="mr-1 h-4 w-4" />
                    {isEditingPreview ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
                <Text className="mb-3 text-sm text-gray-500">
                  This preview text appears in the email client&apos;s inbox before the email is opened. It helps
                  recipients decide whether to open your email.
                </Text>
                {isEditingPreview ? (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={previewText}
                        onChange={handlePreviewChange}
                        placeholder="Enter preview text..."
                      />
                    </div>
                    <div>
                      <Button onClick={handlePreviewSave}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Text className="text-sm">{email?.preview || 'No preview text set'}</Text>
                  </div>
                )}
              </div>
            </>
          )}
          {!isLoading && selectedExportType && (
            <selectedExportType.component
              email={email}
              company={company}
              onExportSuccess={handleExportSuccess}
              onExportError={handleExportError}
            />
          )}
        </DialogBody>
      </Dialog>
    </>
  )
}

export default ExportDialog
