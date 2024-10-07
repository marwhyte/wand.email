import { addExport } from '@/lib/database/queries/exports'
import { ExportType } from '@/lib/database/types'
import { getReactEmailCode } from '@/lib/utils/misc'
import { ChevronLeftIcon, ChevronRightIcon, CodeBracketIcon } from '@heroicons/react/20/solid'
import { CodeBlock, CodeInline, dracula, render } from '@react-email/components'
import { useCallback, useState } from 'react'
import AlertBox from '../alert-box'
import { Button } from '../button'
import { Dialog, DialogBody, DialogTitle } from '../dialog'
import { Heading } from '../heading'
import Nbsp from '../nbsp'
import Notification from '../notification'
import { Steps } from '../steps'
import { Strong, Text, TextLink } from '../text'
import { useEmail } from './email-provider'
import EmailRendererFinal from './email-renderer-final'

type Props = {
  open: boolean
  onClose: () => void
  monthlyExportCount: number | null
}

const ExportDialog = ({ open, onClose, monthlyExportCount }: Props) => {
  const { email } = useEmail()
  const [exportType, setExportType] = useState<ExportType | null>(null)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationStatus, setNotificationStatus] = useState<'success' | 'failure'>('success')

  console.log(notificationOpen)
  const handleExport = (type: ExportType) => {
    addExport(email, type)
    setExportType(type)
  }

  const htmlEmailCode = render(EmailRendererFinal({ email: email }))
  const reactEmailCode = getReactEmailCode(email)

  const handleCopyReact = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(reactEmailCode)
      setNotificationMessage('Code copied to clipboard')
      setNotificationStatus('success')
      setNotificationOpen(true)
    } catch (err) {
      console.error('Failed to copy: ', err)
      setNotificationMessage('Failed to copy code')
      setNotificationStatus('failure')
      setNotificationOpen(true)
    }
  }, [reactEmailCode])

  if (monthlyExportCount === null)
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          <Text>You must be logged in to export</Text>
        </DialogTitle>
      </Dialog>
    )

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {exportType ? (
            <Button className="-ml-4" plain onClick={() => setExportType(null)}>
              <ChevronLeftIcon className="size-4" />
              Back to export options
            </Button>
          ) : (
            'Select an export type'
          )}
          <div className="mt-4">
            <AlertBox
              action={{ onClick: () => {}, text: 'Upgrade' }}
              status={monthlyExportCount === 5 ? 'error' : 'info'}
            >
              You have made {monthlyExportCount} out of 5 monthly exports.
            </AlertBox>
          </div>
        </DialogTitle>
        <DialogBody>
          {exportType === null && (
            <div className="m mb-4">
              <Text className="text-sm">
                With these options, images are hosted by SentSwiftly. <Strong>Charges may apply.</Strong>
                <Nbsp />
                <TextLink href="https://sentswiftly.com/image-hosting" target="_blank">
                  Learn more
                </TextLink>
              </Text>
            </div>
          )}
          {exportType === 'react' && (
            <div>
              <Steps onFinish={onClose} steps={[{ name: 'install' }, { name: 'create' }, { name: 'integrate' }]}>
                {(currentStep) => {
                  if (currentStep.name === 'install') {
                    return (
                      <div>
                        <Heading className="text-center !text-base" level={3}>
                          Install
                          <Nbsp />
                          <TextLink href="https://react.email/docs/getting-started/installation" target="_blank">
                            react-email
                          </TextLink>
                          <Nbsp />
                          to your react project
                        </Heading>
                        <Text className="mt-4">npm</Text>
                        <CodeBlock
                          theme={dracula}
                          lineNumbers
                          language="bash"
                          code={`npm install @react-email/components`}
                        />
                        <Text>pnpm</Text>
                        <CodeBlock
                          theme={dracula}
                          lineNumbers
                          language="bash"
                          code={`pnpm install @react-email/components`}
                        />
                        <Text>yarn</Text>
                        <CodeBlock
                          theme={dracula}
                          lineNumbers
                          language="bash"
                          code={`yarn add @react-email/components`}
                        />
                      </div>
                    )
                  } else if (currentStep.name === 'create') {
                    return (
                      <div>
                        <Heading className="text-center !text-base" level={3}>
                          Create Email Component
                        </Heading>
                        <Text className="mt-4">
                          Create a new email component, for example <CodeInline>Email.tsx</CodeInline> in your project
                          and copy and paste the code below. A common practice is to create a new email folder in your
                          project.
                        </Text>
                        <div className="relative">
                          <div className="absolute bottom-2 right-2 mt-4 text-end">
                            <Button color="light" onClick={handleCopyReact}>
                              Copy React Code
                            </Button>
                          </div>
                          <CodeBlock
                            style={{
                              maxHeight: '200px',
                              overflow: 'auto',
                            }}
                            theme={dracula}
                            lineNumbers
                            language="typescript"
                            code={reactEmailCode}
                          />
                        </div>
                      </div>
                    )
                  } else if (currentStep.name === 'integrate') {
                    return (
                      <div>
                        <Heading className="text-center !text-base" level={3}>
                          Integrate with Email Provider
                        </Heading>
                        <Text className="mt-4">
                          Using react-email&apos;s docs, integrate the Email component with your email provider.
                          <Nbsp />
                          <TextLink href="https://react.email/docs/integrations/overview" target="_blank">
                            Learn more
                          </TextLink>
                        </Text>
                      </div>
                    )
                  }
                }}
              </Steps>
            </div>
          )}
          {exportType === 'html' && (
            <div>
              <CodeBlock theme={dracula} lineNumbers language="html" code={htmlEmailCode} />
            </div>
          )}
          {exportType === null && (
            <>
              <button
                disabled={monthlyExportCount >= 5 && process.env.NODE_ENV !== 'development'}
                className="mb-4 flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={() => {
                  handleExport('react')
                }}
              >
                <div className="flex items-center">
                  <img src="/react.svg" alt="React" className="mr-3 h-12 w-12" />
                  <div>
                    <div className="font-semibold">React Code</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Export as React code using react-email
                    </div>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </button>
              <button
                disabled={monthlyExportCount >= 5 && process.env.NODE_ENV !== 'development'}
                className="mb-4 flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={() => {
                  handleExport('html')
                }}
              >
                <div className="flex items-center">
                  <CodeBracketIcon className="mr-3 h-12 w-12 text-blue-500" />
                  <div>
                    <div className="font-semibold">HTML</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Download or copy HTML code</div>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </button>
            </>
          )}
        </DialogBody>
      </Dialog>

      {notificationOpen && <Notification title={notificationMessage} status={notificationStatus} duration={5000} />}
    </>
  )
}

export default ExportDialog
