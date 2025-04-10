import { getLastChat } from '@/lib/database/queries/chats'
import { Chat, Company } from '@/lib/database/types'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { useEffect } from 'react'

type Props = {
  chat?: Chat
  chatId: string
  company?: Company | null
}

export function useChatHistory({ chat, chatId, company }: Props) {
  const { setChatId, setTitle, setCompany, setThemeColor, themeColor, setBorderRadius } = useChatStore()
  const { setEmail } = useEmailStore()

  useEffect(() => {
    if (chat) {
      setEmail(chat.email ? parseEmailScript(chat.email, chat.color, chat.borderRadius) : null)
      setTitle(chat.title)
      setThemeColor(chat.color)
      setBorderRadius(chat.borderRadius)
    } else {
      setEmail(null)
      setTitle(undefined)

      if (themeColor === '#8e6ff7') {
        console.log('getting last chat')
        getLastChat().then((lastChat) => {
          console.log('lastChat', lastChat)
          if (lastChat) {
            setThemeColor(lastChat.color)
            setBorderRadius(lastChat.borderRadius)
          }
        })
      }

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
