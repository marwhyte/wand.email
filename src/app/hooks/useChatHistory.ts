import { getLastChat } from '@/lib/database/queries/chats'
import { Chat, Company, ExportType } from '@/lib/database/types'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { parseEmailScript } from '@/lib/utils/email-script-parser'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

type Props = {
  chat?: Chat
  chatId: string
  company?: Company | null
}

export function useChatHistory({ chat, chatId, company }: Props) {
  const { setChatId, setTitle, setCompany, setThemeColor, themeColor, setBorderRadius, setExportType, exportType } =
    useChatStore()
  const { setEmail } = useEmailStore()
  const searchParams = useSearchParams()
  const exportTypeParam = searchParams?.get('exportType')

  // Handle URL param for export type if present
  useEffect(() => {
    if (exportTypeParam) {
      const validExportTypes: ExportType[] = ['html', 'mailchimp', 'react']
      if (validExportTypes.includes(exportTypeParam as ExportType)) {
        setExportType(exportTypeParam as ExportType)
      }
    }
  }, [exportTypeParam, setExportType])

  useEffect(() => {
    if (chat) {
      setEmail(chat.email ? parseEmailScript(chat.email, chat.color, chat.borderRadius) : null)
      setTitle(chat.title)
      setThemeColor(chat.color)
      setBorderRadius(chat.borderRadius)

      // Only set export type from chat if no URL parameter is present
      if (chat.exportType && !exportTypeParam) {
        setExportType(chat.exportType)
      }
    } else {
      setEmail(null)
      setTitle(undefined)

      if (themeColor === '#8e6ff7' || exportType === 'html') {
        getLastChat().then((lastChat) => {
          if (lastChat) {
            setThemeColor(lastChat.color)
            setBorderRadius(lastChat.borderRadius)

            // Only set export type from last chat if no URL parameter is present
            if (lastChat.exportType && !exportTypeParam) {
              setExportType(lastChat.exportType)
            }
          }
        })
      }

      return
    }
  }, [chat?.id, exportTypeParam])

  useEffect(() => {
    setChatId(chatId)
  }, [chatId])

  useEffect(() => {
    if (company) {
      setCompany(company)
    }
  }, [company])
}
