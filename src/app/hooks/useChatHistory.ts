import { createChat, getChatWithMessages, updateChat } from '@/lib/database/queries/chats'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import type { Message } from 'ai'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { blankTemplate } from '../components/email-workspace/templates/blank-template'
import { ebayTemplate } from '../components/email-workspace/templates/ebay-template'
import { Email } from '../components/email-workspace/types'

export function useChatHistory() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const chatId = searchParams.get('id')

  const [ready, setReady] = useState(!chatId)
  const [initialMessages, setInitialMessages] = useState<Message[]>([])

  const { setChatId, setTitle } = useChatStore()
  const { setEmail } = useEmailStore()

  useEffect(() => {
    if (!chatId) {
      setReady(true)
      setInitialMessages([])
      setEmail(undefined)
      setChatId(undefined)
      setTitle(undefined)
      return
    }

    const loadChat = async () => {
      try {
        const chat = await getChatWithMessages(chatId)

        if (chat) {
          setInitialMessages(chat.messages)
          setTitle(chat.title)
          setEmail(ebayTemplate ?? undefined)
          setChatId(chat.id)
          setReady(true)
        } else {
          router.replace('/')
        }
      } catch (error) {
        toast.error('Failed to load chat history')
        console.error(error)
      }
    }

    loadChat()
  }, [chatId, router])

  return {
    ready,
    initialMessages,
    storeMessageHistory: async (messages: Message[], email?: Email) => {
      try {
        if (!chatId) {
          const newEmail = email ?? blankTemplate()
          // Create new chat
          const chat = await createChat(messages, undefined, newEmail)
          if (chat) {
            setChatId(chat.id)
            // Update URL without page navigation
            const params = new URLSearchParams(searchParams)
            params.set('id', chat.id)
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
          }
        } else {
          await updateChat(chatId, { messages })
        }
      } catch (error) {
        toast.error('Failed to save chat history')
        console.error(error)
      }
    },
  }
}
