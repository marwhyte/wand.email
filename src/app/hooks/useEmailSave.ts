import { Email } from '@/app/components/email-workspace/types'
import { updateChat } from '@/lib/database/queries/chats'
import { useEmailStore } from '@/lib/stores/emailStore'
import debounce from 'lodash.debounce'
import { useCallback } from 'react'

export function useEmailSave(chatId?: string | null) {
  const { setEmail } = useEmailStore()
  const debouncedUpdateChat = useCallback(
    debounce((updatedTemplate: Email) => {
      if (chatId) {
        updateChat(chatId, { email: updatedTemplate })
      }
    }, 300),
    [chatId]
  )

  const saveEmail = useCallback(
    (updatedTemplate: Email) => {
      setEmail(updatedTemplate)
      debouncedUpdateChat(updatedTemplate)
    },
    [debouncedUpdateChat, setEmail]
  )

  return saveEmail
}
