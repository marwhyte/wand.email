import { createChat, getChatWithMessages, updateChat } from '@/lib/database/queries/chats'
import { getCompany } from '@/lib/database/queries/companies'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import type { Message } from 'ai'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { blankTemplate } from '../components/email-workspace/templates/blank-template'

export function useChatHistory() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const chatId = searchParams.get('id')

  const [ready, setReady] = useState(!chatId)
  const [initialMessages, setInitialMessages] = useState<Message[]>([])
  const [isCreatingChat, setIsCreatingChat] = useState(false)

  const { setChatId, setTitle, setCompany } = useChatStore()
  const { setEmail } = useEmailStore()

  useEffect(() => {
    if (!chatId) {
      setReady(true)
      setInitialMessages([])
      setEmail(undefined)
      setChatId(undefined)
      setTitle(undefined)
      setCompany(undefined)
      return
    }

    const loadChat = async () => {
      try {
        const chat = await getChatWithMessages(chatId)

        if (chat) {
          const company = chat.company_id ? await getCompany(chat.company_id) : undefined

          setInitialMessages(chat.messages)
          setTitle(chat.title)
          setEmail(chat.email ?? undefined)
          setChatId(chat.id)
          setCompany(company ?? undefined)
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
    storeMessageHistory: async (messages: Message[], companyId?: string | null) => {
      try {
        if (!chatId) {
          if (isCreatingChat) {
            return
          }
          setIsCreatingChat(true)

          const newEmail = blankTemplate()
          // Create new chat
          const chat = await createChat(messages, undefined, newEmail, companyId)

          if (chat) {
            setChatId(chat.id)
            setEmail(newEmail)
            // Set company when creating new chat
            if (companyId) {
              const company = await getCompany(companyId)
              setCompany(company ?? undefined)
            }
            // Update URL without page navigation
            const params = new URLSearchParams(searchParams)
            params.set('id', chat.id)
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
          }
          setIsCreatingChat(false)
        } else {
          await updateChat(chatId, { messages })
        }
      } catch (error) {
        setIsCreatingChat(false)
        toast.error('Failed to save chat history')
        console.error(error)
      }
    },
  }
}
