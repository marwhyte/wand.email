import { isLocalDev } from '@/constants'
import { addExport } from '@/lib/database/queries/exports'
import { ExportType } from '@/lib/database/types'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getReactEmailCode } from '@/lib/utils/code-generation'
import { ChevronLeftIcon, CodeBracketIcon } from '@heroicons/react/20/solid'
import { CodeBlock, CodeInline, dracula, render } from '@react-email/components'
import { useCallback, useState } from 'react'
import AlertBox from '../alert-box'
import { Button } from '../button'
import ButtonCard from '../button-card'
import EmailRendererFinal from '../email-workspace/email-renderer-final'
import { Heading } from '../heading'
import Nbsp from '../nbsp'
import Notification from '../notification'
import { Steps } from '../steps'
import { Strong, Text, TextLink } from '../text'
import { Dialog, DialogBody, DialogTitle } from './dialog'

type Props = {
  open: boolean
  onClose: () => void
  monthlyExportCount: number | null
}

const ExportDialog = ({ open, onClose, monthlyExportCount }: Props) => {
  const { email } = useEmailStore()
  const { company } = useChatStore()
  const [exportType, setExportType] = useState<ExportType | null>(null)
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null)
  const [notificationStatus, setNotificationStatus] = useState<'success' | 'failure'>('success')

  const canExport = (monthlyExportCount !== null && monthlyExportCount < 5) || isLocalDev

  const handleExport = (type: ExportType) => {
    if (!email) return
    if (!canExport) return
    addExport(email, type)
    setExportType(type)
  }

  const htmlEmailCode = open ? render(EmailRendererFinal({ email: email, company: company })) : ''
  const reactEmailCode = open ? getReactEmailCode(company, email) : ''

  const handleCopyReact = useCallback(async () => {
    try {
      if (!reactEmailCode) return
      await navigator.clipboard.writeText(reactEmailCode)
      setNotificationMessage('Code copied to clipboard')
      setNotificationStatus('success')
    } catch (err) {
      console.error('Failed to copy: ', err)
      setNotificationMessage('Failed to copy code')
      setNotificationStatus('failure')
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
      <Dialog size="xl" open={open} onClose={onClose}>
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
              action={{
                onClick: () => {
                  window.location.search = '?upgrade=true'
                },
                text: 'Upgrade',
              }}
              status={!canExport ? 'error' : 'info'}
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
              <Steps onFinish={onClose} steps={[{ name: 'Install' }, { name: 'Create' }, { name: 'Integrate' }]}>
                {(currentStep) => {
                  if (currentStep.name === 'Install') {
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
                  } else if (currentStep.name === 'Create') {
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
                            code={reactEmailCode ?? ''}
                          />
                        </div>
                      </div>
                    )
                  } else if (currentStep.name === 'Integrate') {
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
              <ButtonCard
                icon="/react.svg"
                title="React Code"
                description="Export as React code using react-email"
                onClick={() => {
                  handleExport('react')
                }}
                disabled={!canExport}
              />
              <ButtonCard
                icon={<CodeBracketIcon className="mr-3 h-12 w-12 text-blue-500" />}
                title="HTML Code"
                description="Export as HTML code"
                onClick={() => {
                  handleExport('html')
                }}
                disabled={!canExport}
              />
            </>
          )}
        </DialogBody>
      </Dialog>
      {notificationMessage && (
        <Notification
          onClose={() => setNotificationMessage(null)}
          title={notificationMessage}
          status={notificationStatus}
          duration={4000}
          skipClose
        />
      )}
    </>
  )
}

export default ExportDialog
