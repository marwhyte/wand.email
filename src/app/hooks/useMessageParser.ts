import { updateChat } from '@/lib/database/queries/chats'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { parseEmailScript, processEmailImages } from '@/lib/utils/email-script-parser'
import { createScopedLogger } from '@/lib/utils/logger'
import { Message } from 'ai'
import { useEffect, useState } from 'react'
import { Email } from '../components/email-workspace/types'

const logger = createScopedLogger('MessageParser')

// Helper to validate UUID format
const isValidUUID = (id: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export function useMessageParser(message: Message) {
  const { setEmail, email } = useEmailStore()
  const { chatId, setTitle } = useChatStore()
  const [emailStates, setEmailStates] = useState<Record<string, 'idle' | 'open' | 'closed' | 'done'>>({})
  const emailState = emailStates[message.id] ?? 'idle'
  const setEmailState = (state: 'idle' | 'open' | 'closed' | 'done') => setEmailStates((prev) => ({ ...prev, [message.id]: state }))

  useEffect(() => {
    const processMessage = async () => {
      const hasOpenTag = message.content.includes('<EMAIL') && message.content.match(/<EMAIL\s+(?:[^>]*\s+)?name=["'][^"']*["']/)

      if (isValidUUID(message.id)) {
        setEmailState('done')
      } else if (message.content.includes('</EMAIL>') && emailState === 'open') {
        setEmailState('closed')
      } else if (hasOpenTag && emailState === 'idle') {
        setEmailState('open')
      }
    }

    processMessage()
  }, [message.content, message.id, emailState])

  useEffect(() => {
    if (emailState === 'open') {
      const nameMatch = message.content.match(/<EMAIL\s+(?:[^>]*\s+)?name=["']([^"']*)["']/)
      if (nameMatch && chatId) {
        setTitle(nameMatch[1])
        updateChat(chatId, { title: nameMatch[1] })
      }
    } else if (emailState === 'closed') {
      const emailRegex = /<EMAIL\s+name=["'][^"']*["']\s*>([\s\S]*?)<\/EMAIL>/i
      const emailMatch = message.content.match(emailRegex)
      const nameMatch = message.content.match(/<EMAIL\s+(?:[^>]*\s+)?name=["']([^"']*)["']/)

      if (emailMatch && chatId && email && nameMatch) {
        const emailString = emailMatch[1]
        const emailObject: Email = { ...email, name: nameMatch[1], rows: parseEmailScript(emailString) }

        // Process images before updating the email
        processEmailImages(emailObject)
          .then((processedEmail) => {
            setEmail(processedEmail)
            updateChat(chatId, { email: processedEmail, title: nameMatch[1] })
            logger.debug('Found email:', emailMatch[1])
            setEmailState('done')
          })
          .catch((error) => {
            console.error('Error processing email images:', error)
            // Still update with original email if image processing fails
            setEmail(emailObject)
            updateChat(chatId, { email: emailObject, title: nameMatch[1] })
            setEmailState('done')
          })
      }
    }
  }, [emailState])
}
