import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { render } from '@react-email/components'
import { useState } from 'react'
import { Dialog, DialogBody, DialogTitle } from '../dialog'
import { Tab, TabGroup, TabList } from '../tab'
import EmailRendererFinal from './email-renderer-final'

type Props = {
  open: boolean
  onClose: () => void
}

const PreviewDialog = ({ open, onClose }: Props) => {
  const { email } = useEmailStore()
  const { company } = useChatStore()
  const [selectedWidth, setSelectedWidth] = useState<'600' | '750'>('750')

  // Generate the complete HTML string
  const htmlContent = render(EmailRendererFinal({ email: email, company: company }))

  const widthOptions = [
    { name: '600px', value: '600' },
    { name: '750px', value: '750' },
  ] as const

  const handleWidthChange = (index: number) => {
    setSelectedWidth(widthOptions[index].value)
  }

  return (
    <Dialog size="4xl" open={open} onClose={onClose}>
      <DialogTitle className="flex items-center justify-between">
        <span>Preview Email</span>
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
        <iframe
          srcDoc={htmlContent}
          className="h-[70vh] border-0"
          style={{ width: `${selectedWidth}px` }}
          title="Email Preview"
          sandbox="allow-same-origin"
        />
      </DialogBody>
    </Dialog>
  )
}

export default PreviewDialog
