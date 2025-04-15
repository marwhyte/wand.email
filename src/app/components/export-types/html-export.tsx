import { CodeBracketIcon } from '@heroicons/react/20/solid'
import { render } from '@react-email/components'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula as draculaSyntaxHighlighter } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Button } from '../button'
import EmailRendererFinal from '../email-workspace/email-renderer-final'
import Notification from '../notification'
import { Text } from '../text'
import { ExportTypeProps } from './export-type'

// Function to format HTML with proper indentation (reused from export-dialog.tsx)
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

const HtmlExport = ({ email, company, onExportSuccess, onExportError }: ExportTypeProps) => {
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null)
  const [notificationStatus, setNotificationStatus] = useState<'success' | 'failure'>('success')

  if (!email) {
    return <Text>Email not found</Text>
  }

  const htmlEmailCode = formatHTML(
    render(
      EmailRendererFinal({
        email: email,
        company: company,
      })
    )
  )

  const handleCopyHtml = () => {
    try {
      navigator.clipboard.writeText(htmlEmailCode)
      setNotificationMessage('HTML copied to clipboard')
      setNotificationStatus('success')
    } catch (err) {
      console.error('Failed to copy HTML: ', err)
      setNotificationMessage('Failed to copy HTML')
      setNotificationStatus('failure')
      if (onExportError) onExportError('Failed to copy HTML to clipboard')
    }
  }

  return (
    <div className="space-y-4">
      {notificationMessage && (
        <div className="mb-2">
          <Notification
            title={notificationMessage}
            status={notificationStatus}
            onClose={() => setNotificationMessage(null)}
            skipClose={false}
          />
        </div>
      )}

      <div className="relative">
        <div className="absolute bottom-2 right-2 mt-4 text-end">
          <Button color="light" onClick={handleCopyHtml}>
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
  )
}

// Export both the component and the metadata
export const htmlExportType = {
  name: 'html',
  icon: <CodeBracketIcon className="mr-3 h-12 w-12 text-blue-500" />,
  title: 'HTML Code',
  description: 'Export as HTML code',
  component: HtmlExport,
}

export default HtmlExport
