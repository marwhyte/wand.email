import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { generateEmailScript } from '@/lib/utils/email-script-generator'
import { render } from '@react-email/components'
import { useState } from 'react'
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
  const emailScript = open && email ? generateEmailScript(email) : ''

  // Generate the complete HTML string
  const htmlContent = open ? render(EmailRendererFinal({ email: email, company: company })) : ''

  console.log(htmlContent)
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
        {selectedTab === 'preview' ? (
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
