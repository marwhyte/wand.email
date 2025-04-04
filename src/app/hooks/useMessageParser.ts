import { updateChat } from '@/lib/database/queries/chats'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { generateEmailScript } from '@/lib/utils/email-script-generator'
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
    if (!chatId) return
    const emailObject = getEmailFromMessage(message)
    console.log('emailObject', emailObject)
    if (emailObject) {
      handleEmailUpdate(emailObject)
    }
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
  }, [message.content, message.id, chatId])

  // New helper function to handle email updates
  const handleEmailUpdate = (emailData: Email) => {
    if (!chatId) return

    setEmail(emailData)
    updateChat(chatId, { email: generateEmailScript(emailData) }).then(() => {
      updateEmailForMessage(chatId, message, emailData)
    })
  }

  // Helper function to process email content and avoid duplication
  const processEmailContent = (message: Message) => {
    const emailObject = getEmailFromMessage(message)

    if (emailObject && chatId) {
      handleEmailUpdate(emailObject)
    } else {
      // Even if we couldn't process it, mark it as processed to avoid infinite loops
      logger.warn(
        `Failed to process email from message ${message.id}: ${
          !emailObject ? 'No email object could be extracted' : 'No chatId available'
        }`
      )

      // For debugging purposes, log message content that caused the processing failure
      if (!emailObject) {
        logger.debug('Message content that failed to process:', {
          contentPreview: message.content,
          hasEmailTags: message.content.includes('<EMAIL') && message.content.includes('</EMAIL>'),
        })
      }

      setProcessedMessageIds((prev) => new Set([...prev, message.id]))
    }
  }
}
