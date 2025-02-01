import { createChat, updateChat } from '@/lib/database/queries/chats'
import { EmailScriptParser } from '@/lib/runtime/message-parser'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { createScopedLogger } from '@/lib/utils/logger'
import type { Message } from 'ai'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import { blankTemplate } from '../components/email-workspace/templates/blank-template'

const logger = createScopedLogger('useMessageParser')

interface MessageProcessingState {
  isProcessing: boolean
  isDone: boolean
}

export function useMessageParser(messages: Message[]) {
  const { setEmail, email } = useEmailStore()
  const { chatId, setChatId } = useChatStore()
  const [parsedMessages, setParsedMessages] = useState<{ [key: number]: string }>({})
  const [processingStates, setProcessingStates] = useState<{ [key: number]: MessageProcessingState }>({})
  const lastParsedLengths = useRef<{ [key: string]: number }>({})
  const processedContent = useRef<{ [key: string]: string }>({})

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Initialize processing states from existing messages
  const initializeProcessingStates = useCallback((messages: Message[]) => {
    const newStates: { [key: number]: MessageProcessingState } = {}

    messages.forEach((message, index) => {
      if (message.role === 'assistant') {
        const hasEmailOpen = message.content.includes('<EMAIL')
        const hasEmailClose = message.content.includes('</EMAIL>')

        if (hasEmailOpen || hasEmailClose) {
          newStates[index] = {
            isProcessing: hasEmailOpen && !hasEmailClose,
            isDone: hasEmailClose,
          }
        }
      }
    })

    setProcessingStates(newStates)
  }, [])

  console.log('this part of email', email)

  const emailParser = useCallback(
    () =>
      new EmailScriptParser({
        callbacks: {
          onEmailOpen: async (data) => {
            setProcessingStates((prev) => ({
              ...prev,
              [messages.length - 1]: { isProcessing: true, isDone: false },
            }))
            logger.trace('onEmailOpen', data)
            if (!chatId) {
              const newEmail = email ?? blankTemplate()
              // Create new chat
              const chat = await createChat(messages, data.name, newEmail)
              if (chat) {
                setChatId(chat.id)
                // Update URL without page navigation
                const params = new URLSearchParams(searchParams)
                params.set('id', chat.id)
                router.replace(`${pathname}?${params.toString()}`, { scroll: false })
              }
              return
            }

            if (!email) {
              console.error('There is no email')
              return
            }

            const newEmail: Email = {
              ...email,
              name: data.name,
            }

            console.log('newEmail open', newEmail)

            setEmail(newEmail)
            updateChat(chatId, {
              title: newEmail.name,
            })
          },
          onEmailClose: (data) => {
            setProcessingStates((prev) => ({
              ...prev,
              [messages.length - 1]: { isProcessing: false, isDone: true },
            }))
            logger.trace('onEmailClose', data)
            if (!email || !chatId) {
              console.log(`Email or chatId is not set. Email: ${email}, ChatId: ${chatId}`)
              return
            }
            const newEmail: Email = {
              ...email,
              rows: data.rows,
            }
            console.log('newEmail close', newEmail)
            setEmail(newEmail)
            updateChat(chatId, {
              email: newEmail,
            })
          },
        },
      }),
    [setEmail]
  )

  const parseMessages = useCallback(
    async (messages: Message[], isLoading: boolean) => {
      const parser = emailParser()
      const newParsedMessages: { [key: number]: string } = {}
      const newProcessingStates: { [key: number]: MessageProcessingState } = {}

      if (!isLoading) {
        parser.reset()
        lastParsedLengths.current = {}
        processedContent.current = {}
        initializeProcessingStates(messages)
      }

      for (let i = 0; i < messages.length; i++) {
        const message = messages[i]
        if (message.role === 'assistant') {
          const lastLength = lastParsedLengths.current[message.id] || 0
          const newContent = message.content.slice(lastLength)

          if (newContent.length > 0) {
            // Parse the entire message content through the parser
            const parsedContent = await parser.parse(message.id, message.content)
            processedContent.current[message.id] = parsedContent

            // Update processing states based on current content
            const hasEmailOpen = message.content.includes('<EMAIL')
            const hasEmailClose = message.content.includes('</EMAIL>')

            if (hasEmailOpen || hasEmailClose) {
              newProcessingStates[i] = {
                isProcessing: hasEmailOpen && !hasEmailClose,
                isDone: hasEmailClose,
              }
            }

            lastParsedLengths.current[message.id] = message.content.length
            newParsedMessages[i] = processedContent.current[message.id]
          }
        }
      }

      // Batch state updates
      setParsedMessages((prev) => ({ ...prev, ...newParsedMessages }))
      setProcessingStates((prev) => ({ ...prev, ...newProcessingStates }))
    },
    [emailParser]
  )

  return { parsedMessages, parseMessages, processingStates }
}
