import { updateChat } from '@/lib/database/queries/chats'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { processEmailImages } from '@/lib/utils/email-script-parser'
import { createScopedLogger } from '@/lib/utils/logger'
import { getEmailFromMessage } from '@/lib/utils/misc'
import { Message } from 'ai'
import { useEffect, useState } from 'react'
import { updateEmailForMessage } from '../(chat)/actions'
import { Email } from '../components/email-workspace/types'

const logger = createScopedLogger('MessageParser')

export function useMessageParser(message: Message) {
  const { setEmail, email } = useEmailStore()
  const { chatId } = useChatStore()
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

  // New helper function to handle email updates
  const handleEmailUpdate = (emailData: Email) => {
    if (!chatId) return

    setEmail(emailData)
    updateChat(chatId, { email: emailData, previousEmail: emailData }).then(() => {
      updateEmailForMessage(chatId, message, emailData)
    })
  }

  // Helper function to process email content and avoid duplication
  const processEmailContent = (message: Message) => {
    const emailObject = getEmailFromMessage(email, message)

    if (emailObject && chatId) {
      // Process images before updating the email
      processEmailImages(emailObject)
        .then((processedEmail) => {
          handleEmailUpdate(processedEmail)
        })
        .catch((error) => {
          console.error('Error processing email images:', error)
          // Still update with original email if image processing fails
          handleEmailUpdate(emailObject)
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
