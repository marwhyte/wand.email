import { updateChat } from '@/lib/database/queries/chats'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { parseEmailScript, processEmailImages } from '@/lib/utils/email-script-parser'
import { createScopedLogger } from '@/lib/utils/logger'
import { Message } from 'ai'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { blankTemplate } from '../components/email-workspace/templates/blank-template'
import { Email } from '../components/email-workspace/types'

const logger = createScopedLogger('MessageParser')

export function useMessageParser(message: Message) {
  const { setEmail, email, setPreviousEmail } = useEmailStore()
  const { chatId } = useChatStore()
  const router = useRouter()
  const [processingMessageId, setProcessingMessageId] = useState<string | null>(null)
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Skip if we've already processed this message
    if (processedMessageIds.has(message.id)) {
      return
    }

    const hasOpenTag = message.content.includes('<EMAIL') && message.content.match(/<EMAIL\s+[^>]*>/)
    const hasCloseTag = message.content.includes('</EMAIL>')

    // Case 1: Message has open tag but no close tag - mark it for processing
    if (hasOpenTag && !hasCloseTag && processingMessageId !== message.id) {
      setProcessingMessageId(message.id)
      return
    }

    // Case 2: Message has both open and close tags in a single message
    if (hasOpenTag && hasCloseTag && !processedMessageIds.has(message.id)) {
      processEmailContent(message)
      return
    }

    // Case 3: This message has the close tag for a previously marked message
    if (hasCloseTag && processingMessageId) {
      processEmailContent(message)
      setProcessingMessageId(null)
    }
  }, [message.content, message.id])

  // Helper function to process email content and avoid duplication
  const processEmailContent = (message: Message) => {
    const emailRegex = /<EMAIL\s+[^>]*>([\s\S]*?)<\/EMAIL>/i
    const emailMatch = message.content.match(emailRegex)

    if (emailMatch && chatId) {
      const emailString = emailMatch[1]
      // Check if we need to use blankTemplate
      const isBlankTemplate = !email
      const emailObject: Email = {
        ...(email || blankTemplate()),
        rows: parseEmailScript(emailString),
      }

      // Process images before updating the email
      processEmailImages(emailObject)
        .then((processedEmail) => {
          setEmail(processedEmail)
          setPreviousEmail(emailObject)
          // Return the promise from updateChat so we can chain after it completes
          return updateChat(chatId, { email: processedEmail, previousEmail: processedEmail }).then(() => {
            logger.debug('Found email:', emailString)

            // If we're using a blank template, navigate to the chat route after chat update completes
            if (isBlankTemplate) {
              // router.push(`/chat/${chatId}`)
            }
          })
        })
        .catch((error) => {
          console.error('Error processing email images:', error)
          // Still update with original email if image processing fails
          setEmail(emailObject)
          setPreviousEmail(emailObject)
          // Return the promise from updateChat so we can chain after it completes
          return updateChat(chatId, { email: emailObject, previousEmail: emailObject }).then(() => {
            // Navigate even if image processing fails, but after chat update completes
            if (isBlankTemplate) {
              // router.push(`/chat/${chatId}`)
            }
          })
        })
        .finally(() => {
          // Mark this message as processed to prevent duplicate processing
          setProcessedMessageIds((prev) => new Set([...prev, message.id]))
        })
    } else {
      // Even if we couldn't process it, mark it as processed to avoid infinite loops
      setProcessedMessageIds((prev) => new Set([...prev, message.id]))
    }
  }
}
