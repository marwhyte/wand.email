import { getMessage, updateChat } from '@/lib/database/queries/chats'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { generateEmailScript } from '@/lib/utils/email-script-generator'
import { createScopedLogger } from '@/lib/utils/logger'
import { getEmailFromMessage } from '@/lib/utils/misc'
import { Message } from 'ai'
import { useEffect, useRef, useState } from 'react'
import { updateEmailForMessage } from '../(chat)/actions'

const logger = createScopedLogger('MessageParser')

export function useMessageParser(message: Message) {
  const { setEmail } = useEmailStore()
  const { chatId, themeColor, borderRadius } = useChatStore()
  const processedIds = useRef<Set<string>>(new Set())
  const lastContentRef = useRef<string>('')
  const [initialCheckDone, setInitialCheckDone] = useState(false)

  // One-time check to see if this message has already been processed
  useEffect(() => {
    if (!chatId || !message.id || initialCheckDone || processedIds.current.has(message.id)) {
      return
    }

    const checkIfProcessed = async () => {
      try {
        const storedMessage = await getMessage(message.id)
        if (storedMessage?.email) {
          // Message already has email content in database, mark as processed
          processedIds.current.add(message.id)
        }
        setInitialCheckDone(true)
      } catch (error) {
        logger.error('Error checking message status:', error)
        setInitialCheckDone(true) // Mark as done even on error to avoid infinite retries
      }
    }

    checkIfProcessed()
  }, [chatId, message.id, initialCheckDone])

  // Process message when it gets a closing tag
  useEffect(() => {
    if (!chatId || !message.content || processedIds.current.has(message.id) || !initialCheckDone) {
      return
    }

    // Check if new content contains a closing tag that wasn't there before
    const hasNewCloseTag = message.content.includes('</EMAIL>') && !lastContentRef.current.includes('</EMAIL>')

    // Update the last seen content
    lastContentRef.current = message.content

    // Only process when we see a new closing tag
    if (hasNewCloseTag) {
      const hasOpenTag = message.content.includes('<EMAIL') && message.content.match(/<EMAIL\s+[^>]*>/)

      // Only process if we have both opening and closing tags
      if (hasOpenTag) {
        // Mark as processed immediately to prevent reprocessing
        processedIds.current.add(message.id)
        processEmailContent(message)
      }
    }
  }, [message.content, message.id, chatId, initialCheckDone])

  const processEmailContent = (message: Message) => {
    const emailObject = getEmailFromMessage(message, themeColor, borderRadius)

    if (emailObject && chatId) {
      // Batch the state updates and database operations
      Promise.all([
        // Update store
        new Promise<void>((resolve) => {
          setEmail(emailObject)
          resolve()
        }),
        // Update database
        (async () => {
          await updateChat(chatId, { email: generateEmailScript(emailObject) })
          await updateEmailForMessage(chatId, message, emailObject)
          logger.debug(`Successfully processed email from message ${message.id}`)
        })(),
      ]).catch((error) => {
        logger.error(`Error updating email for message ${message.id}:`, error)
      })
    } else {
      // Log failure for debugging
      logger.warn(
        `Failed to process email from message ${message.id}: ${
          !emailObject ? 'No email object could be extracted' : 'No chatId available'
        }`
      )

      if (!emailObject) {
        logger.debug('Message content that failed to process:', {
          contentPreview: message.content.substring(0, 200),
          hasEmailTags: message.content.includes('<EMAIL') && message.content.includes('</EMAIL>'),
        })
      }
    }
  }
}
