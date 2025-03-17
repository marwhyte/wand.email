import { EmailProcessingStatus } from '@/app/components/chat/email-processing-status'
import type { Message } from 'ai'
import { memo } from 'react'

interface AssistantMessageProps {
  content: string
  message: Message
  messages: Message[]
}

export const AssistantMessage = memo(({ content, message, messages }: AssistantMessageProps) => {
  // Remove triple backticks wrapping content if they exist
  // Also handle partial backticks at the beginning during streaming
  const cleanedContent = content.replace(/^```(?:.*?)\n([\s\S]*?)```$/m, '$1').replace(/^`{1,3}(?:.*?)(?:\n|$)/, '') // Remove partial backticks at the beginning

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
