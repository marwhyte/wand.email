import { getCompany } from '@/lib/database/queries/companies'
import { Chat } from '@/lib/database/types'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useEffect } from 'react'

type Props = {
  chat?: Chat
}

export function useChatHistory({ chat }: Props) {
  const { setChatId, setTitle, setCompany } = useChatStore()
  const { setEmail } = useEmailStore()

  useEffect(() => {
    if (chat) {
      setEmail(chat.email ?? undefined)
      setChatId(chat.id)
      setTitle(chat.title)
    } else {
      setEmail(undefined)
      setChatId(undefined)
      setTitle(undefined)
      return
    }
  }, [chat])

  useEffect(() => {
    const fetchCompany = async () => {
      if (chat?.company_id) {
        const company = await getCompany(chat.company_id)
        setCompany(company ?? undefined)
      } else {
        setCompany(undefined)
      }
    }

    fetchCompany()
  }, [chat?.company_id])
}
