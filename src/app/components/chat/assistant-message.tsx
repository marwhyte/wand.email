import { EmailProcessingStatus } from '@/app/components/chat/email-processing-status'
import type { Message } from 'ai'
import { memo } from 'react'
import { OutlineViewer } from './outline-viewer'

interface AssistantMessageProps {
  content: string
  message: Message
  messages: Message[]
}

export const AssistantMessage = memo(({ content, message, messages }: AssistantMessageProps) => {
  // Remove triple backticks wrapping content if they exist
  // Also handle partial backticks at the beginning during streaming
  const cleanedContent = content
    .replace(/^```(?:.*?)\n([\s\S]*?)```$/m, '$1')
    .replace(/^`{1,3}(?:.*?)(?:\n|$)/, '') // Remove partial backticks at the beginning
    .replace(/```xml\b(?:\n[\s\S]*?```|(?!\n[\s\S]*?```))/g, '') // Remove XML code blocks (complete or incomplete)
    .replace(/```(?:html|markup)\b(?:\n[\s\S]*?```|(?!\n[\s\S]*?```))/g, '') // Also handle html/markup blocks (complete or incomplete)

  // Check if this is an outline message
  const isOutline = cleanedContent.includes('Email Type:') && cleanedContent.includes('1.')

  if (isOutline) {
    return <OutlineViewer content={cleanedContent} />
  }

  // Split content at first EMAIL tag - updated regex to not require name attribute
  const [beforeEmail, afterEmail] = cleanedContent.split(/<EMAIL\s*[^>]*>/)

  // If no EMAIL tag found, show full content
  if (!afterEmail) {
    return <div className="w-full overflow-hidden">{cleanedContent}</div>
  }

  // Check if there's a closing tag
  const hasEmailEnd = afterEmail.includes('</EMAIL>')

  // If closed, show content after closing tag
  const textAfterEnd = hasEmailEnd ? afterEmail.split('</EMAIL>')[1] : ''

  return (
    <div className="w-full overflow-hidden">
      {beforeEmail}
      <EmailProcessingStatus
        isComplete={hasEmailEnd}
        hasContentBefore={!!beforeEmail && beforeEmail.trim() !== ''}
        hasContentAfter={hasEmailEnd && !!textAfterEnd && textAfterEnd.trim() !== ''}
        message={message}
        messages={messages}
        disabled={!hasEmailEnd}
      />
      {hasEmailEnd && textAfterEnd}
    </div>
  )
})

AssistantMessage.displayName = 'AssistantMessage'
