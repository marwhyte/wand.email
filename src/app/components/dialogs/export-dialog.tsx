import { useEmailSave } from '@/app/hooks/useEmailSave'
import { isLocalDev } from '@/constants'
import { addExport } from '@/lib/database/queries/exports'
import { ExportType } from '@/lib/database/types'
import { useAccountStore } from '@/lib/stores/accountStore'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getReactEmailCode } from '@/lib/utils/code-generation'
import { ChevronLeftIcon, CodeBracketIcon, PencilIcon } from '@heroicons/react/20/solid'
import { render } from '@react-email/components'
import { useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula as draculaSyntaxHighlighter } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useSWRConfig } from 'swr'
import AlertBox from '../alert-box'
import { Button } from '../button'
import ButtonCard from '../button-card'
import EmailRendererFinal from '../email-workspace/email-renderer-final'
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

function formatHTML(html: string): string {
  // Remove excess whitespace first
  html = html.replace(/>\s+</g, '><').trim()

  let formatted = ''
  let indentLevel = 0
  let inTag = false
  let inContent = false
  let skipIndent = false

  // Define self-closing tags that shouldn't increase indent
  const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link']
  let currentTag = ''
  let isSelfClosing = false

  for (let i = 0; i < html.length; i++) {
    const char = html[i]

    // Collect tag name to detect self-closing tags
    if (inTag && char !== ' ' && char !== '>' && char !== '/') {
      currentTag += char
    } else if (inTag && (char === ' ' || char === '>' || char === '/')) {
      isSelfClosing = selfClosingTags.includes(currentTag.toLowerCase()) || html.substring(i - 1, i + 1) === '/>'
      if (char !== '>') currentTag = ''
    }

    if (char === '<') {
      // Handle opening tag
      if (html[i + 1] !== '/') {
        if (inContent) {
          formatted += '\n' + '  '.repeat(indentLevel)
          inContent = false
        }

        formatted += '\n' + '  '.repeat(indentLevel)
        formatted += char
        inTag = true
        currentTag = ''

        // Only increase indent if not a self-closing tag
        if (!html.substring(i, i + 4).includes('<!--')) {
          indentLevel++
          skipIndent = false
        } else {
          skipIndent = true
        }
      }
      // Handle closing tag
      else {
        indentLevel--
        if (inContent) {
          formatted += '\n' + '  '.repeat(indentLevel)
          inContent = false
        } else {
          formatted += '\n' + '  '.repeat(indentLevel)
        }
        formatted += char
        inTag = true
      }
    }
    // End of tag
    else if (char === '>') {
      formatted += char
      inTag = false

      // If it was a self-closing tag, reduce indent level immediately
      if (isSelfClosing || skipIndent) {
        indentLevel--
        isSelfClosing = false
      }

      currentTag = ''

      // Check if there's content after this tag
      let j = i + 1
      while (j < html.length && html[j].trim() === '') j++
      if (j < html.length && html[j] !== '<') {
        inContent = true
      }
    }
    // Regular character
    else {
      formatted += char
    }
  }

  return formatted
}

const ExportDialog = ({ open, onClose, monthlyExportCount }: Props) => {
  const { email } = useEmailStore()
  const { company } = useChatStore()
  const saveEmail = useEmailSave()
  const { data: session } = useSession()
  const { plan } = usePlan()
  const { mutate } = useSWRConfig()
  const { setStepType, setShowAccountDialog } = useAccountStore()
  const [exportType, setExportType] = useState<ExportType | null>(null)
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null)
  const [notificationStatus, setNotificationStatus] = useState<'success' | 'failure'>('success')
  const [isEditingPreview, setIsEditingPreview] = useState(false)
  const [previewText, setPreviewText] = useState(email?.preview || '')
  const canExport = plan === 'pro' || (monthlyExportCount !== null && monthlyExportCount < 5) || isLocalDev

  const handleExport = async (type: ExportType) => {
    if (!email) return
    if (!canExport) return
    setExportType(type)
    await addExport(email, type)
    mutate('/api/exports/count')
  }

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewText(e.target.value)
  }

  const handlePreviewSave = () => {
    if (!email) return
    saveEmail({ ...email, preview: previewText })
    setIsEditingPreview(false)
  }

  const htmlEmailCode = open ? formatHTML(render(EmailRendererFinal({ email: email, company: company }))) : ''
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
        </DialogTitle>
        <DialogBody>
          {exportType === null && (
            <>
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
          {exportType === 'html' && (
            <div>
              <div className="relative">
                <div className="absolute bottom-2 right-2 mt-4 text-end">
                  <Button
                    color="light"
                    onClick={() => {
                      try {
                        navigator.clipboard.writeText(htmlEmailCode)
                        setNotificationMessage('HTML copied to clipboard')
                        setNotificationStatus('success')
                      } catch (err) {
                        console.error('Failed to copy HTML: ', err)
                        setNotificationMessage('Failed to copy HTML')
                        setNotificationStatus('failure')
                      }
                    }}
                  >
                    Copy HTML Code
                  </Button>
                </div>
                <div className="rounded border border-gray-700 bg-gray-900">
                  <SyntaxHighlighter
                    style={draculaSyntaxHighlighter}
                    language="html"
                    showLineNumbers={true}
                    wrapLines
                    customStyle={{ maxHeight: '400px', overflow: 'auto' }}
                  >
                    {htmlEmailCode}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
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
