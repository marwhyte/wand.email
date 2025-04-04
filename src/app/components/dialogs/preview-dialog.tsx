import { Email } from '@/app/components/email-workspace/types'
import { useEmailPreprocessor } from '@/app/hooks/useEmailPreprocessor'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { generateEmailScript } from '@/lib/utils/email-script-generator'
import { render } from '@react-email/components'
import { useEffect, useState } from 'react'
import EmailRendererFinal from '../email-workspace/email-renderer-final'
import { Tab, TabGroup, TabList } from '../tab'
import { Dialog, DialogBody, DialogTitle } from './dialog'

type Props = {
  open: boolean
  onClose: () => void
}

const PreviewDialog = ({ open, onClose }: Props) => {
  const { email } = useEmailStore()
  const { company } = useChatStore()
  const [selectedWidth, setSelectedWidth] = useState<'600' | '750'>('750')
  const [selectedTab, setSelectedTab] = useState<'preview' | 'script'>('preview')
  const [processedEmail, setProcessedEmail] = useState<Email | null>(null)
  const { preprocessAndGetEmail, isProcessing } = useEmailPreprocessor()

  // Process the email when the dialog opens or when the email changes
  useEffect(() => {
    if (!open || !email) return

    const processIcons = async () => {
      // Preprocess all icons in the email using our hook
      const emailWithIcons = await preprocessAndGetEmail(email)

      // Update the state with the processed email
      if (emailWithIcons) {
        setProcessedEmail(emailWithIcons)
      }
    }

    processIcons()
  }, [open, email, preprocessAndGetEmail])

  // Use the processed email for the script generation
  const emailScript = open && processedEmail ? generateEmailScript(processedEmail) : ''

  // Generate the complete HTML string from the processed email
  const htmlContent =
    open && processedEmail ? render(EmailRendererFinal({ email: processedEmail, company: company })) : ''

  const widthOptions = [
    { name: '600px', value: '600' },
    { name: '750px', value: '750' },
  ] as const

  const tabs = [
    { name: 'Preview', value: 'preview' },
    { name: 'Script', value: 'script' },
  ] as const

  const handleWidthChange = (index: number) => {
    setSelectedWidth(widthOptions[index].value)
  }

  const handleTabChange = (index: number) => {
    setSelectedTab(tabs[index].value)
  }

  return (
    <Dialog size="4xl" open={open} onClose={onClose}>
      <DialogTitle className="flex items-center justify-between">
        <span>Preview Email</span>
        <TabGroup value={selectedTab} onChange={handleTabChange} className="flex justify-center">
          <TabList>
            <Tab key="preview" selected={selectedTab === 'preview'}>
              Preview
            </Tab>
            <Tab key="script" selected={selectedTab === 'script'}>
              Script
            </Tab>
          </TabList>
        </TabGroup>
        <TabGroup value={selectedWidth} onChange={handleWidthChange} className="flex justify-center">
          <TabList>
            {widthOptions.map((option) => (
              <Tab key={option.value} selected={option.value === selectedWidth}>
                {option.name}
              </Tab>
            ))}
          </TabList>
        </TabGroup>
      </DialogTitle>
      <DialogBody>
        {isProcessing ? (
          <div className="flex h-[70vh] flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            <p className="mt-4">Processing email content...</p>
            <p className="mt-2 text-sm text-gray-500">
              Uploading icons to ensure your email looks perfect when delivered.
            </p>
          </div>
        ) : selectedTab === 'preview' ? (
          <iframe
            srcDoc={htmlContent}
            className="h-[70vh] border-0"
            style={{ width: `${selectedWidth}px` }}
            title="Email Preview"
            sandbox="allow-same-origin"
          />
        ) : (
          <pre className="h-[70vh] overflow-auto border p-4">{emailScript}</pre>
        )}
      </DialogBody>
    </Dialog>
  )
}

export default PreviewDialog
