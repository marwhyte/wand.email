import { Chat, Company } from '@/lib/database/types'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useEffect } from 'react'
import { newsletterOutlineStocktwitsTemplate } from '../components/email-workspace/templates/newsletter/outline-stocktwits'

type Props = {
  chat?: Chat
  chatId: string
  company?: Company | null
}

export function useChatHistory({ chat, chatId, company }: Props) {
  const { setChatId, setTitle, setCompany } = useChatStore()
  const { setEmail } = useEmailStore()

  useEffect(() => {
    if (chat) {
      setEmail(newsletterOutlineStocktwitsTemplate() ?? undefined)
      setTitle(chat.title)
    } else {
      setEmail(undefined)
      setTitle(undefined)
      return
    }
  }, [chat?.id])

  useEffect(() => {
    setChatId(chatId)
  }, [chatId])

  useEffect(() => {
    if (company) {
      setCompany(company)
    }
  }, [company])
}
